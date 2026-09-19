import { PageTitle } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <PageTitle title="New product" />
      <ProductForm />
    </>
  );
}
