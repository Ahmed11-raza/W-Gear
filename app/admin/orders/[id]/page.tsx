import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Card, Badge } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { TrackingForm } from "@/components/admin/TrackingForm";
import { setOrderStatus } from "@/app/admin/actions";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  CreditCard,
  Printer,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
  "cancelled",
];

function statusTone(
  status: string,
): "neutral" | "good" | "warn" | "bad" {
  switch (status) {
    case "delivered":
      return "good";
    case "dispatched":
      return "good";
    case "confirmed":
      return "warn";
    case "pending":
      return "warn";
    case "cancelled":
      return "bad";
    default:
      return "neutral";
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId));

  if (!order) notFound();

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod === "raast"
        ? "Raast Instant Transfer"
        : "Debit / Credit Card";

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="mb-3 inline-flex items-center gap-1.5 text-[0.75rem] text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Order {order.reference}
            </h1>
            <p className="mt-0.5 text-xs text-white/50">
              Placed{" "}
              {order.createdAt.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={statusTone(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
            <StatusSelect
              id={order.id}
              value={order.status}
              options={ORDER_STATUSES}
              action={setOrderStatus}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main Column */}
        <div className="space-y-6">
          {/* Line Items */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
              <Package className="h-4 w-4" />
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[0.875rem]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/40">
                      Item
                    </th>
                    <th className="pb-2 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/40">
                      Size
                    </th>
                    <th className="pb-2 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/40">
                      Color
                    </th>
                    <th className="pb-2 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/40 text-right">
                      Qty
                    </th>
                    <th className="pb-2 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/40 text-right">
                      Unit Price
                    </th>
                    <th className="pb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/40 text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {order.lines.map((line, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 font-medium text-white">
                        {line.name}
                      </td>
                      <td className="py-3 pr-4 text-white/60">{line.size}</td>
                      <td className="py-3 pr-4 text-white/60">
                        {line.colorwayId || "—"}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-white/70">
                        {line.quantity}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-white/60">
                        {formatPrice(line.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-mono font-medium text-white">
                        {formatPrice(line.unitPrice * line.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-[0.8125rem] text-white/60">
                <span>Subtotal</span>
                <span className="font-mono">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[0.8125rem] text-white/60">
                <span>Shipping</span>
                <span className="font-mono">
                  {order.shipping > 0 ? formatPrice(order.shipping) : "Free"}
                </span>
              </div>
              {order.discountCode && (
                <div className="flex justify-between text-[0.8125rem] text-emerald-300">
                  <span>
                    Discount ({order.discountCode})
                  </span>
                  <span className="font-mono">
                    &minus;{formatPrice(order.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
                <span>Total</span>
                <span className="font-mono">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </Card>

          {/* Tracking & Shipping */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
              <Truck className="h-4 w-4" />
              Shipping & Tracking
            </h2>
            <TrackingForm
              orderId={order.id}
              trackingNumber={order.trackingNumber}
              courierName={order.courierName}
            />
          </Card>

          {/* Printable Packing Slip */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                <Printer className="h-4 w-4" />
                Packing Slip & Invoice
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-3 py-1.5 text-[0.75rem] font-semibold text-white/70 transition-colors hover:border-white/35 hover:text-white print:hidden"
                onClick={undefined}
                data-print-trigger
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>

            <div className="mt-4 rounded border border-dashed border-white/15 p-6 text-[0.8125rem] print:border-black print:text-black">
              <div className="flex justify-between border-b border-white/10 pb-4 print:border-black">
                <div>
                  <p className="text-lg font-bold text-white print:text-black">
                    W-GEAR
                  </p>
                  <p className="text-[0.75rem] text-white/50 print:text-gray-600">
                    Performance Apparel
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white print:text-black">
                    {order.reference}
                  </p>
                  <p className="text-[0.75rem] text-white/50 print:text-gray-600">
                    {order.createdAt.toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-[0.75rem]">
                <div>
                  <p className="font-semibold uppercase tracking-wider text-white/45 print:text-gray-500">
                    Ship To
                  </p>
                  <p className="mt-1 font-medium text-white print:text-black">
                    {order.customerName}
                  </p>
                  <p className="text-white/60 print:text-gray-600">
                    {order.address}
                  </p>
                  <p className="text-white/60 print:text-gray-600">
                    {[order.sector, order.city].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-white/60 print:text-gray-600">
                    {order.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold uppercase tracking-wider text-white/45 print:text-gray-500">
                    Payment
                  </p>
                  <p className="mt-1 text-white/70 print:text-gray-700">
                    {paymentLabel}
                  </p>
                  {order.trackingNumber && (
                    <>
                      <p className="mt-3 font-semibold uppercase tracking-wider text-white/45 print:text-gray-500">
                        Tracking
                      </p>
                      <p className="mt-1 font-mono text-white/70 print:text-gray-700">
                        {order.courierName}: {order.trackingNumber}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <table className="mt-4 w-full border-t border-white/10 text-[0.75rem] print:border-black">
                <thead>
                  <tr className="text-white/40 print:text-gray-500">
                    <th className="py-2 text-left">Item</th>
                    <th className="py-2 text-left">Size</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-white/70 print:text-gray-700">
                  {order.lines.map((line, i) => (
                    <tr key={i} className="border-t border-white/5 print:border-gray-200">
                      <td className="py-1.5">{line.name}</td>
                      <td className="py-1.5">{line.size}</td>
                      <td className="py-1.5 text-right">{line.quantity}</td>
                      <td className="py-1.5 text-right font-mono">
                        {formatPrice(line.unitPrice * line.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-white/10 print:border-black font-bold text-white print:text-black">
                  <tr>
                    <td colSpan={3} className="py-2 text-right">
                      Total
                    </td>
                    <td className="py-2 text-right font-mono">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <h2 className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
              Customer
            </h2>
            <div className="space-y-3 text-[0.8125rem]">
              <p className="text-base font-bold text-white">
                {order.customerName}
              </p>
              <div className="flex items-start gap-2 text-white/60">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
                <span>{order.phone}</span>
              </div>
              {order.email && (
                <div className="flex items-start gap-2 text-white/60">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
                  <span>{order.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
                <div>
                  <p>{order.address}</p>
                  <p>
                    {[order.sector, order.city].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
              <CreditCard className="h-4 w-4" />
              Payment
            </h2>
            <div className="space-y-2 text-[0.8125rem]">
              <div className="flex justify-between">
                <span className="text-white/60">Method</span>
                <span className="font-medium text-white">{paymentLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total</span>
                <span className="font-mono font-bold text-white">
                  {formatPrice(order.total)}
                </span>
              </div>
              {order.discountCode && (
                <div className="flex justify-between text-emerald-300">
                  <span>Code: {order.discountCode}</span>
                  <span className="font-mono">
                    &minus;{formatPrice(order.discountAmount)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                Customer Notes
              </h2>
              <p className="text-[0.8125rem] leading-relaxed text-white/70">
                {order.notes}
              </p>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-white/45">
              Timeline
            </h2>
            <div className="space-y-3 text-[0.75rem]">
              <div className="flex items-baseline justify-between">
                <span className="text-white/60">Order placed</span>
                <time className="font-mono text-white/40">
                  {order.createdAt.toLocaleString("en-GB")}
                </time>
              </div>
              {order.updatedAt &&
                order.updatedAt.getTime() !== order.createdAt.getTime() && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/60">Last updated</span>
                    <time className="font-mono text-white/40">
                      {order.updatedAt.toLocaleString("en-GB")}
                    </time>
                  </div>
                )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
