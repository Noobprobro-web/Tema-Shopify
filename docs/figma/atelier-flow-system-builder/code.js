const PAGE_FOUNDATIONS = "01 Foundations & Components";
const PAGE_COUTURE = "02 Couture Screens & Flows";
const PAGE_PRESETS = "03 Presets (Studio & Archive) + QA";
const GENERATED_KEY = "atelier-flow-system-builder";

const HEX = {
  background: "#FAF8F5",
  surface: "#F3EFEA",
  subtle: "#EDE7DE",
  foreground: "#1C1917",
  muted: "#605A53",
  border: "#E5DFD5",
  hairline: "#EDE7DE",
  accent: "#786C5E",
  white: "#FFFFFF"
};

const COLOR_TOKEN_NAMES = {
  background: "background",
  surface: "surface",
  subtle: "surface-subtle",
  foreground: "foreground",
  muted: "foreground-muted",
  border: "border",
  hairline: "border-hairline",
  accent: "accent",
  white: "accent-contrast"
};

const FONT = {
  heading: { family: "Playfair Display", style: "Regular" },
  body: { family: "Plus Jakarta Sans", style: "Regular" },
  label: { family: "Plus Jakarta Sans", style: "Medium" }
};

function rgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255
  };
}

function solid(hex, opacity = 1) {
  return { type: "SOLID", color: rgb(hex), opacity };
}

function configureAutoLayout(node, direction, width, height, gap = 0) {
  node.layoutMode = direction;
  node.primaryAxisSizingMode = "FIXED";
  node.counterAxisSizingMode = "FIXED";
  node.primaryAxisAlignItems = "MIN";
  node.counterAxisAlignItems = "MIN";
  node.itemSpacing = gap;
  node.resize(width, height);
}

function applyBox(node, fill, stroke = null, radius = 0) {
  node.fills = fill ? [solid(fill)] : [];
  node.strokes = stroke ? [solid(stroke)] : [];
  node.strokeWeight = stroke ? 1 : 0;
  node.cornerRadius = radius;
}

function bindPaint(hex, variable) {
  if (!variable) return solid(hex);
  return figma.variables.setBoundVariableForPaint(solid(hex), "color", variable);
}

function append(parent, child) {
  parent.appendChild(child);
  return child;
}

function makeText(value, size = 14, color = HEX.foreground, font = FONT.body) {
  const node = figma.createText();
  node.fontName = font;
  node.fontSize = size;
  node.lineHeight = { unit: "AUTO" };
  node.characters = value;
  node.fills = [solid(color)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function makeFrame(name, direction, width, height, gap = 0, fill = null, stroke = null, radius = 0) {
  const node = figma.createFrame();
  node.name = name;
  configureAutoLayout(node, direction, width, height, gap);
  applyBox(node, fill, stroke, radius);
  return node;
}

function makeComponent(name, direction, width, height, gap = 0, fill = null, stroke = null, radius = 0) {
  const node = figma.createComponent();
  node.name = name;
  configureAutoLayout(node, direction, width, height, gap);
  applyBox(node, fill, stroke, radius);
  node.clipsContent = false;
  return node;
}

function pad(node, vertical, horizontal) {
  node.paddingTop = vertical;
  node.paddingBottom = vertical;
  node.paddingLeft = horizontal;
  node.paddingRight = horizontal;
}

function makeMedia(width, height, tone = HEX.surface, garment = HEX.foreground) {
  const media = makeFrame("media", "VERTICAL", width, height, 0, tone);
  media.primaryAxisAlignItems = "CENTER";
  media.counterAxisAlignItems = "CENTER";
  const shape = figma.createRectangle();
  shape.name = "product-silhouette";
  shape.resize(Math.round(width * 0.36), Math.round(height * 0.7));
  shape.fills = [solid(garment)];
  append(media, shape);
  return media;
}

function makeSwatches(selected = "Oat") {
  const row = makeFrame("swatches", "HORIZONTAL", 72, 20, 8);
  ["Oat", "Ink", "Stone"].forEach((name) => {
    const swatch = figma.createEllipse();
    swatch.name = `swatch-${name}`;
    swatch.resize(16, 16);
    swatch.fills = [solid(name === "Ink" ? HEX.foreground : name === "Stone" ? HEX.accent : HEX.background)];
    swatch.strokes = [solid(name === selected ? HEX.foreground : HEX.border)];
    swatch.strokeWeight = name === selected ? 2 : 1;
    append(row, swatch);
  });
  return row;
}

function makeStepper() {
  const stepper = makeFrame("quantity-stepper", "HORIZONTAL", 132, 44, 0, HEX.background, HEX.border);
  stepper.counterAxisAlignItems = "CENTER";
  stepper.primaryAxisAlignItems = "CENTER";
  [makeText("-", 16), makeText("1", 14, HEX.foreground, FONT.label), makeText("+", 16)].forEach((item) => {
    const slot = makeFrame("control", "HORIZONTAL", 44, 44);
    slot.primaryAxisAlignItems = "CENTER";
    slot.counterAxisAlignItems = "CENTER";
    append(slot, item);
    append(stepper, slot);
  });
  return stepper;
}

async function ensurePages() {
  const pages = [...figma.root.children];
  let foundations = pages.find((page) => page.name === PAGE_FOUNDATIONS);
  if (!foundations) {
    foundations = pages.length === 1 && pages[0].children.length === 0 ? pages[0] : figma.createPage();
    foundations.name = PAGE_FOUNDATIONS;
  }
  let couture = [...figma.root.children].find((page) => page.name === PAGE_COUTURE);
  if (!couture) {
    couture = figma.createPage();
    couture.name = PAGE_COUTURE;
  }
  let presets = [...figma.root.children].find((page) => page.name === PAGE_PRESETS);
  if (!presets) {
    presets = figma.createPage();
    presets.name = PAGE_PRESETS;
  }
  return { foundations, couture, presets };
}

async function ensureCollection(name) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find((entry) => entry.name === name);
  if (!collection) collection = figma.variables.createVariableCollection(name);
  collection.renameMode(collection.modes[0].modeId, "Value");
  return collection;
}

async function ensureVariable(collection, name, type, value, scopes, codeSyntax) {
  const all = await figma.variables.getLocalVariablesAsync();
  let variable = all.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!variable) variable = figma.variables.createVariable(name, collection, type);
  variable.setValueForMode(collection.modes[0].modeId, value);
  variable.scopes = scopes;
  if (codeSyntax) variable.setVariableCodeSyntax("WEB", codeSyntax);
  return variable;
}

async function buildVariables() {
  const couture = await ensureCollection("Atelier Flow / Couture");
  const global = await ensureCollection("Atelier Flow / Global");
  const colors = {};
  const colorScopes = {
    background: ["FRAME_FILL", "SHAPE_FILL"],
    surface: ["FRAME_FILL", "SHAPE_FILL"],
    subtle: ["FRAME_FILL", "SHAPE_FILL"],
    foreground: ["TEXT_FILL", "SHAPE_FILL", "STROKE_COLOR"],
    muted: ["TEXT_FILL", "SHAPE_FILL", "STROKE_COLOR"],
    border: ["STROKE_COLOR"],
    hairline: ["STROKE_COLOR"],
    accent: ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"],
    white: ["TEXT_FILL", "SHAPE_FILL"]
  };
  for (const [name, hex] of Object.entries(HEX)) {
    const tokenName = COLOR_TOKEN_NAMES[name];
    colors[name] = await ensureVariable(
      couture,
      `color/${tokenName}`,
      "COLOR",
      rgb(hex),
      colorScopes[name],
      `var(--color-${tokenName})`
    );
  }
  await ensureVariable(
    couture,
    "color/sale-badge-bg",
    "COLOR",
    rgb(HEX.foreground),
    ["FRAME_FILL", "SHAPE_FILL"],
    "var(--color-sale-badge-bg)"
  );
  await ensureVariable(
    couture,
    "color/sale-badge-text",
    "COLOR",
    rgb(HEX.background),
    ["TEXT_FILL", "SHAPE_FILL"],
    "var(--color-sale-badge-text)"
  );

  const spacingValues = { none: 0, "3xs": 2, "2xs": 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64, "4xl": 96 };
  const spacing = {};
  for (const [name, value] of Object.entries(spacingValues)) {
    spacing[name] = await ensureVariable(global, `spacing/${name}`, "FLOAT", value, ["GAP"], `var(--space-${name})`);
  }
  await ensureVariable(global, "grid/container-max-width", "FLOAT", 1440, ["WIDTH_HEIGHT"], "var(--page-width)");
  await ensureVariable(global, "grid/gutter-mobile", "FLOAT", 16, ["GAP"], "var(--page-gutter-mobile)");
  await ensureVariable(global, "grid/gutter-desktop", "FLOAT", 32, ["GAP"], "var(--page-gutter-desktop)");
  await ensureVariable(global, "grid/tap-target-min", "FLOAT", 44, ["WIDTH_HEIGHT"], "var(--tap-target-min)");
  await ensureVariable(global, "shape/border-radius-card", "FLOAT", 0, ["CORNER_RADIUS"], "var(--radius-card)");
  await ensureVariable(global, "shape/border-radius-button", "FLOAT", 2, ["CORNER_RADIUS"], "var(--radius-button)");
  await ensureVariable(global, "shape/border-radius-input", "FLOAT", 0, ["CORNER_RADIUS"], "var(--radius-input)");
  await ensureVariable(global, "shape/border-width", "FLOAT", 1, ["STROKE_FLOAT"], "var(--border-width)");
  await ensureVariable(global, "typography/font-family-heading", "STRING", "Playfair Display", ["FONT_FAMILY"], "var(--font-heading-family)");
  await ensureVariable(global, "typography/font-family-body", "STRING", "Plus Jakarta Sans", ["FONT_FAMILY"], "var(--font-body-family)");
  return { colors, spacing };
}

async function ensureTextStyle(name, fontName, fontSize, lineHeight, letterSpacing = 0) {
  const styles = await figma.getLocalTextStylesAsync();
  let style = styles.find((entry) => entry.name === name);
  if (!style) style = figma.createTextStyle();
  style.name = name;
  style.fontName = fontName;
  style.fontSize = fontSize;
  style.lineHeight = { value: lineHeight, unit: "PIXELS" };
  style.letterSpacing = { value: letterSpacing, unit: "PERCENT" };
  style.description = "Atelier Flow Couture type style. Source: docs/design-tokens.json.";
  return style;
}

async function buildTextStyles() {
  await ensureTextStyle("Couture/Display", FONT.heading, 64, 72);
  await ensureTextStyle("Couture/Heading", FONT.heading, 48, 56);
  await ensureTextStyle("Couture/Subheading", FONT.heading, 28, 36);
  await ensureTextStyle("Couture/Body", FONT.body, 16, 26);
  await ensureTextStyle("Couture/Label", FONT.label, 14, 20);
  await ensureTextStyle("Couture/Eyebrow", FONT.label, 12, 16, 12);
  await ensureTextStyle("Couture/Micro", FONT.label, 12, 16, 12);
}

function createButtonVariant(type, state, vars) {
  const node = makeComponent(`Type=${type}, State=${state}`, "HORIZONTAL", 216, 52, 8, HEX.background, null, 2);
  node.primaryAxisAlignItems = "CENTER";
  node.counterAxisAlignItems = "CENTER";
  pad(node, 0, 24);
  const isDisabled = state === "Disabled";
  const isPrimary = type === "Primary";
  const isText = type === "Text";
  const fill = isDisabled ? HEX.subtle : isPrimary ? (state === "Hover" ? HEX.foreground : HEX.accent) : isText ? null : state === "Hover" ? HEX.surface : HEX.background;
  node.fills = fill ? [bindPaint(fill, isPrimary && !isDisabled && state !== "Hover" ? vars.colors.accent : null)] : [];
  node.strokes = !isPrimary && !isText && !isDisabled ? [bindPaint(HEX.foreground, vars.colors.foreground)] : [];
  node.strokeWeight = node.strokes.length ? 1 : 0;
  if (state === "Focus") {
    node.effects = [{ type: "DROP_SHADOW", color: { ...rgb(HEX.foreground), a: 1 }, offset: { x: 0, y: 0 }, radius: 0, spread: 2, visible: true, blendMode: "NORMAL" }];
  }
  if (state === "Loading") {
    const spinner = figma.createEllipse();
    spinner.name = "loading-indicator";
    spinner.resize(16, 16);
    spinner.fills = [];
    spinner.strokes = [solid(isPrimary ? HEX.white : HEX.muted)];
    spinner.strokeWeight = 2;
    append(node, spinner);
  }
  const label = makeText(state === "Loading" ? "Adding" : state === "Disabled" ? "Unavailable" : type === "Text" ? "Read the story" : type === "Secondary" ? "View details" : "Add to bag", 14, isPrimary && !isDisabled ? HEX.white : isDisabled ? HEX.muted : HEX.foreground, FONT.label);
  label.name = "label";
  append(node, label);
  return node;
}

function createProductCardVariant(state, swatch) {
  const node = makeComponent(`State=${state}, Swatch=${swatch}`, "VERTICAL", 280, 452, 10);
  const garment = swatch === "Ink" ? HEX.foreground : HEX.accent;
  append(node, makeMedia(280, 300, state === "Hover" ? HEX.subtle : HEX.surface, garment));
  append(node, makeText("ATELIER SERIES / 01", 12, HEX.muted, FONT.label));
  append(node, makeText("Draped Wool Coat", 22, HEX.foreground, FONT.heading));
  append(node, makeText("$280.00", 14, HEX.foreground, FONT.body));
  append(node, makeSwatches(swatch));
  if (state === "Hover") {
    const quick = makeFrame("quick-action", "HORIZONTAL", 280, 44, 0, HEX.background, HEX.foreground, 2);
    quick.primaryAxisAlignItems = "CENTER";
    quick.counterAxisAlignItems = "CENTER";
    append(quick, makeText("Choose options", 14, HEX.foreground, FONT.label));
    append(node, quick);
  }
  return node;
}

function createVariantChip(kind, state) {
  const width = kind === "Color" ? 112 : 64;
  const node = makeComponent(`Kind=${kind}, State=${state}`, "HORIZONTAL", width, 52, 8, state === "Selected" && kind === "Size" ? HEX.foreground : state === "Disabled" ? HEX.surface : HEX.background, state === "Selected" ? HEX.foreground : HEX.border);
  node.primaryAxisAlignItems = "CENTER";
  node.counterAxisAlignItems = "CENTER";
  pad(node, 0, 12);
  if (kind === "Color") {
    const swatch = figma.createEllipse();
    swatch.resize(16, 16);
    swatch.fills = [solid(state === "Selected" ? HEX.foreground : HEX.accent)];
    append(node, swatch);
  }
  append(node, makeText(kind === "Color" ? (state === "Disabled" ? "Ash" : state === "Selected" ? "Ink" : "Oat") : "M", 14, state === "Selected" && kind === "Size" ? HEX.background : state === "Disabled" ? HEX.muted : HEX.foreground, FONT.label));
  return node;
}

function createAccordionVariant(state) {
  const expanded = state === "Expanded";
  const node = makeComponent(`State=${state}`, "VERTICAL", 420, expanded ? 176 : 64, 0, HEX.background, state === "Focus" ? HEX.foreground : HEX.border);
  const header = makeFrame("trigger", "HORIZONTAL", 418, 62, 0);
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  pad(header, 0, 16);
  append(header, makeText("Materials & care", 14, HEX.foreground, FONT.label));
  append(header, makeText(expanded ? "-" : "+", 18, HEX.foreground));
  append(node, header);
  if (expanded) {
    const body = makeFrame("panel", "VERTICAL", 418, 112, 8, HEX.surface);
    pad(body, 16, 16);
    append(body, makeText("100% traceable wool.", 13, HEX.muted));
    append(body, makeText("Dry clean or brush between wears.", 13, HEX.muted));
    append(body, makeText("Store on a broad hanger.", 13, HEX.muted));
    append(node, body);
  }
  return node;
}

function createStickyVariant(state) {
  const node = makeComponent(`State=${state}`, "HORIZONTAL", 320, 96, 12, HEX.background, HEX.border);
  node.counterAxisAlignItems = "CENTER";
  pad(node, 12, 12);
  if (state === "Hidden") {
    node.opacity = 0.32;
    append(node, makeText("Hidden until buy box leaves viewport", 12, HEX.muted));
    return node;
  }
  append(node, makeMedia(56, 72, HEX.surface, HEX.foreground));
  const details = makeFrame("details", "VERTICAL", 124, 72, 6);
  append(details, makeText("Draped Coat", 14, HEX.foreground, FONT.label));
  append(details, makeText("S / Ink · $280", 12, HEX.muted));
  append(node, details);
  const action = makeFrame("action", "HORIZONTAL", 92, 52, 0, state === "Success" ? HEX.foreground : HEX.accent, null, 2);
  action.primaryAxisAlignItems = "CENTER";
  action.counterAxisAlignItems = "CENTER";
  append(action, makeText(state === "Loading" ? "Adding" : state === "Success" ? "Added" : "Add", 13, HEX.white, FONT.label));
  append(node, action);
  return node;
}

function createCartItemVariant(state) {
  const node = makeComponent(`State=${state}`, "HORIZONTAL", 432, state === "Error" ? 184 : 156, 16, HEX.background, state === "Error" ? HEX.foreground : HEX.border);
  pad(node, 16, 16);
  append(node, makeMedia(92, 116, HEX.surface, HEX.foreground));
  const details = makeFrame("details", "VERTICAL", 290, state === "Error" ? 152 : 124, 8);
  append(details, makeText("Column Trousers", 18, HEX.foreground, FONT.heading));
  append(details, makeText(state === "Updating" ? "Updating quantity..." : "Ink / Small · $170", 12, HEX.muted));
  append(details, makeStepper());
  if (state === "Error") append(details, makeText("Only one piece remains. Quantity restored.", 12, HEX.foreground));
  append(node, details);
  return node;
}

function createDrawerVariant(state) {
  const node = makeComponent(`State=${state}`, "HORIZONTAL", 440, 320, 0, HEX.surface);
  const backdrop = makeFrame("backdrop", "VERTICAL", 190, 320, 0, HEX.foreground);
  backdrop.opacity = 0.48;
  backdrop.effects = [{ type: "BACKGROUND_BLUR", radius: 12, visible: true }];
  append(node, backdrop);
  const panel = makeFrame("panel", "VERTICAL", 250, 320, 12, HEX.background);
  pad(panel, 16, 16);
  append(panel, makeText(state === "Empty" ? "Your Selection (0)" : "Your Selection", 20, HEX.foreground, FONT.heading));
  if (state === "Open") {
    append(panel, makeText("Column Trousers · $170", 13, HEX.foreground));
    append(panel, makeText("Complimentary additions", 12, HEX.muted, FONT.label));
  } else if (state === "Empty") {
    append(panel, makeText("Your bag is quiet.", 16, HEX.foreground, FONT.heading));
  } else {
    append(panel, makeText("We could not update this item. Try again.", 13, HEX.foreground));
  }
  const action = makeFrame("action", "HORIZONTAL", 218, 52, 0, HEX.accent, null, 2);
  action.primaryAxisAlignItems = "CENTER";
  action.counterAxisAlignItems = "CENTER";
  append(action, makeText(state === "Empty" ? "Explore" : state === "Error" ? "Retry" : "Checkout", 14, HEX.white, FONT.label));
  append(panel, action);
  append(node, panel);
  return node;
}

function createHotspotVariant(state) {
  const node = makeComponent(`State=${state}`, "HORIZONTAL", 44, 44, 0);
  node.primaryAxisAlignItems = "CENTER";
  node.counterAxisAlignItems = "CENTER";
  const dot = figma.createEllipse();
  dot.resize(state === "Hover" ? 26 : state === "Active" ? 42 : 18, state === "Hover" ? 26 : state === "Active" ? 42 : 18);
  dot.fills = [solid(state === "Active" ? HEX.foreground : state === "Hover" ? HEX.accent : HEX.background)];
  dot.strokes = [solid(HEX.foreground)];
  dot.strokeWeight = state === "Focus" ? 2 : 1;
  append(node, dot);
  return node;
}

function createPredictiveVariant(type, state) {
  const node = makeComponent(`Type=${type}, State=${state}`, "HORIZONTAL", 420, type === "Suggestion" ? 80 : 104, 16, state === "Active" ? HEX.surface : HEX.background, state === "Active" ? HEX.foreground : HEX.border);
  node.counterAxisAlignItems = "CENTER";
  pad(node, 12, 12);
  append(node, makeMedia(type === "Suggestion" ? 44 : 64, type === "Suggestion" ? 44 : 80, HEX.surface, HEX.accent));
  const copy = makeFrame("copy", "VERTICAL", 310, type === "Suggestion" ? 44 : 80, 6);
  append(copy, makeText(type.toUpperCase(), 12, HEX.muted, FONT.label));
  append(copy, makeText(type === "Product" ? "Draped Wool Coat" : type === "Article" ? "On wool and memory" : "Search for wool coats", type === "Suggestion" ? 14 : 18, HEX.foreground, type === "Suggestion" ? FONT.body : FONT.heading));
  if (type !== "Suggestion") append(copy, makeText(type === "Product" ? "Ink / S · $280.00" : "6 min read", 12, HEX.muted));
  append(node, copy);
  return node;
}

function createFormInputVariant(state) {
  const node = makeComponent(`State=${state}`, "VERTICAL", 320, 124, 8);
  append(node, makeText("Email address", 14, state === "Disabled" ? HEX.muted : HEX.foreground, FONT.label));
  const field = makeFrame("field", "HORIZONTAL", 320, 52, 0, state === "Disabled" ? HEX.surface : HEX.background, state === "Focus" || state === "Error" ? HEX.foreground : HEX.border);
  field.strokeWeight = state === "Focus" || state === "Error" ? 2 : 1;
  field.counterAxisAlignItems = "CENTER";
  pad(field, 0, 16);
  append(field, makeText(state === "Focus" ? "johan@example.com" : state === "Error" ? "johan@" : "name@example.com", 14, state === "Disabled" ? HEX.muted : HEX.foreground));
  append(node, field);
  append(node, makeText(state === "Error" ? "Enter a complete email address." : state === "Disabled" ? "Unavailable while submitting." : "Used only for order updates.", 12, state === "Error" ? HEX.foreground : HEX.muted));
  return node;
}

function arrangeAndCombine(page, name, components, columns, x, y, description) {
  const gapX = 24;
  const gapY = 24;
  let cursorY = 0;
  let rowHeight = 0;
  components.forEach((component, index) => {
    const column = index % columns;
    if (column === 0 && index > 0) {
      cursorY += rowHeight + gapY;
      rowHeight = 0;
    }
    component.x = column * (component.width + gapX);
    component.y = cursorY;
    rowHeight = Math.max(rowHeight, component.height);
  });
  const set = figma.combineAsVariants(components, page);
  set.name = name;
  set.description = description;
  set.x = x;
  set.y = y;
  set.setPluginData(GENERATED_KEY, "1");
  return set;
}

function addSetLabel(page, name, detail, x, y) {
  const frame = makeFrame(`${name} / Documentation`, "VERTICAL", 340, 128, 10, HEX.surface);
  pad(frame, 20, 20);
  append(frame, makeText(name, 28, HEX.foreground, FONT.heading));
  append(frame, makeText(detail, 12, HEX.muted));
  frame.x = x;
  frame.y = y;
  frame.setPluginData(GENERATED_KEY, "1");
  page.appendChild(frame);
  return frame;
}

function buildSet(page, name, detail, variants, factory, columns, y, vars) {
  const existing = page.findOne((node) => node.type === "COMPONENT_SET" && node.name === name);
  if (existing) return { set: existing, created: false };
  addSetLabel(page, name, detail, 32, y);
  const components = variants.map((variant) => factory(...variant, vars));
  const set = arrangeAndCombine(page, name, components, columns, 420, y, detail);
  return { set, created: true };
}

function buildFoundationsBoard(page) {
  const existing = page.findOne((node) => node.name === "Foundations / Overview");
  if (existing) return existing;
  const board = makeFrame("Foundations / Overview", "VERTICAL", 1344, 420, 24, HEX.background);
  pad(board, 32, 32);
  append(board, makeText("Atelier Flow / Foundations", 48, HEX.foreground, FONT.heading));
  append(board, makeText("Couture · official W3C tokens · one-mode collections compatible with Figma Starter", 14, HEX.muted));
  const row = makeFrame("color-swatches", "HORIZONTAL", 1280, 140, 16);
  Object.entries(HEX).forEach(([name, hex]) => {
    const tokenName = COLOR_TOKEN_NAMES[name];
    const swatch = makeFrame(`color/${tokenName}`, "VERTICAL", 112, 120, 8, hex, name === "background" || name === "white" ? HEX.border : null);
    pad(swatch, 12, 12);
    const darkText = ["background", "surface", "subtle", "border", "hairline", "white"].includes(name);
    append(swatch, makeText(tokenName, 12, darkText ? HEX.foreground : HEX.white, FONT.label));
    append(swatch, makeText(hex, 12, darkText ? HEX.muted : HEX.white));
    append(row, swatch);
  });
  append(board, row);
  append(board, makeText("Type: Display 64/72 · Heading 48/56 · Subheading 28/36 · Body 16/26 · Label 14/20 · Eyebrow 12/16 · Micro 12/16", 13, HEX.foreground));
  append(board, makeText("Spacing: 0 · 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96    Target: 44    Button: 52", 13, HEX.muted));
  board.x = 32;
  board.y = 32;
  board.setPluginData(GENERATED_KEY, "1");
  page.appendChild(board);
  return board;
}

async function main() {
  if (figma.editorType !== "figma") throw new Error("Run this builder in a Figma Design file.");
  await Promise.all([
    figma.loadFontAsync(FONT.heading),
    figma.loadFontAsync(FONT.body),
    figma.loadFontAsync(FONT.label)
  ]);
  const pages = await ensurePages();
  const vars = await buildVariables();
  await buildTextStyles();
  await figma.setCurrentPageAsync(pages.foundations);
  buildFoundationsBoard(pages.foundations);

  const rows = [
    ["Button", "Type Primary/Secondary/Text x Default/Hover/Focus/Loading/Disabled", [["Primary", "Default"], ["Primary", "Hover"], ["Primary", "Focus"], ["Primary", "Loading"], ["Primary", "Disabled"], ["Secondary", "Default"], ["Secondary", "Hover"], ["Secondary", "Focus"], ["Secondary", "Loading"], ["Secondary", "Disabled"], ["Text", "Default"], ["Text", "Hover"], ["Text", "Focus"], ["Text", "Loading"], ["Text", "Disabled"]], createButtonVariant, 5],
    ["Product Card", "State Default/Hover x Swatch Oat/Ink; second image and swatch media", [["Default", "Oat"], ["Default", "Ink"], ["Hover", "Oat"], ["Hover", "Ink"]], createProductCardVariant, 4],
    ["Variant Chip", "Kind Size/Color x Default/Selected/Disabled", [["Size", "Default"], ["Size", "Selected"], ["Size", "Disabled"], ["Color", "Default"], ["Color", "Selected"], ["Color", "Disabled"]], createVariantChip, 6],
    ["Accordion", "Collapsed, Expanded and Focus", [["Collapsed"], ["Expanded"], ["Focus"]], createAccordionVariant, 3],
    ["Sticky Cart Bar", "Hidden, Visible, Loading and Success", [["Hidden"], ["Visible"], ["Loading"], ["Success"]], createStickyVariant, 4],
    ["Cart Item", "Default, Updating and Error with 44px stepper controls", [["Default"], ["Updating"], ["Error"]], createCartItemVariant, 3],
    ["Drawer Shell", "Open, Empty and Error; background blur and internal scroll contract", [["Open"], ["Empty"], ["Error"]], createDrawerVariant, 3],
    ["Hotspot", "Idle, Hover, Focus and Active on a fixed 44px target", [["Idle"], ["Hover"], ["Focus"], ["Active"]], createHotspotVariant, 4],
    ["Predictive Result Card", "Product, Article, Suggestion x Default/Active", [["Product", "Default"], ["Product", "Active"], ["Article", "Default"], ["Article", "Active"], ["Suggestion", "Default"], ["Suggestion", "Active"]], createPredictiveVariant, 3],
    ["Form Input", "Default, Focus, Error and Disabled", [["Default"], ["Focus"], ["Error"], ["Disabled"]], createFormInputVariant, 4]
  ];

  let y = 520;
  const created = [];
  for (const [name, detail, variants, factory, columns] of rows) {
    const result = buildSet(pages.foundations, name, detail, variants, factory, columns, y, vars);
    created.push({ name, id: result.set.id, created: result.created, variants: result.set.children.length });
    y += Math.max(360, result.set.height + 96);
  }
  figma.currentPage.selection = created.map((item) => figma.getNodeById(item.id)).filter(Boolean);
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
  figma.closePlugin(`Atelier Flow system ready: ${created.filter((item) => item.created).length} component sets created.`);
}

main().catch((error) => {
  figma.closePlugin(`Atelier Flow builder failed: ${error.message}`);
});
