"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  useSmartPages: () => useSmartPages
});
module.exports = __toCommonJS(src_exports);

// src/useSmartPages.ts
var import_vue = require("vue");
var import_core = require("@vueuse/core");

// src/dom.ts
var NEW_PAGE_CLASS = "md-it-newpage";
var _elementHeight = (element) => {
  const style = window.getComputedStyle(element);
  const marginTop = parseInt(style.marginTop) || 0;
  const marginBottom = parseInt(style.marginBottom) || 0;
  return element.clientHeight + marginTop + marginBottom;
};
var _createPage = (size, margins) => {
  const page = document.createElement("div");
  page.dataset.scope = "vue-smart-pages";
  page.dataset.part = "page";
  page.style.height = `${size.height}px`;
  setWidthAndMargins(page, size, margins);
  return page;
};
var setWidthAndMargins = (element, size, margins) => {
  element.style.width = `${size.width}mm`;
  element.style.padding = `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`;
};
var breakPage = (target, size, margins) => {
  const maxHeight = size.height - margins.top - margins.bottom;
  const pages = document.createElement("div");
  let accHeight = 0;
  let page = _createPage(size, margins);
  Array.from(target.children).forEach((child) => {
    const childHeight = _elementHeight(child);
    if (accHeight + childHeight > maxHeight || child.className === NEW_PAGE_CLASS) {
      pages.appendChild(page);
      accHeight = 0;
      page = _createPage(size, margins);
    }
    page.appendChild(child);
    accHeight += childHeight;
  });
  pages.appendChild(page);
  target.innerHTML = pages.innerHTML;
};

// src/useSmartPages.ts
var useSmartPages = (target, html, size, margins = {}, options = {}) => {
  const render = async () => {
    const element = (0, import_core.unrefElement)(target);
    if (!element) return;
    const { width, height } = (0, import_core.toValue)(size);
    const { top = 0, bottom = 0, left = 0, right = 0 } = (0, import_core.toValue)(margins);
    const _size = { width, height };
    const _margins = { top, bottom, left, right };
    const copy = element.cloneNode(true);
    copy.innerHTML = (0, import_core.toValue)(html);
    setWidthAndMargins(copy, _size, _margins);
    document.body.appendChild(copy);
    if (options.beforeRender) await options.beforeRender();
    breakPage(copy, _size, _margins);
    element.innerHTML = copy.innerHTML;
    document.body.removeChild(copy);
    if (options.afterRender) await options.afterRender();
  };
  (0, import_vue.onMounted)(render);
  (0, import_core.watchThrottled)([size, margins, html], render, options.watchThrottledOptions);
  return { render };
};

// src/index.ts
var src_default = useSmartPages;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSmartPages
});
