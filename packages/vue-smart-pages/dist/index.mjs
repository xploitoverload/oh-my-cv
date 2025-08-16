// src/useSmartPages.ts
import { onMounted } from "vue";
import {
  unrefElement,
  toValue,
  watchThrottled
} from "@vueuse/core";

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
    const element = unrefElement(target);
    if (!element) return;
    const { width, height } = toValue(size);
    const { top = 0, bottom = 0, left = 0, right = 0 } = toValue(margins);
    const _size = { width, height };
    const _margins = { top, bottom, left, right };
    const copy = element.cloneNode(true);
    copy.innerHTML = toValue(html);
    setWidthAndMargins(copy, _size, _margins);
    document.body.appendChild(copy);
    if (options.beforeRender) await options.beforeRender();
    breakPage(copy, _size, _margins);
    element.innerHTML = copy.innerHTML;
    document.body.removeChild(copy);
    if (options.afterRender) await options.afterRender();
  };
  onMounted(render);
  watchThrottled([size, margins, html], render, options.watchThrottledOptions);
  return { render };
};

// src/index.ts
var src_default = useSmartPages;
export {
  src_default as default,
  useSmartPages
};
