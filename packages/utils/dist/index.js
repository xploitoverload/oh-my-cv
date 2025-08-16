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
  arrayify: () => arrayify,
  copy: () => copy,
  delay: () => delay,
  downloadFile: () => downloadFile,
  fetchFile: () => fetchFile,
  htmlEscape: () => htmlEscape,
  isClient: () => isClient,
  isExternal: () => isExternal,
  isInteger: () => isInteger,
  isMac: () => isMac,
  isObject: () => isObject,
  now: () => now,
  readFile: () => readFile,
  slugify: () => slugify,
  useFileDialog: () => useFileDialog
});
module.exports = __toCommonJS(src_exports);

// src/file.ts
var fetchFile = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request error: ${res.status} ${res.statusText}`);
    }
    return await res.text();
  } catch (error) {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
};
var useFileDialog = (accept) => {
  let callback = null;
  let input;
  if (document) {
    input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    if (accept) input.accept = accept;
    input.onchange = (event) => {
      const target = event.target;
      const file = target.files?.[0];
      if (file && callback) callback(file);
    };
  }
  const open = () => {
    if (!input) return;
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };
  const onChange = (cb) => {
    callback = cb;
  };
  return {
    open,
    onChange
  };
};
var readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
var downloadFile = (filename, content) => {
  const element = document.createElement("a");
  element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  element.download = filename;
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// src/is.ts
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
var isMac = isClient && typeof navigator !== "undefined" && /Macintosh/.test(navigator.userAgent);
var isExternal = (path) => {
  const outboundRE = /^(https?:|mailto:|tel:)/;
  return outboundRE.test(path);
};
var isObject = (v) => toString.call(v) === "[object Object]";
var isInteger = (v, { allowString = false } = {}) => {
  return typeof v === "number" ? Number.isInteger(v) : allowString && typeof v === "string" && Number.isInteger(Number(v));
};

// src/common.ts
var slugify = (str) => encodeURI(
  str.trim().toLowerCase().replace(/\s+/g, "-").replace(
    /[\]\[\!\'\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g,
    ""
  ).replace(/^\-+/, "").replace(/\-+$/, "")
  // Remove trailing -
);
var htmlEscape = (str) => {
  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  };
  return str.replace(/[&<>'"]/g, (char) => escapeMap[char]);
};
var copy = (obj) => {
  if (isObject(obj)) return JSON.parse(JSON.stringify(obj));
  throw new Error("Input must be a non-null object.");
};
var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var now = () => Date.now();
var arrayify = (value) => Array.isArray(value) ? value : [value];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arrayify,
  copy,
  delay,
  downloadFile,
  fetchFile,
  htmlEscape,
  isClient,
  isExternal,
  isInteger,
  isMac,
  isObject,
  now,
  readFile,
  slugify,
  useFileDialog
});
