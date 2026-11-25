# R4 demo overlays

These overlays are store-specific JSON. They are outside `Sartorial-1.0.0.zip`; packaged listing JSON uses only the neutral `/collections/all` route, and store-specific collection links live here. Before applying an overlay, create the destination demo store and catalog, then confirm that every product and collection handle resolves there.

## Image assets pending (DP-025)

All image settings in `templates/index.json` are blank or omitted, as are `image_1` and `image_2` in `sections/header-group.json`. Do not fill these with QA media IDs. The source photo maps below define the asset to supply for each home and header image setting:

| Preset | Empty theme image settings | Source |
| --- | --- | --- |
| Sartorial | `hero-editorial.image_desktop`, `hero-editorial.image_mobile`; `curated-showcase` `editorial_image` for New forms, Permanent collection and Tailoring salon; `lookbook.image_desktop` and `image_mobile`; `complete-the-look.image_desktop` and `image_mobile`; `brand-manifesto.image`; header promo `image_1` (New forms) and `image_2` (Tailoring). | `docs/demo-import/sartorial-photos.csv` |
| Imprint | `hero-editorial.image_desktop`, `hero-editorial.image_mobile`; `bento-discovery` featured desk-and-study image and leather-goods editorial image; `curated-showcase.editorial_image` for Daily objects, Workspace and Leather goods; `complete-the-look.image_desktop` and `image_mobile`; `brand-manifesto.image`; header promo `image_1` (Daily objects) and `image_2` (Desk and study). | `docs/demo-import/imprint-photos.csv` |
| Archive | `hero-editorial.image_desktop`, `hero-editorial.image_mobile`; `brand-manifesto.image`; `curated-showcase.editorial_image` for Permanent archive and Selected pieces; `lookbook.image_desktop` and `image_mobile`; header promo `image_1` (Permanent archive) and `image_2` (Restored pieces). | `docs/demo-import/archive-photos.csv` |

Collection featured images, About page imagery and product media are catalog assets rather than settings in these home page overlays; use their respective rows in the same photo maps. The product-media and variant associations for T1 are also still pending application.

## Application procedure

1. Resolve the alias to a destination store from `docs/demo-store/scripts/catalog-r4-stores.json`; do not use a published theme.
2. Run the matching T1/T2/T3 plan, review the plan, and apply catalog data only through an authorized, separately reviewed process. R4 planner scripts are dry-run-only.
3. Upload `overlays/<preset>/templates/index.json` as the unpublished demo theme's `templates/index.json`, and `overlays/<preset>/sections/header-group.json` as `sections/header-group.json`.
4. In the theme editor, add approved assets from that preset's photo map, save, and verify product/collection links in the unpublished theme.
5. Hand the verified unpublished theme to Johandry for review. Publish only through Johandry's separately authorized release process; never upload these files to or modify a published theme.

The current domains for the Imprint and Archive demo stores are pending. Their overlays and plans are not evidence of a live store or a completed storefront review.
