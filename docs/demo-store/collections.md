# Collections (create by hand, about 2 minutes)

Shopify cannot import collections from CSV. Create each one as **Products > Collections > Create collection**, type **Automated**, condition **Product tag is equal to ...**, then set the exact handle under **Search engine listing preview > Edit > URL handle** and publish to Online Store. `/collections/all` already exists in every store; do not create it.

| Title | Handle (exact) | Condition (tag is equal to) | Members after import | Used by |
|---|---|---|---|---|
| The Autumn Series | `the-autumn-series` | `autumn-series` | 9 | Not referenced by the default theme (optional demo collection) |
| New forms | `new-forms` | `autumn-series` | 9 | Header menu (optional; the presets use `all`) |
| Permanent collection | `permanent-collection` | `permanent` | 12 | Optional (menu); presets use `all` |
| Tailoring | `tailoring` | `tailoring` | 4 | Optional (menu); presets use `all` |
| Knitwear | `knitwear` | `knitwear` | 4 | Menu |
| Outerwear | `outerwear` | `outerwear` | 4 | Menu |
| Accessories | `accessories` | `accessories` | 4 | Menu |
| New arrivals | `new-arrivals` | `new-arrival` | 3 | Optional, extra merchandising / search tests |

Exact member counts are verified by the checker (`node docs/demo-store/scripts/verify-products-csv.mjs`, section "collections (active products only, by tag)"). Test products are drafts, so they never appear in any collection that customers can see.

## Degenerate-state collections (gate 2)

| Title | Handle | Condition | Purpose |
|---|---|---|---|
| Empty collection (test) | `empty-test` | `tag-that-no-product-has` | Empty collection state. Do not link it from menus. |
| Single product (test) | `single-product-test` | `single-product-test` | Collection with exactly 1 product (`cashmere-scarf`). Do not link it from menus. |
| Test fixtures | `test-fixtures` | `test-fixture` | Lists the 3 `[TEST]` drafts for admin preview only. Leave unpublished. |

## Sort order
Use **Best selling** or **Manual** for all. For `the-autumn-series` choose Manual and put `serra-coat` first.

## Presets Imprint and Archive
Their collections (`leather-goods`, `daily-objects`, `desk-and-study`, `permanent-archive`, `restored-pieces`) are not created by this kit; see "Gaps" in `README.md` and `docs/demo-import/D-01-catalogo-y-fotos.md`.
