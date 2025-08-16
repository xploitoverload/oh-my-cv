// src/index.ts
var sheetsMap = /* @__PURE__ */ new Map();
var injectCss = (id, content) => {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-dynamic-css-id", id);
    style.textContent = content;
    document.head.appendChild(style);
  } else {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
};
var removeCss = (id) => {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
};
export {
  injectCss,
  removeCss
};
