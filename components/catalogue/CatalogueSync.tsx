import type { Product } from "@/types";
import { CATALOGUE_ELEMENT_ID } from "@/lib/catalogue";

/**
 * Serialises the published catalogue into the page for the cart to read.
 *
 * A server component, so none of this reaches the client bundle as code — only
 * as data. The escaping matters: a product name containing `</script>` would
 * otherwise close the tag early and inject whatever followed, so the two
 * characters that can start a tag are written as unicode escapes. They parse
 * back to exactly the same string through `JSON.parse`.
 */
export function CatalogueSync({ products }: { products: Product[] }) {
  const json = JSON.stringify(products).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return (
    <script
      id={CATALOGUE_ELEMENT_ID}
      type="application/json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
