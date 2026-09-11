# Entrega GPT-3A-001: Figma Visual System

Archivo oficial de Figma: [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow)

`File Key: 132QRVaYF2wRverRKEaymB`

```text
ID: GPT-3A-001
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: Aceptar Phase 3A o solicitar ajustes antes de autorizar Phase 3B.
Resumen en 5 lineas:
1. Se crearon blueprints Couture de alta fidelidad para Desktop 1440 y Mobile 390.
2. Ambos incluyen header editorial, PDP, variantes, bloque @app, Sticky Cart Bar y Lookbook con dos hotspots.
3. Se creo una lamina visual con variantes reales de Header y Product Card para Studio y Archive.
4. Los SVG son autocontenidos, editables, sin dependencias externas y respetan los tokens de color y forma.
5. No se modifico Liquid, JavaScript, CSS de produccion ni ninguna plantilla Shopify.
```

## 1. Archivos entregados

| Archivo | Contenido | SHA-256 |
| --- | --- | --- |
| `docs/figma/couture-desktop-1440.svg` | Frame PDP 1440x1024 + frame Lookbook 1440x1024 | `E940236CDFB879324CD67DEECC4CE2C0C09F53EF3FEF32F9709420E1DA1A8883` |
| `docs/figma/couture-mobile-390.svg` | Frame PDP 390x844 + frame Lookbook 390x844 | `F86DE3A395D75535E328D265350BF991F44ED2D999A57A51C8A4ACF89FEB81A8` |
| `docs/figma/preset-header-product-card-variants.svg` | Header + Product Card para Studio y Archive | `C078EB0861FF394AB5C9F4B100065DFDD7F416EDAFFAF86C83ABD813C47B0F8C` |

+Los tres archivos `.svg` son las fuentes canonicas y los bloques completos se incrustan a continuacion para que la entrega sea autocontenida. Si un bloque y su archivo divergieran, prevalece el archivo cuyo SHA-256 figura en la tabla anterior.

## 1.1 Bloques SVG listos para Figma

Copia solamente desde `<svg` hasta `</svg>` dentro de cada bloque, sin incluir las lineas de triple acento grave.

### 1.1.1 Couture Desktop 1440 - copiar primero

Este es el primer bloque de auditoria: reune la gramatica visual principal y todos los componentes P0 en el viewport de mayor detalle.

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="2144" viewBox="0 0 1440 2144" role="img" aria-labelledby="title desc">
  <title id="title">Atelier Flow Couture desktop blueprint</title>
  <desc id="desc">Two 1440 pixel desktop frames showing a product page with a fixed cart bar and an interactive editorial lookbook.</desc>
  <defs>
    <style>
      .serif { font-family: "Playfair Display", Georgia, "Times New Roman", serif; font-weight: 400; }
      .sans { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; }
      .medium { font-weight: 500; }
      .ink { fill: #1C1917; }
      .muted { fill: #605A53; }
      .paper { fill: #FAF8F5; }
      .surface { fill: #F3EFEA; }
      .subtle { fill: #EDE7DE; }
      .accent { fill: #786C5E; }
      .white { fill: #FFFFFF; }
      .line { stroke: #E5DFD5; stroke-width: 1; fill: none; }
      .hairline { stroke: #EDE7DE; stroke-width: 1; fill: none; }
      .eyebrow { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 1.32px; }
      .label { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 500; }
      .body { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 400; }
      .small { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 400; }
      .hit { fill: #FFFFFF; fill-opacity: 0; }
    </style>
    <clipPath id="desktop-gallery-01"><rect x="32" y="104" width="414" height="364"/></clipPath>
    <clipPath id="desktop-gallery-02"><rect x="462" y="104" width="414" height="364"/></clipPath>
    <clipPath id="desktop-gallery-03"><rect x="32" y="484" width="414" height="404"/></clipPath>
    <clipPath id="desktop-gallery-04"><rect x="462" y="484" width="414" height="404"/></clipPath>
    <clipPath id="desktop-lookbook"><rect x="0" y="1192" width="1440" height="952"/></clipPath>
  </defs>

  <rect id="Canvas-Background" width="1440" height="2144" fill="#EDE7DE"/>

  <g id="Frame-Couture-Desktop-PDP" aria-label="Couture desktop product page, 1440 by 1024">
    <rect width="1440" height="1024" class="paper"/>

    <g id="Header-Editorial-PDP">
      <rect width="1440" height="72" class="paper"/>
      <line x1="0" y1="71.5" x2="1440" y2="71.5" stroke="#EDE7DE"/>
      <g id="Brand-PDP">
        <text x="32" y="43" class="serif ink" font-size="23">ATELIER</text>
        <text x="136" y="43" class="eyebrow muted">FLOW / 01</text>
      </g>
      <g id="Nav-Primary-PDP" class="label ink">
        <g id="Nav-New"><rect x="236" y="14" width="64" height="44" class="hit"/><text x="246" y="42">NEW</text></g>
        <g id="Nav-Women"><rect x="312" y="14" width="80" height="44" class="hit"/><text x="322" y="42">WOMEN</text></g>
        <g id="Nav-Men"><rect x="404" y="14" width="64" height="44" class="hit"/><text x="414" y="42">MEN</text></g>
        <g id="Nav-Objects"><rect x="480" y="14" width="82" height="44" class="hit"/><text x="490" y="42">OBJECTS</text></g>
        <g id="Nav-Journal"><rect x="574" y="14" width="82" height="44" class="hit"/><text x="584" y="42">JOURNAL</text></g>
      </g>
      <g id="Header-Actions-PDP" class="label ink">
        <g id="Search-Button-PDP" aria-label="Search button, 44 by 44">
          <rect x="1156" y="14" width="44" height="44" class="hit"/>
          <circle cx="1175" cy="33" r="6.5" fill="none" stroke="#1C1917" stroke-width="1.5"/>
          <path d="M1180 38 L1185 43" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round"/>
        </g>
        <g id="Shopify-Account-Simulated-PDP" aria-label="Shopify account, 112 by 44">
          <rect x="1210" y="14" width="112" height="44" class="hit"/>
          <circle cx="1230" cy="29" r="5.5" fill="none" stroke="#1C1917" stroke-width="1.4"/>
          <path d="M1221.5 43 C1223 36.5 1237 36.5 1238.5 43" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linecap="round"/>
          <text x="1248" y="42">ACCOUNT</text>
        </g>
        <g id="Cart-Button-PDP" aria-label="Cart button, 76 by 44">
          <rect x="1332" y="14" width="76" height="44" class="hit"/>
          <text x="1340" y="42">BAG (0)</text>
        </g>
      </g>
    </g>

    <g id="PDP-Gallery-Hairline">
      <g id="Gallery-Image-01" clip-path="url(#desktop-gallery-01)">
        <rect x="32" y="104" width="414" height="364" class="surface"/>
        <rect x="32" y="104" width="126" height="364" fill="#E9E2D8"/>
        <rect x="158" y="104" width="288" height="364" fill="#D9CEC1"/>
        <ellipse cx="293" cy="164" rx="29" ry="34" fill="#B19E8E"/>
        <path d="M275 193 C247 203 225 230 218 270 L203 468 H379 L365 270 C359 229 335 202 311 193 Z" fill="#625950"/>
        <path d="M275 201 L293 236 L311 201 L336 225 L318 468 H268 L249 225 Z" fill="#786C5E"/>
        <path d="M246 250 C226 298 217 350 214 410" fill="none" stroke="#A99C8F" stroke-width="2"/>
        <path d="M339 250 C360 300 369 352 372 410" fill="none" stroke="#A99C8F" stroke-width="2"/>
        <path d="M293 236 L293 448" fill="none" stroke="#B3A69B" stroke-width="1"/>
        <text x="52" y="444" class="eyebrow muted">LOOK 01 / FRONT</text>
      </g>
      <rect x="32.5" y="104.5" width="413" height="363" class="hairline"/>

      <g id="Gallery-Image-02" clip-path="url(#desktop-gallery-02)">
        <rect x="462" y="104" width="414" height="364" fill="#DDD4CA"/>
        <rect x="462" y="104" width="414" height="92" fill="#E8E1D8"/>
        <path d="M590 178 C620 153 719 151 752 181 L790 260 L760 468 H566 L548 260 Z" fill="#746A61"/>
        <path d="M623 171 C630 212 688 229 720 170" fill="none" stroke="#BDAFA1" stroke-width="3"/>
        <path d="M611 235 L735 235" fill="none" stroke="#A99B8D"/>
        <path d="M629 235 L616 449 M717 235 L732 449" fill="none" stroke="#A99B8D"/>
        <circle cx="673" cy="262" r="4" fill="#DCCDBF"/>
        <text x="482" y="444" class="eyebrow muted">LOOK 01 / BACK</text>
      </g>
      <rect x="462.5" y="104.5" width="413" height="363" class="hairline"/>

      <g id="Gallery-Image-03" clip-path="url(#desktop-gallery-03)">
        <rect x="32" y="484" width="414" height="404" fill="#C8BBAE"/>
        <path d="M-10 794 C83 614 223 548 466 526 L466 888 L-10 888 Z" fill="#786C5E"/>
        <path d="M50 820 C142 660 260 596 446 568" fill="none" stroke="#A69889" stroke-width="16" opacity="0.8"/>
        <path d="M29 864 C164 692 280 646 446 624" fill="none" stroke="#5F564E" stroke-width="2"/>
        <path d="M116 888 C205 752 304 699 446 685" fill="none" stroke="#AFA093" stroke-width="1"/>
        <text x="52" y="864" class="eyebrow white">MATERIAL / WOOL TWILL</text>
      </g>
      <rect x="32.5" y="484.5" width="413" height="403" class="hairline"/>

      <g id="Gallery-Image-04" clip-path="url(#desktop-gallery-04)">
        <rect x="462" y="484" width="414" height="404" fill="#E7E0D7"/>
        <ellipse cx="670" cy="606" rx="116" ry="34" fill="#D2C4B6"/>
        <path d="M565 603 L600 724 C612 764 729 764 742 724 L775 603 C741 626 602 626 565 603 Z" fill="#8E7E70"/>
        <path d="M600 724 C620 739 721 739 742 724" fill="none" stroke="#5E554D" stroke-width="2"/>
        <path d="M605 610 C618 555 725 555 740 610" fill="none" stroke="#5E554D" stroke-width="8"/>
        <rect x="657" y="626" width="28" height="20" fill="#B6A393" stroke="#5E554D"/>
        <text x="482" y="864" class="eyebrow muted">DETAIL / HAND FINISH</text>
      </g>
      <rect x="462.5" y="484.5" width="413" height="403" class="hairline"/>
      <text x="32" y="916" class="small muted">01</text>
      <line x1="58" y1="912" x2="828" y2="912" stroke="#E5DFD5"/>
      <text x="842" y="916" class="small muted">04</text>
    </g>

    <g id="PDP-Product-Information">
      <text x="944" y="128" class="eyebrow muted">ATELIER SERIES / 01</text>
      <text x="944" y="190" class="serif ink" font-size="50">The Draped</text>
      <text x="944" y="244" class="serif ink" font-size="50">Wool Coat</text>
      <text x="944" y="286" class="sans ink" font-size="16">$1,280.00</text>
      <text x="944" y="329" class="body muted">A softly structured coat cut from traceable wool twill.</text>
      <text x="944" y="351" class="body muted">Finished by hand with a removable sculpted belt.</text>
      <line x1="944" y1="378" x2="1408" y2="378" stroke="#E5DFD5"/>

      <g id="Variant-Selector-Color">
        <text x="944" y="409" class="label ink">COLOR</text>
        <text x="1004" y="409" class="small muted">Umber</text>
        <g id="Color-Umber-Selected" aria-label="Umber color option, 44 by 44">
          <rect x="944" y="422" width="44" height="44" rx="2" fill="#FAF8F5" stroke="#1C1917"/>
          <rect x="953" y="431" width="26" height="26" rx="1" fill="#786C5E"/>
        </g>
        <g id="Color-Oat" aria-label="Oat color option, 44 by 44">
          <rect x="996" y="422" width="44" height="44" rx="2" fill="#FAF8F5" stroke="#E5DFD5"/>
          <rect x="1005" y="431" width="26" height="26" rx="1" fill="#D5C7B8"/>
        </g>
        <g id="Color-Ink" aria-label="Ink color option, 44 by 44">
          <rect x="1048" y="422" width="44" height="44" rx="2" fill="#FAF8F5" stroke="#E5DFD5"/>
          <rect x="1057" y="431" width="26" height="26" rx="1" fill="#292724"/>
        </g>
      </g>

      <g id="Variant-Selector-Size">
        <text x="944" y="500" class="label ink">SIZE</text>
        <g id="Size-Guide-Link" aria-label="Size guide, 96 by 44">
          <rect x="1312" y="478" width="96" height="44" class="hit"/>
          <text x="1326" y="501" class="small ink" text-decoration="underline">SIZE GUIDE</text>
        </g>
        <g id="Size-XS"><rect x="944" y="520" width="64" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="968" y="548" class="label ink">XS</text></g>
        <g id="Size-S-Selected"><rect x="1016" y="520" width="64" height="44" rx="2" fill="#1C1917"/><text x="1044" y="548" class="label white">S</text></g>
        <g id="Size-M"><rect x="1088" y="520" width="64" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="1114" y="548" class="label ink">M</text></g>
        <g id="Size-L"><rect x="1160" y="520" width="64" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="1187" y="548" class="label ink">L</text></g>
        <g id="Size-XL"><rect x="1232" y="520" width="64" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="1255" y="548" class="label ink">XL</text></g>
      </g>

      <g id="Primary-Add-To-Cart" aria-label="Add to bag, 464 by 52">
        <rect x="944" y="592" width="464" height="52" rx="2" fill="#786C5E"/>
        <text x="1101" y="624" class="label white">ADD TO BAG</text>
        <text x="1347" y="624" class="label white">$1,280</text>
      </g>

      <g id="App-Block-Product-Reviews" aria-label="Simulated Shopify app block">
        <rect x="944.5" y="668.5" width="463" height="81" class="line"/>
        <text x="964" y="696" class="eyebrow muted">@APP / PRODUCT REVIEWS</text>
        <text x="964" y="729" class="sans ink" font-size="17">★★★★★</text>
        <text x="1060" y="728" class="small ink">4.9 / 32 verified reviews</text>
        <path d="M1380 704 L1390 714 L1380 724" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <g id="Product-Accordions">
        <g id="Accordion-Details"><line x1="944" y1="778" x2="1408" y2="778" stroke="#E5DFD5"/><text x="944" y="813" class="label ink">DETAILS &amp; FIT</text><path d="M1382 801 H1394 M1388 795 V807" stroke="#1C1917"/></g>
        <g id="Accordion-Materials"><line x1="944" y1="834" x2="1408" y2="834" stroke="#E5DFD5"/><text x="944" y="869" class="label ink">MATERIALS &amp; CARE</text><path d="M1382 857 H1394 M1388 851 V863" stroke="#1C1917"/></g>
        <g id="Accordion-Delivery"><line x1="944" y1="890" x2="1408" y2="890" stroke="#E5DFD5"/><text x="944" y="925" class="label ink">DELIVERY &amp; RETURNS</text><path d="M1382 913 H1394 M1388 907 V919" stroke="#1C1917"/></g>
      </g>
    </g>

    <g id="Sticky-Cart-Bar-Desktop" aria-label="Fixed sticky cart bar at viewport bottom">
      <rect x="0" y="928" width="1440" height="8" fill="#1C1917" opacity="0.06"/>
      <rect x="0" y="936" width="1440" height="88" class="paper"/>
      <line x1="0" y1="936.5" x2="1440" y2="936.5" stroke="#E5DFD5"/>
      <g id="Sticky-Product-Thumbnail">
        <rect x="32" y="952" width="56" height="56" class="surface"/>
        <ellipse cx="60" cy="968" rx="7" ry="8" fill="#B19E8E"/>
        <path d="M53 975 C44 980 43 994 42 1008 H78 C77 993 75 980 67 975 Z" fill="#786C5E"/>
      </g>
      <text x="104" y="977" class="serif ink" font-size="18">The Draped Wool Coat</text>
      <text x="104" y="1001" class="small muted">Umber / S</text>
      <text x="1044" y="987" class="sans ink" font-size="15">$1,280.00</text>
      <g id="Sticky-Add-To-Cart-Desktop" aria-label="Add to bag, 244 by 48">
        <rect x="1164" y="956" width="244" height="48" rx="2" fill="#786C5E"/>
        <text x="1238" y="986" class="label white">ADD TO BAG</text>
      </g>
    </g>
  </g>

  <g id="Frame-Couture-Desktop-Lookbook" aria-label="Couture desktop interactive lookbook, 1440 by 1024">
    <rect x="0" y="1120" width="1440" height="1024" class="paper"/>
    <g id="Header-Editorial-Lookbook">
      <rect x="0" y="1120" width="1440" height="72" class="paper"/>
      <line x1="0" y1="1191.5" x2="1440" y2="1191.5" stroke="#EDE7DE"/>
      <text x="32" y="1163" class="serif ink" font-size="23">ATELIER</text>
      <text x="136" y="1163" class="eyebrow muted">FLOW / 01</text>
      <g id="Nav-Primary-Lookbook" class="label ink">
        <text x="246" y="1162">NEW</text><text x="322" y="1162">WOMEN</text><text x="414" y="1162">MEN</text><text x="490" y="1162">OBJECTS</text><text x="584" y="1162">JOURNAL</text>
      </g>
      <g id="Shopify-Account-Simulated-Lookbook">
        <rect x="1210" y="1134" width="112" height="44" class="hit"/>
        <circle cx="1230" cy="1149" r="5.5" fill="none" stroke="#1C1917" stroke-width="1.4"/>
        <path d="M1221.5 1163 C1223 1156.5 1237 1156.5 1238.5 1163" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linecap="round"/>
        <text x="1248" y="1162" class="label ink">ACCOUNT</text>
      </g>
      <text x="1340" y="1162" class="label ink">BAG (0)</text>
    </g>

    <g id="Lookbook-Editorial-Media" clip-path="url(#desktop-lookbook)">
      <rect x="0" y="1192" width="1440" height="952" fill="#C7BEB4"/>
      <rect x="0" y="1192" width="372" height="952" fill="#E7E0D7"/>
      <rect x="372" y="1192" width="1068" height="216" fill="#D9D0C6"/>
      <rect x="1110" y="1408" width="330" height="736" fill="#A89C8F"/>
      <rect x="0" y="1902" width="1440" height="242" fill="#B2A699"/>
      <path d="M372 1408 L1110 1408 L1018 1902 L436 1902 Z" fill="#D1C7BC"/>
      <path d="M467 1192 L520 1902" stroke="#B6AA9E" stroke-width="2"/>
      <path d="M1006 1192 L934 1902" stroke="#B6AA9E" stroke-width="2"/>
      <ellipse cx="662" cy="1490" rx="40" ry="48" fill="#AD9989"/>
      <path d="M628 1532 C582 1557 555 1630 548 1722 L519 1940 H812 L785 1718 C776 1624 739 1556 699 1532 Z" fill="#403B37"/>
      <path d="M631 1540 L661 1595 L697 1540 L737 1592 L710 1939 H601 L584 1594 Z" fill="#786C5E"/>
      <path d="M662 1594 L663 1905" fill="none" stroke="#B7A89A" stroke-width="2"/>
      <path d="M586 1626 C551 1697 539 1791 536 1870" fill="none" stroke="#8E8174" stroke-width="4"/>
      <path d="M735 1626 C780 1698 798 1790 801 1870" fill="none" stroke="#8E8174" stroke-width="4"/>
      <path d="M925 1751 C958 1724 1054 1725 1084 1754 L1118 1855 H895 Z" fill="#665C53"/>
      <path d="M961 1752 C968 1695 1041 1695 1048 1752" fill="none" stroke="#665C53" stroke-width="10"/>
      <rect x="989" y="1774" width="28" height="22" fill="#B7A18F"/>
    </g>

    <g id="Lookbook-Editorial-Copy">
      <text x="64" y="1278" class="eyebrow ink">COUTURE STUDY / AUTUMN 01</text>
      <text x="64" y="1348" class="serif ink" font-size="60">Studies in</text>
      <text x="64" y="1410" class="serif ink" font-size="60">Movement</text>
      <text x="64" y="1452" class="body ink">Soft structure, precise lines, objects made to move.</text>
    </g>

    <g id="Hotspot-01-Active" aria-label="Active lookbook hotspot, 48 by 48">
      <circle cx="744" cy="1668" r="24" fill="#FAF8F5" fill-opacity="0.32" stroke="#FAF8F5" stroke-opacity="0.7"/>
      <circle cx="744" cy="1668" r="15" fill="#FAF8F5" fill-opacity="0.55"/>
      <circle cx="744" cy="1668" r="6" fill="#786C5E" stroke="#FFFFFF" stroke-width="2"/>
    </g>
    <g id="Hotspot-02-Idle" aria-label="Idle lookbook hotspot, 48 by 48">
      <circle cx="1006" cy="1810" r="24" fill="#FAF8F5" fill-opacity="0.25" stroke="#FAF8F5" stroke-opacity="0.65"/>
      <circle cx="1006" cy="1810" r="6" fill="#1C1917" stroke="#FFFFFF" stroke-width="2"/>
    </g>

    <g id="Lookbook-Product-Popover-Active">
      <rect x="816" y="1480" width="320" height="202" fill="#1C1917" opacity="0.08"/>
      <rect x="808" y="1472" width="320" height="202" class="paper"/>
      <rect x="824" y="1488" width="112" height="170" class="surface"/>
      <ellipse cx="880" cy="1535" rx="15" ry="18" fill="#B19E8E"/>
      <path d="M866 1550 C847 1561 844 1600 842 1658 H919 C916 1598 910 1561 894 1550 Z" fill="#786C5E"/>
      <text x="956" y="1512" class="eyebrow muted">LOOK 01</text>
      <text x="956" y="1552" class="serif ink" font-size="21">Draped</text>
      <text x="956" y="1578" class="serif ink" font-size="21">Wool Coat</text>
      <text x="956" y="1612" class="small muted">Umber</text>
      <text x="956" y="1642" class="sans ink" font-size="14">$1,280.00</text>
      <g id="Lookbook-Card-Link" aria-label="Open product, 44 by 44">
        <rect x="1068" y="1614" width="44" height="44" class="hit"/>
        <path d="M1080 1636 H1099 M1093 1630 L1099 1636 L1093 1642" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <path d="M808 1575 L773 1650" fill="none" stroke="#FAF8F5" stroke-width="1"/>
    </g>

    <g id="Lookbook-Bottom-Caption">
      <rect x="0" y="2056" width="1440" height="88" fill="#FAF8F5" fill-opacity="0.96"/>
      <line x1="0" y1="2056.5" x2="1440" y2="2056.5" stroke="#E5DFD5"/>
      <text x="32" y="2091" class="eyebrow muted">EDITORIAL 01</text>
      <text x="32" y="2117" class="small ink">A study of drape, balance and hand-finished form.</text>
      <g id="Shop-The-Edit-Link" aria-label="Shop the edit, 176 by 44">
        <rect x="1232" y="2078" width="176" height="44" class="hit"/>
        <text x="1244" y="2107" class="label ink">SHOP THE EDIT</text>
        <path d="M1380 2100 H1394 M1388 2094 L1394 2100 L1388 2106" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </g>
  </g>
</svg>
```

### 1.1.2 Couture Mobile 390

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="1764" viewBox="0 0 390 1764" role="img" aria-labelledby="title desc">
  <title id="title">Atelier Flow Couture mobile blueprint</title>
  <desc id="desc">Two 390 pixel mobile frames showing a product page with a fixed cart bar and an interactive editorial lookbook.</desc>
  <defs>
    <style>
      .serif { font-family: "Playfair Display", Georgia, "Times New Roman", serif; font-weight: 400; }
      .sans { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; }
      .ink { fill: #1C1917; }
      .muted { fill: #605A53; }
      .paper { fill: #FAF8F5; }
      .surface { fill: #F3EFEA; }
      .white { fill: #FFFFFF; }
      .eyebrow { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 1.2px; }
      .label { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 500; }
      .body { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 400; }
      .small { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 400; }
      .hit { fill: #FFFFFF; fill-opacity: 0; }
    </style>
    <clipPath id="mobile-pdp-image"><rect x="16" y="80" width="358" height="378" rx="0"/></clipPath>
    <clipPath id="mobile-lookbook-image"><rect x="0" y="984" width="390" height="780"/></clipPath>
  </defs>

  <rect id="Canvas-Background" width="390" height="1764" fill="#EDE7DE"/>

  <g id="Frame-Couture-Mobile-PDP" aria-label="Couture mobile product page, 390 by 844">
    <rect width="390" height="844" class="paper"/>
    <g id="Header-Editorial-Mobile-PDP">
      <rect width="390" height="64" class="paper"/>
      <line x1="0" y1="63.5" x2="390" y2="63.5" stroke="#EDE7DE"/>
      <g id="Menu-Button-Mobile-PDP" aria-label="Open navigation, 44 by 44">
        <rect x="10" y="10" width="44" height="44" class="hit"/>
        <path d="M20 27 H42 M20 36 H42" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <text x="195" y="39" text-anchor="middle" class="serif ink" font-size="20">ATELIER</text>
      <g id="Shopify-Account-Simulated-Mobile-PDP" aria-label="Shopify account, 44 by 44">
        <rect x="282" y="10" width="44" height="44" class="hit"/>
        <circle cx="304" cy="26" r="5.5" fill="none" stroke="#1C1917" stroke-width="1.4"/>
        <path d="M295.5 41 C297 34.5 311 34.5 312.5 41" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linecap="round"/>
      </g>
      <g id="Cart-Button-Mobile-PDP" aria-label="Cart, 44 by 44">
        <rect x="336" y="10" width="44" height="44" class="hit"/>
        <path d="M350 27 H366 L365 42 H351 Z" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M354 27 C354 21 362 21 362 27" fill="none" stroke="#1C1917" stroke-width="1.4"/>
      </g>
    </g>

    <g id="PDP-Gallery-Mobile" clip-path="url(#mobile-pdp-image)">
      <rect x="16" y="80" width="358" height="378" class="surface"/>
      <rect x="16" y="80" width="108" height="378" fill="#E9E2D8"/>
      <rect x="124" y="80" width="250" height="378" fill="#D9CEC1"/>
      <ellipse cx="240" cy="142" rx="26" ry="31" fill="#B19E8E"/>
      <path d="M224 169 C194 181 174 214 170 260 L157 458 H325 L311 260 C307 213 282 180 257 169 Z" fill="#625950"/>
      <path d="M222 178 L240 213 L258 178 L282 205 L269 458 H211 L195 205 Z" fill="#786C5E"/>
      <path d="M240 213 L240 440" fill="none" stroke="#B3A69B"/>
      <path d="M196 236 C177 287 169 354 166 421 M283 236 C305 287 313 354 316 421" fill="none" stroke="#A99C8F" stroke-width="2"/>
    </g>
    <rect x="16.5" y="80.5" width="357" height="377" fill="none" stroke="#EDE7DE"/>
    <g id="Gallery-Counter-Mobile">
      <rect x="314" y="94" width="44" height="28" fill="#FAF8F5" fill-opacity="0.9"/>
      <text x="336" y="113" text-anchor="middle" class="small ink">1 / 4</text>
    </g>
    <g id="Gallery-Pagination-Mobile">
      <line x1="16" y1="472" x2="374" y2="472" stroke="#E5DFD5"/>
      <line x1="16" y1="472" x2="105" y2="472" stroke="#1C1917" stroke-width="2"/>
    </g>

    <g id="PDP-Product-Information-Mobile">
      <text x="16" y="505" class="eyebrow muted">ATELIER SERIES / 01</text>
      <text x="16" y="543" class="serif ink" font-size="31">The Draped Wool Coat</text>
      <text x="16" y="576" class="sans ink" font-size="14">$1,280.00</text>
      <g id="Variant-Selector-Mobile">
        <text x="16" y="614" class="label ink">SIZE</text>
        <g id="Mobile-Size-Guide" aria-label="Size guide, 88 by 44">
          <rect x="286" y="590" width="88" height="44" class="hit"/>
          <text x="301" y="614" class="small ink" text-decoration="underline">SIZE GUIDE</text>
        </g>
        <g id="Mobile-Size-XS"><rect x="16" y="630" width="48" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="32" y="658" class="label ink">XS</text></g>
        <g id="Mobile-Size-S-Selected"><rect x="72" y="630" width="48" height="44" rx="2" fill="#1C1917"/><text x="94" y="658" class="label white">S</text></g>
        <g id="Mobile-Size-M"><rect x="128" y="630" width="48" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="147" y="658" class="label ink">M</text></g>
        <g id="Mobile-Size-L"><rect x="184" y="630" width="48" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="204" y="658" class="label ink">L</text></g>
        <g id="Mobile-Size-XL"><rect x="240" y="630" width="48" height="44" rx="2" class="paper" stroke="#E5DFD5"/><text x="256" y="658" class="label ink">XL</text></g>
      </g>

      <g id="App-Block-Product-Reviews-Mobile" aria-label="Simulated Shopify app block">
        <rect x="16.5" y="692.5" width="357" height="51" fill="none" stroke="#E5DFD5"/>
        <text x="32" y="714" class="eyebrow muted">@APP / REVIEWS</text>
        <text x="32" y="734" class="small ink">★★★★★  4.9 / 32 verified</text>
        <path d="M348 711 L356 719 L348 727" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </g>

    <g id="Sticky-Cart-Bar-Mobile" aria-label="Fixed sticky cart bar at mobile viewport bottom">
      <rect x="0" y="752" width="390" height="8" fill="#1C1917" opacity="0.07"/>
      <rect x="0" y="760" width="390" height="84" class="paper"/>
      <line x1="0" y1="760.5" x2="390" y2="760.5" stroke="#E5DFD5"/>
      <rect x="16" y="774" width="56" height="56" class="surface"/>
      <ellipse cx="44" cy="789" rx="7" ry="8" fill="#B19E8E"/>
      <path d="M37 796 C28 801 27 816 26 830 H62 C61 815 59 801 51 796 Z" fill="#786C5E"/>
      <text x="84" y="798" class="serif ink" font-size="14">Draped Wool Coat</text>
      <text x="84" y="820" class="small muted">$1,280 / S</text>
      <g id="Sticky-Add-To-Cart-Mobile" aria-label="Add to bag, 104 by 52">
        <rect x="270" y="776" width="104" height="52" rx="2" fill="#786C5E"/>
        <text x="322" y="807" text-anchor="middle" class="label white">ADD</text>
      </g>
    </g>
  </g>

  <g id="Frame-Couture-Mobile-Lookbook" aria-label="Couture mobile interactive lookbook, 390 by 844">
    <rect x="0" y="920" width="390" height="844" class="paper"/>
    <g id="Header-Editorial-Mobile-Lookbook">
      <rect x="0" y="920" width="390" height="64" class="paper"/>
      <line x1="0" y1="983.5" x2="390" y2="983.5" stroke="#EDE7DE"/>
      <g id="Menu-Button-Mobile-Lookbook"><rect x="10" y="930" width="44" height="44" class="hit"/><path d="M20 947 H42 M20 956 H42" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round"/></g>
      <text x="195" y="959" text-anchor="middle" class="serif ink" font-size="20">ATELIER</text>
      <g id="Shopify-Account-Simulated-Mobile-Lookbook"><rect x="282" y="930" width="44" height="44" class="hit"/><circle cx="304" cy="946" r="5.5" fill="none" stroke="#1C1917" stroke-width="1.4"/><path d="M295.5 961 C297 954.5 311 954.5 312.5 961" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linecap="round"/></g>
      <g id="Cart-Button-Mobile-Lookbook"><rect x="336" y="930" width="44" height="44" class="hit"/><path d="M350 947 H366 L365 962 H351 Z" fill="none" stroke="#1C1917" stroke-width="1.4" stroke-linejoin="round"/><path d="M354 947 C354 941 362 941 362 947" fill="none" stroke="#1C1917" stroke-width="1.4"/></g>
    </g>

    <g id="Lookbook-Editorial-Media-Mobile" clip-path="url(#mobile-lookbook-image)">
      <rect x="0" y="984" width="390" height="780" fill="#C7BEB4"/>
      <rect x="0" y="984" width="104" height="780" fill="#E7E0D7"/>
      <rect x="104" y="984" width="286" height="164" fill="#D9D0C6"/>
      <rect x="310" y="1148" width="80" height="616" fill="#A89C8F"/>
      <rect x="0" y="1594" width="390" height="170" fill="#B2A699"/>
      <path d="M104 1148 H310 L286 1594 H126 Z" fill="#D1C7BC"/>
      <path d="M128 984 L151 1594 M286 984 L266 1594" fill="none" stroke="#B6AA9E"/>
      <ellipse cx="192" cy="1214" rx="25" ry="30" fill="#AD9989"/>
      <path d="M172 1242 C144 1257 131 1312 128 1382 L116 1612 H278 L266 1380 C261 1310 235 1256 214 1242 Z" fill="#403B37"/>
      <path d="M172 1248 L192 1288 L214 1248 L238 1284 L222 1612 H157 L145 1284 Z" fill="#786C5E"/>
      <path d="M192 1288 V1580" stroke="#B7A89A" stroke-width="1.5"/>
      <path d="M145 1307 C129 1360 123 1433 122 1515 M239 1307 C259 1360 267 1433 268 1515" fill="none" stroke="#8E8174" stroke-width="3"/>
      <path d="M269 1463 C281 1451 318 1451 330 1464 L344 1513 H256 Z" fill="#665C53"/>
      <path d="M282 1463 C286 1436 316 1436 320 1463" fill="none" stroke="#665C53" stroke-width="6"/>
    </g>

    <g id="Lookbook-Copy-Mobile">
      <text x="24" y="1022" class="eyebrow ink">COUTURE STUDY / 01</text>
      <text x="24" y="1066" class="serif ink" font-size="35">Studies in</text>
      <text x="24" y="1104" class="serif ink" font-size="35">Movement</text>
    </g>

    <g id="Hotspot-Mobile-01-Active" aria-label="Active lookbook hotspot, 48 by 48">
      <circle cx="230" cy="1344" r="24" fill="#FAF8F5" fill-opacity="0.32" stroke="#FAF8F5" stroke-opacity="0.75"/>
      <circle cx="230" cy="1344" r="14" fill="#FAF8F5" fill-opacity="0.55"/>
      <circle cx="230" cy="1344" r="6" fill="#786C5E" stroke="#FFFFFF" stroke-width="2"/>
    </g>
    <g id="Hotspot-Mobile-02-Idle" aria-label="Idle lookbook hotspot, 48 by 48">
      <circle cx="300" cy="1484" r="24" fill="#FAF8F5" fill-opacity="0.25" stroke="#FAF8F5" stroke-opacity="0.65"/>
      <circle cx="300" cy="1484" r="6" fill="#1C1917" stroke="#FFFFFF" stroke-width="2"/>
    </g>

    <g id="Lookbook-Product-Popover-Mobile">
      <rect x="128" y="1390" width="246" height="174" fill="#1C1917" opacity="0.08"/>
      <rect x="122" y="1384" width="252" height="174" class="paper"/>
      <rect x="136" y="1398" width="86" height="146" class="surface"/>
      <ellipse cx="179" cy="1438" rx="11" ry="14" fill="#B19E8E"/>
      <path d="M169 1450 C156 1459 154 1491 153 1544 H205 C203 1490 200 1459 189 1450 Z" fill="#786C5E"/>
      <text x="238" y="1418" class="eyebrow muted">LOOK 01</text>
      <text x="238" y="1450" class="serif ink" font-size="17">Draped</text>
      <text x="238" y="1471" class="serif ink" font-size="17">Wool Coat</text>
      <text x="238" y="1498" class="small muted">Umber</text>
      <text x="238" y="1525" class="small ink">$1,280.00</text>
      <g id="Lookbook-Card-Link-Mobile" aria-label="Open product, 44 by 44">
        <rect x="316" y="1500" width="44" height="44" class="hit"/>
        <path d="M326 1522 H346 M340 1516 L346 1522 L340 1528" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <path d="M122 1414 L242 1364" fill="none" stroke="#FAF8F5"/>
    </g>

    <g id="Lookbook-Bottom-Caption-Mobile">
      <rect x="0" y="1660" width="390" height="104" fill="#FAF8F5" fill-opacity="0.96"/>
      <line x1="0" y1="1660.5" x2="390" y2="1660.5" stroke="#E5DFD5"/>
      <text x="16" y="1687" class="eyebrow muted">EDITORIAL 01</text>
      <text x="16" y="1712" class="small ink">Drape, balance and hand-finished form.</text>
      <g id="Shop-The-Edit-Link-Mobile" aria-label="Shop the edit, 154 by 44">
        <rect x="220" y="1694" width="154" height="44" class="hit"/>
        <text x="232" y="1721" class="label ink">SHOP THE EDIT</text>
        <path d="M348 1715 H362 M356 1709 L362 1715 L356 1721" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </g>
  </g>
</svg>
```

### 1.1.3 Studio y Archive - Header + Product Card

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1120" viewBox="0 0 1440 1120" role="img" aria-labelledby="title desc">
  <title id="title">Atelier Flow Studio and Archive component variants</title>
  <desc id="desc">A visual specification board for the Studio and Archive header and product card variants.</desc>
  <defs>
    <style>
      .studio-heading { font-family: "Syne", "General Sans", -apple-system, sans-serif; font-weight: 600; }
      .studio-body { font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; }
      .archive-heading { font-family: "Space Grotesk", "Courier New", monospace; font-weight: 500; }
      .archive-body { font-family: "Space Grotesk", -apple-system, sans-serif; font-weight: 400; }
      .hit { fill: #FFFFFF; fill-opacity: 0; }
    </style>
    <clipPath id="studio-image"><rect x="32" y="142" width="356" height="294" rx="4"/></clipPath>
    <clipPath id="archive-image"><rect x="32" y="730" width="356" height="294"/></clipPath>
  </defs>

  <rect id="Canvas-Background" width="1440" height="1120" fill="#DCD7C8"/>

  <g id="Frame-Studio-Components" aria-label="Studio preset component specification">
    <rect width="1440" height="540" fill="#FFFFFF"/>
    <g id="Header-Studio">
      <rect width="1440" height="80" fill="#FFFFFF"/>
      <line x1="0" y1="79.5" x2="1440" y2="79.5" stroke="#E4E4E7"/>
      <text x="32" y="49" class="studio-heading" font-size="22" fill="#09090B">STUDIO / 02</text>
      <g id="Studio-Nav" class="studio-body" font-size="12" fill="#09090B">
        <g><rect x="258" y="18" width="64" height="44" class="hit"/><text x="270" y="46">NEW</text></g>
        <g><rect x="334" y="18" width="80" height="44" class="hit"/><text x="346" y="46">WOMEN</text></g>
        <g><rect x="426" y="18" width="64" height="44" class="hit"/><text x="438" y="46">MEN</text></g>
        <g><rect x="502" y="18" width="90" height="44" class="hit"/><text x="514" y="46">OBJECTS</text></g>
      </g>
      <g id="Shopify-Account-Studio" aria-label="Shopify account, 112 by 44">
        <rect x="1210" y="18" width="112" height="44" class="hit"/>
        <circle cx="1230" cy="33" r="5.5" fill="none" stroke="#09090B" stroke-width="1.5"/>
        <path d="M1221.5 48 C1223 41.5 1237 41.5 1238.5 48" fill="none" stroke="#09090B" stroke-width="1.5" stroke-linecap="round"/>
        <text x="1248" y="46" class="studio-body" font-size="12" fill="#09090B">ACCOUNT</text>
      </g>
      <text x="1340" y="46" class="studio-body" font-size="12" fill="#09090B">BAG (0)</text>
    </g>

    <g id="Product-Card-Studio">
      <text x="32" y="116" class="studio-heading" font-size="14" fill="#09090B">PRODUCT CARD / DEFAULT</text>
      <g clip-path="url(#studio-image)">
        <rect x="32" y="142" width="356" height="294" rx="4" fill="#F4F4F5"/>
        <rect x="32" y="142" width="356" height="78" fill="#E4E4E7"/>
        <ellipse cx="210" cy="360" rx="126" ry="24" fill="#D7D7DA"/>
        <path d="M105 331 C142 312 178 285 201 254 C228 279 264 307 317 329 L304 357 C245 372 167 371 111 355 Z" fill="#17171A"/>
        <path d="M126 331 C170 337 244 337 297 327" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>
        <path d="M181 287 C203 298 225 298 248 288" fill="none" stroke="#8F8F95" stroke-width="3"/>
      </g>
      <rect x="32.5" y="142.5" width="355" height="293" rx="4" fill="none" stroke="#E4E4E7"/>
      <g id="Studio-Card-Wishlist" aria-label="Add to wishlist, 44 by 44">
        <rect x="332" y="154" width="44" height="44" rx="4" fill="#FFFFFF" fill-opacity="0.86"/>
        <path d="M354 184 C348 179 342 175 342 169 C342 163 350 161 354 167 C358 161 366 163 366 169 C366 175 360 179 354 184 Z" fill="none" stroke="#09090B" stroke-width="1.4"/>
      </g>
      <text x="32" y="466" class="studio-heading" font-size="17" fill="#09090B">Sculpted Slingback</text>
      <text x="32" y="491" class="studio-body" font-size="13" fill="#52525B">Black calf leather</text>
      <text x="32" y="519" class="studio-body" font-size="14" fill="#09090B">$620.00</text>
      <g id="Studio-Quick-Add" aria-label="Quick add, 132 by 44">
        <rect x="256" y="476" width="132" height="44" rx="4" fill="#18181B"/>
        <text x="322" y="503" text-anchor="middle" class="studio-body" font-size="11" font-weight="600" fill="#FFFFFF">QUICK ADD</text>
      </g>
    </g>

    <g id="Studio-Specification" class="studio-body">
      <text x="504" y="130" class="studio-heading" font-size="32" fill="#09090B">Studio</text>
      <text x="504" y="162" font-size="14" fill="#52525B">Crisp gallery whitespace with a contemporary grotesk voice.</text>
      <line x1="504" y1="190" x2="1408" y2="190" stroke="#E4E4E7"/>
      <text x="504" y="224" font-size="11" font-weight="600" fill="#09090B">HEADER</text>
      <text x="650" y="224" font-size="13" fill="#52525B">80 px / 32 px gutters / 1 px hairline</text>
      <text x="504" y="258" font-size="11" font-weight="600" fill="#09090B">CARD</text>
      <text x="650" y="258" font-size="13" fill="#52525B">4 px radius / 1:0.83 media / quick-add on intent</text>
      <text x="504" y="292" font-size="11" font-weight="600" fill="#09090B">TYPE</text>
      <text x="650" y="292" font-size="13" fill="#52525B">Syne 600 headings / Inter 400 body</text>
      <g id="Studio-Color-Tokens">
        <rect x="504" y="330" width="86" height="86" rx="4" fill="#FFFFFF" stroke="#E4E4E7"/>
        <rect x="606" y="330" width="86" height="86" rx="4" fill="#F4F4F5" stroke="#E4E4E7"/>
        <rect x="708" y="330" width="86" height="86" rx="4" fill="#09090B"/>
        <rect x="810" y="330" width="86" height="86" rx="4" fill="#18181B"/>
        <text x="504" y="438" font-size="11" fill="#52525B">BACKGROUND</text>
        <text x="606" y="438" font-size="11" fill="#52525B">SURFACE</text>
        <text x="708" y="438" font-size="11" fill="#52525B">INK</text>
        <text x="810" y="438" font-size="11" fill="#52525B">ACCENT</text>
      </g>
    </g>
  </g>

  <g id="Frame-Archive-Components" aria-label="Archive preset component specification">
    <rect x="0" y="580" width="1440" height="540" fill="#F4F3EE"/>
    <g id="Header-Archive">
      <rect x="0" y="580" width="1440" height="80" fill="#F4F3EE"/>
      <line x1="0" y1="659.25" x2="1440" y2="659.25" stroke="#CBC6B4" stroke-width="1.5"/>
      <text x="32" y="629" class="archive-heading" font-size="21" fill="#121212">ARCHIVE_03</text>
      <text x="166" y="629" class="archive-body" font-size="11" letter-spacing="1.65" fill="#495057">INDEX / SS-26</text>
      <g id="Archive-Nav" class="archive-body" font-size="12" fill="#121212">
        <g><rect x="352" y="598" width="76" height="44" class="hit"/><text x="364" y="626">[NEW]</text></g>
        <g><rect x="440" y="598" width="88" height="44" class="hit"/><text x="452" y="626">[WOMEN]</text></g>
        <g><rect x="540" y="598" width="76" height="44" class="hit"/><text x="552" y="626">[MEN]</text></g>
        <g><rect x="628" y="598" width="100" height="44" class="hit"/><text x="640" y="626">[OBJECTS]</text></g>
      </g>
      <g id="Shopify-Account-Archive" aria-label="Shopify account, 126 by 44">
        <rect x="1188" y="598" width="126" height="44" class="hit"/>
        <circle cx="1209" cy="613" r="5.5" fill="none" stroke="#121212" stroke-width="1.5"/>
        <path d="M1200.5 628 C1202 621.5 1216 621.5 1217.5 628" fill="none" stroke="#121212" stroke-width="1.5" stroke-linecap="round"/>
        <text x="1227" y="626" class="archive-body" font-size="12" fill="#121212">ACCOUNT_</text>
      </g>
      <text x="1338" y="626" class="archive-body" font-size="12" fill="#121212">CART[0]</text>
    </g>

    <g id="Product-Card-Archive">
      <text x="32" y="704" class="archive-heading" font-size="13" fill="#121212">CARD_PRODUCT / DEFAULT</text>
      <g clip-path="url(#archive-image)">
        <rect x="32" y="730" width="356" height="294" fill="#EAE8DF"/>
        <path d="M32 804 H388 M32 878 H388 M32 952 H388" stroke="#DFDBCF" stroke-width="1.5"/>
        <path d="M121 730 V1024 M210 730 V1024 M299 730 V1024" stroke="#DFDBCF" stroke-width="1.5"/>
        <ellipse cx="210" cy="950" rx="112" ry="20" fill="#D2CEC1"/>
        <path d="M111 920 C145 904 180 877 202 844 C229 872 263 900 313 918 L300 946 C245 961 172 960 118 944 Z" fill="#212529"/>
        <path d="M131 920 C173 927 243 927 294 917" fill="none" stroke="#F4F3EE" stroke-width="1.5"/>
        <text x="46" y="754" class="archive-body" font-size="10" fill="#495057">OBJ_07 / VIEW_A</text>
      </g>
      <rect x="32.75" y="730.75" width="354.5" height="292.5" fill="none" stroke="#CBC6B4" stroke-width="1.5"/>
      <g id="Archive-Card-Index" aria-label="Open item, 44 by 44">
        <rect x="332" y="742" width="44" height="44" fill="#F4F3EE" stroke="#CBC6B4" stroke-width="1.5"/>
        <text x="354" y="770" text-anchor="middle" class="archive-heading" font-size="12" fill="#121212">07</text>
      </g>
      <text x="32" y="1052" class="archive-heading" font-size="16" fill="#121212">ANATOMIC SLIP-ON / 07</text>
      <text x="32" y="1078" class="archive-body" font-size="12" fill="#495057">BLACK BUFFALO LEATHER</text>
      <text x="32" y="1104" class="archive-body" font-size="13" fill="#121212">USD 620.00</text>
      <g id="Archive-Quick-Add" aria-label="Quick add, 144 by 44">
        <rect x="244" y="1064" width="144" height="44" fill="#212529"/>
        <text x="316" y="1091" text-anchor="middle" class="archive-body" font-size="11" font-weight="500" fill="#F4F3EE">ADD_TO_CART</text>
      </g>
    </g>

    <g id="Archive-Specification" class="archive-body">
      <text x="504" y="710" class="archive-heading" font-size="30" fill="#121212">ARCHIVE / SYSTEM_03</text>
      <text x="504" y="744" font-size="14" fill="#495057">Technical curatorship with explicit structure and indexed objects.</text>
      <line x1="504" y1="772" x2="1408" y2="772" stroke="#CBC6B4" stroke-width="1.5"/>
      <text x="504" y="806" font-size="11" font-weight="500" fill="#121212">HEADER_</text>
      <text x="650" y="806" font-size="13" fill="#495057">80 PX / 32 PX GUTTER / 1.5 PX RULE</text>
      <text x="504" y="840" font-size="11" font-weight="500" fill="#121212">CARD_</text>
      <text x="650" y="840" font-size="13" fill="#495057">0 PX RADIUS / INDEX LABEL / VISIBLE GRID</text>
      <text x="504" y="874" font-size="11" font-weight="500" fill="#121212">TYPE_</text>
      <text x="650" y="874" font-size="13" fill="#495057">SPACE GROTESK 500 / MONO FALLBACK</text>
      <g id="Archive-Color-Tokens">
        <rect x="504" y="912" width="86" height="86" fill="#F4F3EE" stroke="#CBC6B4" stroke-width="1.5"/>
        <rect x="606" y="912" width="86" height="86" fill="#EAE8DF" stroke="#CBC6B4" stroke-width="1.5"/>
        <rect x="708" y="912" width="86" height="86" fill="#121212"/>
        <rect x="810" y="912" width="86" height="86" fill="#212529"/>
        <text x="504" y="1020" font-size="11" fill="#495057">BACKGROUND</text>
        <text x="606" y="1020" font-size="11" fill="#495057">SURFACE</text>
        <text x="708" y="1020" font-size="11" fill="#495057">INK</text>
        <text x="810" y="1020" font-size="11" fill="#495057">ACCENT</text>
      </g>
    </g>
  </g>
</svg>
```

## 2. Arquitectura visual Couture

### Desktop 1440

- Header de 72 px, gutter de 32 px, borde hairline y navegacion con targets invisibles de 44 px.
- `<shopify-account>` simulado mediante el grupo `Shopify-Account-Simulated-PDP`.
- PDP de doble eje: galeria 2x2 de 844 px y columna de compra de 464 px.
- Galeria con cuatro encuadres hairline, contador lineal y arte vectorial reemplazable por media Shopify.
- Selector de color con tres swatches y selector de talla con estados default/selected, todos de 44 px de alto.
- Bloque `App-Block-Product-Reviews` reservado para un bloque `@app` real.
- Sticky Cart Bar de 88 px fijada visualmente al borde inferior del viewport PDP.
- Lookbook en un segundo frame 1440x1024 con dos hotspots de 48 px, estado activo y popover de producto.

### Mobile 390

- Header de 64 px con menu, cuenta y bolsa, cada accion dentro de un area de 44x44 px.
- Galeria de 358x378 px, contador `1 / 4` y progreso horizontal.
- Titulo, precio, tallas y reviews conservan prioridad antes del primer scroll largo.
- Sticky Cart Bar de 84 px con thumbnail, titulo, precio/variante y CTA de 104x52 px.
- Lookbook separado en un frame 390x844, con hotspots tactiles de 48 px y popover contenido en viewport.
- Caption inferior y CTA mantienen distancia con el borde y no dependen de hover.

### Capas y nombres

Los grupos SVG llevan IDs deterministas para conservar una jerarquia util al importar:

```text
Frame-Couture-{Desktop|Mobile}-{PDP|Lookbook}
Header-Editorial-*
Shopify-Account-Simulated-*
PDP-Gallery-*
Variant-Selector-*
App-Block-Product-Reviews-*
Sticky-Cart-Bar-*
Hotspot-*-{Idle|Active}
Lookbook-Product-Popover-*
```

## 3. Presets alternativos

### Studio

| Aspecto | Especificacion |
| --- | --- |
| Intencion | Galeria de moda contemporanea, blanca, precisa y rapida de escanear. |
| Header | 80 px, gutter 32 px, regla de 1 px, logo grotesk de peso 600. |
| Product Card | Radio 4 px, media 356x294, wishlist 44x44 y Quick Add 132x44. |
| Tipografia | Syne/General Sans para heading; Inter/system sans para body. |
| Color | Background `#FFFFFF`, surface `#F4F4F5`, foreground `#09090B`, accent `#18181B`. |
| Interaccion | Quick Add aparece por foco/hover en desktop y permanece visible en tactil. |
| Motion | 160-200 ms, opacidad y desplazamiento maximo de 8 px; sin escalado decorativo. |

### Archive

| Aspecto | Especificacion |
| --- | --- |
| Intencion | Catalogo tecnico y curatorial con lenguaje indexado y estructura expuesta. |
| Header | 80 px, gutter 32 px, borde de 1.5 px y etiquetas entre corchetes. |
| Product Card | Radio 0, reticula visible, indice de objeto 44x44 y CTA 144x44. |
| Tipografia | Space Grotesk 500; Courier New como fallback tecnico. |
| Color | Background `#F4F3EE`, surface `#EAE8DF`, foreground `#121212`, accent `#212529`. |
| Interaccion | Estados se comunican con texto, numero y borde, nunca solo mediante color. |
| Motion | 120-180 ms, cambio directo de regla/fondo; sin parallax ni desplazamientos amplios. |

## 4. Componentes Figma recomendados

Para convertir los blueprints en sistema reusable durante Phase 3B:

| Componente | Propiedades / variantes |
| --- | --- |
| `Header` | `Preset=Couture|Studio|Archive`, `Device=Desktop|Mobile`, `Menu=Closed|Open` |
| `ShopifyAccount` | `Device=Desktop|Mobile`, `State=SignedOut|SignedIn` |
| `ProductCard` | `Preset=Couture|Studio|Archive`, `State=Default|Hover|SoldOut` |
| `VariantChip` | `State=Default|Selected|Disabled`, `Available=True|False` |
| `StickyCartBar` | `Device=Desktop|Mobile`, `State=Default|Loading|Added|Error` |
| `Hotspot` | `State=Idle|Hover|Active`, target fijo de 48x48 px |
| `LookbookPopover` | `Device=Desktop|Mobile`, `State=Open|Closed` |
| `AppBlockPlaceholder` | `Device=Desktop|Mobile`, `Content=Reviews|Generic` |

Auto Layout recomendado:

- `Header`: horizontal, align center, space-between; padding 32 desktop y 16 mobile.
- `VariantChipGroup`: horizontal, gap 8, wrap activo.
- `AppBlockPlaceholder`: horizontal, align center, space-between.
- `StickyCartBar`: horizontal, align center, padding 16/32 y gap 16.
- `LookbookPopover`: horizontal, gap 16; posicion absoluta dentro del frame de media.
- `Hotspot`: posicion absoluta; no debe entrar en el flujo del Auto Layout del lookbook.

## 5. Interacciones de prototipo

### Hotspots

1. `Idle -> Active`: `On click`, Smart Animate, 180 ms, ease-out.
2. El estado `Active` muestra dos anillos concentricos y abre `LookbookPopover`.
3. Solo un hotspot puede permanecer activo; activar el segundo cierra el primero.
4. En implementacion web: `Enter`/`Space` abre, `Escape` cierra y devuelve el foco al hotspot.
5. Con `prefers-reduced-motion`, eliminar pulso y usar un cambio inmediato de borde/opacidad.

### Sticky Cart Bar

1. Aparece cuando el formulario de compra principal deja el viewport y existe una variante disponible.
2. Se oculta cuando el formulario vuelve a ser visible o al abrir cart drawer.
3. Estado `Loading`: CTA deshabilitado con etiqueta de progreso anunciable.
4. Estado `Added`: confirmacion textual breve; no depender solo de color.
5. Mobile debe incluir `env(safe-area-inset-bottom)` en Phase 3B.

## 6. Mapeo tokens Figma -> Shopify CSS

### 6.1 Matriz oficial de valores

Todos los valores de interfaz proceden literalmente de `docs/design-tokens.json`. Los tonos adicionales dentro de las galerias, prendas y fotografia editorial vectorial representan pixeles de media reemplazable; no son tokens ni estilos de UI.

| Token global | Valor oficial |
| --- | --- |
| `global.spacing.none / 3xs / 2xs / xs / sm / md / lg / xl / 2xl / 3xl / 4xl` | `0px / 2px / 4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 96px` |
| `global.grid.container_max_width` | `1440px` |
| `global.grid.gutter_mobile` | `16px` |
| `global.grid.gutter_desktop` | `32px` |
| `global.grid.tap_target_min` | `44px` |

| Token de color | Couture | Studio | Archive |
| --- | --- | --- | --- |
| `background` | `#FAF8F5` | `#FFFFFF` | `#F4F3EE` |
| `surface` | `#F3EFEA` | `#F4F4F5` | `#EAE8DF` |
| `surface_subtle` | `#EDE7DE` | `#E4E4E7` | `#DFDBCF` |
| `foreground` | `#1C1917` | `#09090B` | `#121212` |
| `foreground_muted` | `#605A53` | `#52525B` | `#495057` |
| `border` | `#E5DFD5` | `#E4E4E7` | `#CBC6B4` |
| `border_hairline` | `#EDE7DE` | `#F4F4F5` | `#DCD7C8` |
| `accent` | `#786C5E` | `#18181B` | `#212529` |
| `accent_contrast` | `#FFFFFF` | `#FFFFFF` | `#F4F3EE` |
| `sale_badge_bg` | `#1C1917` | `#09090B` | `#121212` |
| `sale_badge_text` | `#FAF8F5` | `#FFFFFF` | `#F4F3EE` |

| Token tipografico | Couture | Studio | Archive |
| --- | --- | --- | --- |
| `font_family_heading` | `'Playfair Display', Georgia, 'Times New Roman', serif` | `'Syne', 'General Sans', -apple-system, sans-serif` | `'Space Grotesk', 'Courier New', monospace` |
| `font_family_body` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | `'Space Grotesk', -apple-system, sans-serif` |
| `font_weight_heading` | `400` | `600` | `500` |
| `letter_spacing_heading` | `-0.02em` | `-0.03em` | `-0.01em` |
| `letter_spacing_eyebrow` | `0.12em` | `0.08em` | `0.15em` |

| Token de forma | Couture | Studio | Archive |
| --- | --- | --- | --- |
| `border_radius_card` | `0px` | `4px` | `0px` |
| `border_radius_button` | `2px` | `4px` | `0px` |
| `border_radius_input` | `0px` | `4px` | `0px` |
| `border_width` | `1px` | `1px` | `1.5px` |

### 6.2 Correspondencia de variables

| Token de `docs/design-tokens.json` | Nombre Figma recomendado | Variable CSS existente / accion Phase 3B |
| --- | --- | --- |
| `presets.*.color.background` | `color/{preset}/background` | `--color-background` y `--gradient-background` con color solido |
| `presets.*.color.foreground` | `color/{preset}/foreground` | `--color-foreground`, `--color-link`, `--color-shadow` |
| `presets.*.color.foreground_muted` | `color/{preset}/foreground-muted` | No existe; proponer `--color-foreground-muted` |
| `presets.*.color.border` | `color/{preset}/border` | `--color-border` |
| `presets.*.color.accent` | `color/{preset}/accent` | `--color-button` |
| `presets.*.color.accent_contrast` | `color/{preset}/on-accent` | `--color-button-label` |
| `presets.*.color.surface` | `color/{preset}/surface` | No existe; proponer `--color-surface` |
| `presets.*.color.surface_subtle` | `color/{preset}/surface-subtle` | No existe; proponer `--color-surface-subtle` |
| `presets.*.color.border_hairline` | `color/{preset}/border-hairline` | No existe; proponer `--color-border-hairline` |
| `presets.*.color.sale_badge_bg` | `color/{preset}/sale-bg` | Puede derivar de `--color-foreground`; variable dedicada si el merchant debe editarla |
| `presets.*.color.sale_badge_text` | `color/{preset}/sale-text` | Puede derivar de `--color-background`; variable dedicada si el merchant debe editarla |
| `presets.*.typography.font_family_heading` | `type/{preset}/heading-family` | `--font-heading-family` |
| `presets.*.typography.font_family_body` | `type/{preset}/body-family` | `--font-body-family` |
| `presets.*.typography.font_weight_heading` | `type/{preset}/heading-weight` | `--font-heading-weight` |
| `presets.*.typography.letter_spacing_heading` | `type/{preset}/heading-tracking` | No existe; proponer `--font-heading-letter-spacing` |
| `presets.*.typography.letter_spacing_eyebrow` | `type/{preset}/eyebrow-tracking` | No existe; proponer `--font-eyebrow-letter-spacing` |
| `presets.*.shape.border_radius_button` | `shape/{preset}/button-radius` | `--button-radius` |
| `presets.*.shape.border_radius_card` | `shape/{preset}/card-radius` | No existe; proponer `--card-radius` |
| `presets.*.shape.border_radius_input` | `shape/{preset}/input-radius` | No existe; proponer `--input-radius` |
| `presets.*.shape.border_width` | `shape/{preset}/border-width` | Actualmente hardcodeado; proponer `--border-width` |
| `global.grid.container_max_width` | `grid/container-max-width` | `--page-width` |
| `global.grid.gutter_mobile` | `grid/gutter-mobile` | `--page-gutter` en base |
| `global.grid.gutter_desktop` | `grid/gutter-desktop` | `--page-gutter` en breakpoint desktop |
| `global.grid.tap_target_min` | `size/tap-target-min` | No existe; proponer `--tap-target-min` |
| `global.spacing.sm` a `2xl` | `spacing/sm` a `spacing/2xl` | `--space-2` a `--space-6` ya coinciden: 12, 16, 24, 32, 48 px |
| `global.spacing.3xs`, `2xs`, `xs`, `3xl`, `4xl` | mismo path Figma | Sin equivalencia; ampliar escala CSS en Phase 3B |

### 6.3 Contrato CSS objetivo para Phase 3B

Este bloque es especificacion, no fue aplicado al tema:

```css
:root {
  --page-width: 1440px;
  --page-gutter-mobile: 16px;
  --page-gutter-desktop: 32px;
  --tap-target-min: 44px;
  --space-none: 0px;
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
}

/* Couture */
--color-background: #FAF8F5;
--color-surface: #F3EFEA;
--color-surface-subtle: #EDE7DE;
--color-foreground: #1C1917;
--color-foreground-muted: #605A53;
--color-border: #E5DFD5;
--color-border-hairline: #EDE7DE;
--color-button: #786C5E;
--color-button-label: #FFFFFF;
--color-sale-badge: #1C1917;
--color-sale-badge-label: #FAF8F5;
--font-heading-family: "Playfair Display", Georgia, "Times New Roman", serif;
--font-body-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading-weight: 400;
--font-heading-letter-spacing: -0.02em;
--font-eyebrow-letter-spacing: 0.12em;
--card-radius: 0px;
--button-radius: 2px;
--input-radius: 0px;
--border-width: 1px;

/* Studio */
--color-background: #FFFFFF;
--color-surface: #F4F4F5;
--color-surface-subtle: #E4E4E7;
--color-foreground: #09090B;
--color-foreground-muted: #52525B;
--color-border: #E4E4E7;
--color-border-hairline: #F4F4F5;
--color-button: #18181B;
--color-button-label: #FFFFFF;
--color-sale-badge: #09090B;
--color-sale-badge-label: #FFFFFF;
--font-heading-family: "Syne", "General Sans", -apple-system, sans-serif;
--font-body-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading-weight: 600;
--font-heading-letter-spacing: -0.03em;
--font-eyebrow-letter-spacing: 0.08em;
--card-radius: 4px;
--button-radius: 4px;
--input-radius: 4px;
--border-width: 1px;

/* Archive */
--color-background: #F4F3EE;
--color-surface: #EAE8DF;
--color-surface-subtle: #DFDBCF;
--color-foreground: #121212;
--color-foreground-muted: #495057;
--color-border: #CBC6B4;
--color-border-hairline: #DCD7C8;
--color-button: #212529;
--color-button-label: #F4F3EE;
--color-sale-badge: #121212;
--color-sale-badge-label: #F4F3EE;
--font-heading-family: "Space Grotesk", "Courier New", monospace;
--font-body-family: "Space Grotesk", -apple-system, sans-serif;
--font-heading-weight: 500;
--font-heading-letter-spacing: -0.01em;
--font-eyebrow-letter-spacing: 0.15em;
--card-radius: 0px;
--button-radius: 0px;
--input-radius: 0px;
--border-width: 1.5px;
```

### Diferencias detectadas con `assets/base.css`

- Token `container_max_width` es 1440 px; el fallback CSS actual es 1300 px.
- Gutter tokenizado es 16 px mobile / 32 px desktop; el fallback actual es 20 px unico.
- `--space-1` actual vale 6 px, valor que no existe en la escala W3C del proyecto.
- Faltan variables semanticas para surface, surface-subtle, hairline, card radius, input radius y border width.
- Estas diferencias se documentan para Phase 3B y no se corrigieron aqui por la restriccion de no tocar codigo Shopify.

## 7. Importacion en Figma Starter

### SVG mediante copiar y pegar

Primera importacion obligatoria: usar el bloque `1.1.1 Couture Desktop 1440 - copiar primero`. Es el blueprint P0 de referencia para que Gemini audite jerarquia, tokens y componentes en el archivo oficial `132QRVaYF2wRverRKEaymB` antes de incorporar Mobile, Studio y Archive.

Para cada bloque:

1. Seleccionar desde `<svg` hasta `</svg>` dentro del bloque, sin copiar los delimitadores Markdown, y copiar.
2. Hacer clic en una zona vacia del lienzo de Figma y pulsar `Ctrl+V`.
3. Si el editor pega el XML como texto, arrastrar el archivo `.svg` directamente al lienzo. Es el fallback oficial y conserva los vectores.

Despues de importar:

1. Seleccionar cada grupo `Frame-Couture-*` y usar `Ctrl+Alt+G` para convertir la seleccion en Frame.
2. Aplicar `Shift+A` solamente a los grupos enumerados en la seccion 4.
3. Mantener galeria, hotspots y popovers como capas de posicion absoluta.
4. Crear componentes con `Ctrl+Alt+K` y combinar sus estados como variantes.

Limitacion tecnica importante: SVG conserva vectores, texto y grupos, pero el estandar SVG no transporta Auto Layout, componentes, variables ni conexiones de prototipo de Figma. Esas propiedades deben aplicarse despues del pegado; Gemini puede inspeccionarlas y completar su auditoria mediante MCP usando el `fileKey` oficial ya registrado. Figma confirma que Auto Layout esta disponible en Starter y se aplica con `Shift+A`.

### Tokens Studio gratuito

La cuenta Starter no necesita Dev Mode para variables locales. Flujo recomendado:

1. Abrir Tokens Studio y crear cuatro Token Sets: `global`, `couture`, `studio`, `archive`.
2. Elegir formato W3C DTCG en el plugin y normalizar `value/type/description` a `$value/$type/$description` antes de pegar. El archivo actual declara schema DTCG, pero conserva claves legacy.
3. Pegar cada subtree en la vista JSON de su Token Set y guardar.
4. Ir a `Styles & Variables -> Export Styles & Variables -> Token Sets`.
5. Exportar color, string y number como variables. En la licencia gratuita cada Token Set se convierte en una coleccion separada; los modes agrupados requieren plan/licencia superior.

Alternativa sin plugin: crear cuatro colecciones locales de Figma con los mismos nombres. Figma Starter permite crear y usar variables locales, aunque no ofrece multiples modes por coleccion ni publicar una library compartida.

Referencias operativas verificadas:

- Figma, copiar/importar SVG: <https://help.figma.com/hc/en-us/articles/360040030374-Copy-assets-between-design-tools>
- Figma, Auto Layout: <https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout>
- Figma, variables en Starter: <https://help.figma.com/hc/en-us/articles/39723547036055-Components-collection-Library-fundamentals>
- Tokens Studio, exportar Token Sets gratuitos: <https://docs.tokens.studio/figma/export/>
- Tokens Studio, formato DTCG/legacy: <https://docs.tokens.studio/manage-settings/token-format>

## 8. Accesibilidad y QA

### Contraste calculado

| Par | Ratio |
| --- | ---: |
| Couture foreground / background | 16.50:1 |
| Couture muted / background | 6.42:1 |
| Couture accent / white | 5.12:1 |
| Studio foreground / background | 19.90:1 |
| Studio muted / background | 7.73:1 |
| Studio accent / white | 17.72:1 |
| Archive foreground / background | 16.86:1 |
| Archive muted / background | 7.36:1 |
| Archive accent / contrast | 13.88:1 |

Todos los pares usados para texto body o UI superan WCAG 2.2 AA. Los targets interactivos visibles o documentados miden al menos 44x44 px; los hotspots miden 48x48 px.

Los ratios fueron recalculados desde los valores hex oficiales. Pueden diferir del texto descriptivo `contrastRatio` incluido en algunos tokens, pero ningun color fue ajustado o sustituido.

### Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| Parse XML de los tres SVG | PASS |
| Dimensiones raiz y frames internos | PASS: 1440 / 390 contractuales |
| IDs duplicados | PASS: 0 en los tres archivos |
| Recursos externos, scripts, `foreignObject`, patterns o markers | PASS: 0 |
| Render raster 2x con Sharp | PASS: 2880x4288, 780x3528 y 2880x2240 |
| QA visual de texto, solapamientos y clipping | PASS |
| `git diff --check` | PASS |
| Archivos Liquid/JSON/CSS/JS modificados | 0 |

## 9. Riesgos y siguiente accion

### P0

- Ninguno en el artefacto SVG.

### P1

- El JSON de tokens mezcla un `$schema` DTCG con claves legacy `value/type`. Gemini debe autorizar una tarea corta de normalizacion antes de usar importacion automatica en Tokens Studio.
- El CSS actual no expone todas las variables semanticas y sus fallbacks de page width/gutter difieren del contrato visual. Resolver en Phase 3B, no en este cambio.
- El `fileKey` oficial esta disponible, pero la estructura nativa solo podra auditarse despues de que el usuario pegue el primer bloque en el lienzo; esta entrega no escribio directamente en Figma.

### P2

- Las figuras y productos son placeholders vectoriales originales para definir composicion. Deben sustituirse por media merchant real conservando aspect ratios.

Siguiente accion recomendada para Gemini: auditar primero `Couture Desktop 1440` ya pegado en el archivo oficial, revisar despues Mobile y las variantes de preset, y, si acepta Phase 3A, emitir una tarea Phase 3B separada para (1) normalizar tokens, (2) crear variables/componentes nativos y (3) traducir Sticky Cart Bar + Lookbook a Liquid/CSS/JS.

## 10. Git

No se realizo commit ni push. La directiva no los autorizaba antes de la revision de Gemini.
