# Genera las entradas de productSet de los fixtures del Sprint 5A (CLAUDE-DIRECTIVE-5A-002).
# Los IDs de colección, ubicación y metaobjetos son los de tema-qkqpke0j. Salida: products.json.
import json
L="gid://shopify/Location/95234818291"; C="gid://shopify/Collection/490144170227"
CDN="https://cdn.shopify.com/s/files/1/0854/1978/6483/files/"
IMG={"serra":"serra-coat-01.jpg?v=1789427381","doppio":"doppio-trench-01.jpg?v=1789427381","cocoon":"cocoon-cardigan-coat-01.jpg?v=1789427383",
"quilted":"quilted-silk-liner-01.jpg?v=1789427384","blazer":"nove-blazer-01.jpg?v=1789427385","cropped":"cropped-tailored-jacket-01.jpg?v=1789427386",
"waistcoat":"wool-waistcoat-01.jpg?v=1789427391","crew":"cashmere-rib-crew-01.jpg?v=1789427392","turtle":"fine-merino-turtleneck-01.jpg?v=1789427393",
"alpaca":"oversized-alpaca-knit-01.jpg?v=1789427395","poplin":"poplin-column-shirt-01.jpg?v=1789427396","stripe":"striped-cotton-shirt-01.jpg?v=1789427399"}
MO={"Ink":"gid://shopify/Metaobject/428524699891","Bone":"gid://shopify/Metaobject/428524732659","Clay":"gid://shopify/Metaobject/428524765427",
"Undyed":"gid://shopify/Metaobject/428524798195","Camel":"gid://shopify/Metaobject/428524830963","Olive":"gid://shopify/Metaobject/428524863731",
"Burgundy":"gid://shopify/Metaobject/428524896499","Slate":"gid://shopify/Metaobject/428524929267","Forest":"gid://shopify/Metaobject/428524962035"}
CAT="gid://shopify/TaxonomyCategory/aa-1-10-2-17"
def f(key, fn, alt): return {"originalSource": CDN+IMG[key], "filename": fn, "alt": alt, "contentType":"IMAGE", "duplicateResolutionMode":"APPEND_UUID"}
def inv(q): return {"inventoryQuantities":[{"locationId":L,"name":"available","quantity":q}], "inventoryItem":{"tracked":True}, "inventoryPolicy":"DENY"}
def base(handle,title,code,ptype="QA fixture",vendor="LINEA NOVE"):
    return {"handle":handle,"title":title,"status":"ACTIVE","vendor":vendor,"productType":ptype,"collections":[C],"tags":["qa-sprint-5a"],
            "descriptionHtml":f"<p>QA fixture {code} for Sprint 5A (GPT-AUDIT-004). Not a real product.</p>"}
def single(handle,title,code,img,alt,price,q,**kw):
    p=base(handle,title,code,**kw); fi=f(img,f"{handle}.jpg",alt)
    p["files"]=[fi]; p["productOptions"]=[{"name":"Title","values":[{"name":"Default Title"}]}]
    p["variants"]=[{"optionValues":[{"optionName":"Title","name":"Default Title"}],"price":price,**inv(q)}]
    return p
P={}
P["f01"]=single("qa5a-f01-single","F01 Single Variant Waistcoat","F01","waistcoat","Ink five-button wool waistcoat","420.00",20)
P["f02"]=single("qa5a-f02-sold-out","F02 Sold Out Poplin Shirt","F02","poplin","White cotton poplin shirt","290.00",0)
# F03 talla sola, M agotada
p=base("qa5a-f03-size-only","F03 Size Only Blazer","F03"); p["files"]=[f("blazer","qa5a-f03-size-only.jpg","Ink single-button wool blazer")]
sizes=["XS","S","M","L","XL"]; p["productOptions"]=[{"name":"Size","values":[{"name":s} for s in sizes]}]
p["variants"]=[{"optionValues":[{"optionName":"Size","name":s}],"price":"890.00",**inv(0 if s=="M" else 5)} for s in sizes]; P["f03"]=p
# F10 hostil
t="F10 Oversized Double-Faced Wool and Cashmere Belted Wrap Coat with Raglan Sleeves, Concealed Placket, Detachable Storm Collar and Horn Buttons"
p=base("qa5a-f10-hostile",t,"F10",vendor="Atelier Nove Maison de Couture Contemporaine Milano Paris"); p["files"]=[f("serra","qa5a-f10-hostile.jpg","Camel double-faced wool wrap coat")]
p["productOptions"]=[{"name":"Size","values":[{"name":s} for s in ["S","M","L"]]}]
p["variants"]=[{"optionValues":[{"optionName":"Size","name":s}],"price":"2450.00",**inv(3)} for s in ["S","M","L"]]; P["f10"]=p
# F04 color (texto, sin swatch nativo) x talla
p=base("qa5a-f04-colour-size","F04 Colour and Size Knit","F04")
cimg={"Ink":("stripe","Ink woven stripe cotton shirt"),"Camel":("alpaca","Camel chunky alpaca knit"),"Olive":("turtle","Olive merino turtleneck"),"Bone":("crew","Bone cashmere rib crew")}
p["files"]=[f(k,f"qa5a-f04-{c.lower()}.jpg",a) for c,(k,a) in cimg.items()]
cols=list(cimg); sz=["S","M","L","XL"]
p["productOptions"]=[{"name":"Color","values":[{"name":c} for c in cols]},{"name":"Size","values":[{"name":s} for s in sz]}]
vs=[]
for c in cols:
    for s in sz:
        if c=="Olive" and s=="XL": continue
        q=0 if (c=="Bone" or (c=="Camel" and s in ("S","M"))) else 4
        v={"optionValues":[{"optionName":"Color","name":c},{"optionName":"Size","name":s}],"price":"340.00" if c=="Camel" else "320.00",**inv(q),
           "file":f(cimg[c][0],f"qa5a-f04-{c.lower()}.jpg",cimg[c][1])}
        if c=="Ink": v["compareAtPrice"]="380.00"
        vs.append(v)
p["variants"]=vs; P["f04"]=p
# F05 swatches nativos x talla
p=base("qa5a-f05-native-swatches","F05 Native Swatch Coat","F05"); p["category"]=CAT
cimg={"Ink":("quilted","Ink quilted silk liner"),"Bone":("cocoon","Bone alpaca cardigan-coat"),"Clay":("doppio","Clay waxed cotton trench")}
p["files"]=[f(k,f"qa5a-f05-{c.lower()}.jpg",a) for c,(k,a) in cimg.items()]
cols=["Ink","Bone","Clay","Undyed"]; sz=["S","M","L"]
p["productOptions"]=[{"name":"Color","linkedMetafield":{"namespace":"shopify","key":"color-pattern","values":[MO[c] for c in cols]}},{"name":"Size","values":[{"name":s} for s in sz]}]
vs=[]
for c in cols:
    for s in sz:
        v={"optionValues":[{"optionName":"Color","linkedMetafieldValue":MO[c]},{"optionName":"Size","name":s}],"price":"1290.00",**inv(0 if (c=="Bone" and s=="S") else 3)}
        if c in cimg: v["file"]=f(cimg[c][0],f"qa5a-f05-{c.lower()}.jpg",cimg[c][1])
        vs.append(v)
p["variants"]=vs; P["f05"]=p
# F11 siete swatches, color como unica opcion
p=base("qa5a-f11-many-swatches","F11 Seven Colour Cashmere Wrap","F11"); p["category"]=CAT
cimg={"Ink":("quilted","Ink quilted silk liner"),"Bone":("cocoon","Bone alpaca cardigan-coat"),"Camel":("serra","Camel wool wrap coat"),"Olive":("cropped","Olive cropped wool jacket")}
p["files"]=[f(k,f"qa5a-f11-{c.lower()}.jpg",a) for c,(k,a) in cimg.items()]
cols=["Ink","Bone","Camel","Olive","Burgundy","Slate","Forest"]
p["productOptions"]=[{"name":"Color","linkedMetafield":{"namespace":"shopify","key":"color-pattern","values":[MO[c] for c in cols]}}]
vs=[]
for c in cols:
    v={"optionValues":[{"optionName":"Color","linkedMetafieldValue":MO[c]}],"price":"690.00",**inv(0 if c=="Burgundy" else 6)}
    if c in cimg: v["file"]=f(cimg[c][0],f"qa5a-f11-{c.lower()}.jpg",cimg[c][1])
    vs.append(v)
p["variants"]=vs; P["f11"]=p
# F06 suscripcion obligatoria
p=single("qa5a-f06-subscription","F06 Subscription Only Care Kit","F06","crew","Bone cashmere rib crew","60.00",50); p["requiresSellingPlan"]=True; P["f06"]=p
# F08 gift card
p=base("qa5a-f08-gift-card","F08 Atelier Gift Card","F08",ptype="Gift card"); p["giftCard"]=True; p["files"]=[f("poplin","qa5a-f08-gift-card.jpg","White cotton poplin shirt")]
den=["100.00","250.00","500.00"]; p["productOptions"]=[{"name":"Denomination","values":[{"name":"$"+d[:-3]} for d in den]}]
p["variants"]=[{"optionValues":[{"optionName":"Denomination","name":"$"+d[:-3]}],"price":d} for d in den]; P["f08"]=p
json.dump(P,open("products.json","w"),indent=1)
for k,v in P.items(): print(k, len(v["title"]), len(v.get("variants",[])))
