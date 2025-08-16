// src/utils/stylesheets.ts
var _stylesheetId = (fontId) => `font-${fontId}`;
var hasStylesheet = (fontId) => document.getElementById(_stylesheetId(fontId)) !== null;
var createStylesheet = (fontId, styles) => {
  const stylesheet = document.createElement("style");
  stylesheet.id = _stylesheetId(fontId);
  stylesheet.textContent = styles;
  document.head.appendChild(stylesheet);
};

// src/utils/fonts.ts
var GOOGLE_FONTS_API = "https://www.googleapis.com/webfonts/v1/webfonts";
var GOOGLE_FONTS_CSS = "https://fonts.googleapis.com/css";
var get = (url) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open("GET", url, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status !== 200) {
        reject(new Error(`Response has status code ${request.status}`));
      } else {
        resolve(request.responseText);
      }
    }
  };
  request.send();
});
var getFontStylesheet = async (fonts, subsets, variants) => {
  const url = new URL(GOOGLE_FONTS_CSS);
  const variantsStr = variants.join(",");
  const familiesStr = fonts.map((font) => `${font.family}:${variantsStr}`);
  url.searchParams.append("family", familiesStr.join("|"));
  url.searchParams.append("subset", subsets.join(","));
  url.searchParams.append("font-display", "swap");
  return get(url.href);
};
var getFontId = (fontFamily) => fontFamily.replace(/\s+/g, "-").toLowerCase();
var fetchFontList = async (apiKey) => {
  const url = new URL(GOOGLE_FONTS_API);
  url.searchParams.append("sort", "popularity");
  url.searchParams.append("key", apiKey);
  const response = await get(url.href);
  const fonts = JSON.parse(response).items;
  return fonts.map((font) => ({
    ...font,
    id: getFontId(font.family)
  }));
};
var loadFontStylesheet = async (font, subsets, variants) => {
  if (!hasStylesheet(font.id)) {
    const fontStyle = await getFontStylesheet([font], subsets, variants);
    createStylesheet(font.id, fontStyle);
  }
};

// src/index.ts
var GoogleFontsLoader = class {
  apiKey;
  options;
  activeFontFamily;
  // Name of currently applied font
  onChange;
  fontMap = /* @__PURE__ */ new Map();
  // Map from font families to font objects
  constructor(apiKey, {
    families = [],
    categories = [],
    subsets = ["latin"],
    variants = ["regular"],
    filter = () => true,
    limit = -1,
    sort = "alphabet"
  } = {}, onChange = () => {
  }) {
    this.apiKey = apiKey;
    this.options = {
      families,
      categories,
      subsets,
      variants,
      filter,
      limit,
      sort
    };
    this.onChange = onChange;
    this.activeFontFamily = "";
  }
  async init() {
    const fonts = await fetchFontList(this.apiKey);
    const isFontIncluded = (font) => (
      // Only keep fonts whose names are included in the provided array
      (this.options.families.length === 0 || this.options.families.includes(font.family)) && // Only keep fonts in categories from the provided array
      (this.options.categories.length === 0 || this.options.categories.includes(font.category)) && // Only keep fonts which are available in all specified subsets
      this.options.subsets.every((subset) => font.subsets.includes(subset)) && // Only keep fonts which contain all specified variants
      this.options.variants.every((variant) => font.variants.includes(variant)) && // Only keep fonts for which the `filter` function evaluates to `true`
      this.options.filter(font) === true
    );
    for (const font of fonts) {
      if (this.options.limit >= 0 && this.fontMap.size >= this.options.limit) break;
      if (isFontIncluded(font)) this.fontMap.set(font.family, font);
    }
    if (this.options.sort === "alphabet") {
      this.fontMap = new Map(
        [...this.fontMap.entries()].sort(
          ([family1], [family2]) => family1.localeCompare(family2)
        )
      );
    }
    return this.fontMap;
  }
  getFontMap() {
    return this.fontMap;
  }
  getActiveFont() {
    const activeFont = this.fontMap.get(this.activeFontFamily);
    if (!activeFont) {
      throw Error(
        `Cannot get active font: "${this.activeFontFamily}" is not in the font list`
      );
    } else {
      return activeFont;
    }
  }
  /**
   * Set the specified font as the active font and download it
   */
  async setActiveFont(fontFamily) {
    const activeFont = this.fontMap.get(fontFamily);
    if (!activeFont) {
      throw Error(`Cannot update active font: "${fontFamily}" is not in the font list`);
    }
    this.activeFontFamily = fontFamily;
    await loadFontStylesheet(activeFont, this.options.subsets, this.options.variants);
    this.onChange(activeFont);
  }
  setOnChange(onChange) {
    this.onChange = onChange;
  }
};
var src_default = GoogleFontsLoader;
export {
  GoogleFontsLoader,
  src_default as default
};
