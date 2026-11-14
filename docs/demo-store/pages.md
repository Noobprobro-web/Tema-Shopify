# Pages

Create under **Online Store > Pages > Add page**. Set the handle exactly (edit it under Search engine listing preview) and choose the theme template. Copy is neutral demo text; replace opening hours, addresses and policy details with real ones. Nothing here states a shipping time, return window, origin, material claim or sustainability claim.

The theme templates already contain placeholder copy for the blocks (`templates/page.about.json`, `page.faq.json`, `page.contact.json`). The body below is the page's own content field, shown by `main-page`/the templates where they render it. Fill the template blocks (hero text, FAQ items, contact intro) in the theme editor.

## about (template: `page.about`)
```html
<p>This is a demonstration store used to preview the theme. The products, prices and photos are examples and are not for sale.</p>
<p>Use this page to tell customers who you are, what you sell and how to reach you. Replace this text with your own story.</p>
```
Images: the About template expects a hero image and up to three gallery images; upload your own (see `docs/demo-import/*-photos.csv`, surface "About"). Without them the template shows placeholders.

## contact (template: `page.contact`)
```html
<p>Write to us about an order or a product using the form on this page. Replace this text with your own contact details.</p>
```
The form itself comes from the theme section (Shopify contact form). In Settings > Notifications set a sender email, otherwise submissions have no destination.

## faq (template: `page.faq`)
Body:
```html
<p>Answers to common questions. Replace these with your own policies.</p>
```
Questions are blocks in the theme editor; the template already ships three (dispatch, sizing, care) with neutral wording. The "Contact us" button ships empty and hidden in the default theme, and the demo uses the same JSON; set its URL in the editor if you want it to link to `/pages/contact`.

## Policies (Settings > Policies)
The footer links to the four policies. Use **Create from template** for each (refund, shipping, privacy, terms). Review them before publishing; they are legal text and the merchant is responsible for them.
