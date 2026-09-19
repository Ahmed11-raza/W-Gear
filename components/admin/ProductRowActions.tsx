"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProductStatus, deleteProduct } from "@/app/admin/actions";
import { btnGhost } from "./ui";

export function ProductRowActions({
  id,
  status,
  slug,
}: {
  id: number;
  status: "draft" | "published";
  slug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await setProductStatus(id, status === "published" ? "draft" : "published");
            router.refresh();
          })
        }
        className={btnGhost}
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          // Deleting a product breaks any link to it that already exists, so
          // this confirms rather than relying on an undo that does not exist.
          if (!confirm(`Delete "${slug}" permanently? This cannot be undone.`)) return;
          start(async () => {
            await deleteProduct(id);
            router.refresh();
          });
        }}
        className={`${btnGhost} hover:border-red-500/50 hover:text-red-300`}
      >
        Delete
      </button>
    </div>
  );
}
