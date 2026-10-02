#!/usr/bin/env sh
# LEAD-001 · B-01: las URLs de docs/soporte responden 200 sin cookies y el schema apunta a ellas.
for u in https://noobprobro-web.github.io/sartorial-docs/ \
         https://noobprobro-web.github.io/sartorial-docs/docs.html \
         https://noobprobro-web.github.io/sartorial-docs/support.html; do
  curl -s -o /dev/null --max-redirs 0 -w "%{http_code} %{url_effective}\n" "$u"
done
echo "--- formulario publicado:"
curl -s https://noobprobro-web.github.io/sartorial-docs/support.html | grep -o 'action="[^"]*"'
echo "--- schema (repo):"
grep -n 'theme_documentation_url\|theme_support_url' ../../../config/settings_schema.json
echo "--- W3C Nu (vacío = 0 errores):"
for f in index docs support; do printf "%s: " $f; curl -s -H "Content-Type: text/html; charset=utf-8" --data-binary @../../../docs/merchant/$f.html "https://validator.w3.org/nu/?out=gnu" | wc -l; done
