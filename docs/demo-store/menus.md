# Menus

Create under **Content > Menus**. The handles must be exactly `main-menu` and `footer` (the theme reads them: `sections/header-group.json` -> `menu: "main-menu"`, `sections/footer-group.json` -> `menu: "footer"`). The top-level item must be titled **Catalog**: the mega menu is hooked to that title (`menu_item: "Catalog"` in `header-group.json`).

## main-menu
| Item | Link |
|---|---|
| **Catalog** | Collection: All products (`/collections/all`) |
| &nbsp;&nbsp;New forms | `/collections/new-forms` |
| &nbsp;&nbsp;Permanent collection | `/collections/permanent-collection` |
| &nbsp;&nbsp;Tailoring | `/collections/tailoring` |
| &nbsp;&nbsp;Knitwear | `/collections/knitwear` |
| &nbsp;&nbsp;Outerwear | `/collections/outerwear` |
| &nbsp;&nbsp;Accessories | `/collections/accessories` |
| Tailoring | `/collections/tailoring` |
| About | Page: About (`/pages/about`) |
| Contact | Page: Contact (`/pages/contact`) |

Nest the six children under Catalog (drag right).

## footer
| Item | Link |
|---|---|
| FAQ | `/pages/faq` |
| Contact | `/pages/contact` |
| Shipping policy | `/policies/shipping-policy` |
| Refund policy | `/policies/refund-policy` |
| Privacy policy | `/policies/privacy-policy` |
| Terms of service | `/policies/terms-of-service` |

Do the menus after collections and pages exist, so Shopify can pick them from the link selector.

## customer-account-main-menu
Created by Shopify; not needed by the demo.
