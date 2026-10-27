import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatPrice } from "@/lib/brand";
import { PageTitle, Table, Badge, Empty, Card } from "@/components/admin/ui";
import { Users, ShoppingBag, Mail, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

interface CustomerRecord {
  email: string;
  name: string;
  phone: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  isSubscriber: boolean;
}

export default async function CustomersPage() {
  const [allOrders, allSubs] = await Promise.all([
    db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)),
    db.select().from(schema.subscribers).orderBy(desc(schema.subscribers.createdAt)),
  ]);

  // Build customer map from orders
  const customerMap = new Map<string, CustomerRecord>();

  for (const order of allOrders) {
    const key = (order.email || order.phone).toLowerCase().trim();
    const existing = customerMap.get(key);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total;
      if (!existing.lastOrderDate || order.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      customerMap.set(key, {
        email: order.email || "",
        name: order.customerName,
        phone: order.phone,
        city: order.city,
        orderCount: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
        isSubscriber: false,
      });
    }
  }

  // Mark subscribers
  const subscriberEmails = new Set(
    allSubs
      .filter((s) => !s.unsubscribedAt)
      .map((s) => s.email.toLowerCase().trim()),
  );

  for (const [key, customer] of customerMap) {
    if (subscriberEmails.has(customer.email.toLowerCase())) {
      customer.isSubscriber = true;
    }
  }

  // Add subscriber-only contacts (no orders)
  for (const sub of allSubs) {
    const email = sub.email.toLowerCase().trim();
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        email: sub.email,
        name: "",
        phone: "",
        city: "",
        orderCount: 0,
        totalSpent: 0,
        lastOrderDate: null,
        isSubscriber: !sub.unsubscribedAt,
      });
    }
  }

  const customers = [...customerMap.values()].sort((a, b) => {
    // Sort by total spent descending
    return b.totalSpent - a.totalSpent;
  });

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalCustomerOrders = customers.reduce(
    (sum, c) => sum + c.orderCount,
    0,
  );
  const subscriberCount = customers.filter((c) => c.isSubscriber).length;
  const repeatBuyers = customers.filter((c) => c.orderCount > 1).length;

  return (
    <>
      <PageTitle title="Customer Directory" />

      {/* Customer Stats */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-start gap-3">
          <div className="rounded bg-blue-500/10 p-2">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              Total Customers
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {customers.length}
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <div className="rounded bg-emerald-500/10 p-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              Total Revenue
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <div className="rounded bg-amber-500/10 p-2">
            <ShoppingBag className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              Repeat Buyers
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {repeatBuyers}
            </p>
            <p className="text-[0.6875rem] text-white/50">
              {customers.length > 0
                ? Math.round((repeatBuyers / customers.length) * 100)
                : 0}
              % retention
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <div className="rounded bg-[#C4F319]/10 p-2">
            <Mail className="h-4 w-4 text-[#C4F319]" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/40">
              VIP Subscribers
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {subscriberCount}
            </p>
            <p className="text-[0.6875rem] text-white/50">
              Community members
            </p>
          </div>
        </Card>
      </div>

      {/* Customer Table */}
      {customers.length === 0 ? (
        <Empty message="No customers yet. Customers appear here once orders are placed or subscribers join." />
      ) : (
        <Table
          head={[
            "Customer",
            "Contact",
            "City",
            "Orders",
            "Total Spent",
            "Last Order",
            "Status",
          ]}
        >
          {customers.map((c, idx) => (
            <tr
              key={`${c.email || c.phone}-${idx}`}
              className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-white">
                  {c.name || "Subscriber"}
                </span>
                {c.email && (
                  <span className="block text-[0.75rem] text-white/45">
                    {c.email}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/60">
                {c.phone || "—"}
              </td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/60">
                {c.city || "—"}
              </td>
              <td className="px-4 py-3">
                <span className="font-mono font-bold text-white">
                  {c.orderCount}
                </span>
                {c.orderCount > 1 && (
                  <span className="ml-1.5 text-[0.6875rem] text-amber-300">
                    Repeat
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono font-medium text-white">
                {c.totalSpent > 0 ? formatPrice(c.totalSpent) : "—"}
              </td>
              <td className="px-4 py-3 text-[0.8125rem] text-white/50">
                {c.lastOrderDate
                  ? c.lastOrderDate.toLocaleDateString("en-GB")
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.orderCount > 0 && (
                    <Badge tone="good">Customer</Badge>
                  )}
                  {c.isSubscriber && (
                    <Badge tone="warn">VIP</Badge>
                  )}
                  {c.orderCount === 0 && !c.isSubscriber && (
                    <Badge tone="neutral">Lead</Badge>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
