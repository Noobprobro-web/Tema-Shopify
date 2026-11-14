# Blog (optional)

The theme has `templates/blog.json` (`main-blog`) and `templates/article.json` (`main-article`) but no preset template or menu links to a blog. Create it only to test the blog and article templates and the empty/one/many states.

Blog: **Online Store > Blog posts > Manage blogs > Add blog**, title `News`, handle `news` (`/blogs/news`). Do not add it to the menus.

| Title | Handle | Tags | Body |
|---|---|---|---|
| Welcome to the demo store | `welcome-to-the-demo-store` | `news` | `<p>This store is used to preview the theme. Replace this article with your own news.</p>` |
| How to read the size chart | `how-to-read-the-size-chart` | `guide` | `<p>Sizes in this demo go from XS to XL. Replace this text with your own measurements and advice.</p>` |
| A very long article title used to test how headings wrap on small screens and in listing cards | `long-title-article-test` | `test` | `<p>Short body.</p>` |

States to try: empty blog (create a second blog `empty-news` with no posts), a post without featured image (all three above), 1 post (publish one only), many (duplicate to 10+).
