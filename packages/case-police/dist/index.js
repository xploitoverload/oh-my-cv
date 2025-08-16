"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  replace: () => replace
});
module.exports = __toCommonJS(src_exports);

// src/utils.ts
var import_abbreviates = __toESM(require("case-police/dict/abbreviates.json"));
var import_brands = __toESM(require("case-police/dict/brands.json"));
var import_general = __toESM(require("case-police/dict/general.json"));
var import_products = __toESM(require("case-police/dict/products.json"));
var import_softwares = __toESM(require("case-police/dict/softwares.json"));
var DISABLE_KEY = "@case-police-disable";
var IGNORE_REGEX = /@case-police-ignore\s+([^\s]+)/g;
var UTF8_RANGE = "[\x80-\uFFFF]";
var AVALIABLE_PRESETS = {
  softwares: import_softwares.default,
  products: import_products.default,
  general: import_general.default,
  brands: import_brands.default,
  abbreviates: import_abbreviates.default
};
function buildRegex(dictionary) {
  const keys = Object.keys(dictionary);
  const regex = new RegExp(`\\b(${keys.join("|").replace(/\+/g, "\\+")})\\b`, "gi");
  return regex;
}
function replaceCore(code, dict, ignore = [], output, regex) {
  regex = regex || buildRegex(dict);
  Array.from(code.matchAll(IGNORE_REGEX)).forEach((match) => {
    const [, key] = match;
    ignore.push(
      ...key.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean)
    );
  });
  const changed = [];
  code = code.replace(regex, (_, from, index) => {
    if (containsUTF8(code, from, index)) return _;
    if (!from.match(/[A-Z]/) || !from.match(/[a-z]/)) return _;
    const lower = from.toLowerCase();
    if (ignore.includes(lower)) return _;
    const to = dict[lower];
    if (!to || to === from) return _;
    changed.push({ from, to, index });
    output?.(code, index, from, to);
    return to;
  });
  if (changed.length) return { code, changed };
}
function containsUTF8(code, key, index) {
  const utf8Regex = new RegExp(`${UTF8_RANGE}`);
  const head = code.charAt(index - 1);
  const tail = code.charAt(index + key.length);
  return utf8Regex.test(head) || utf8Regex.test(tail);
}
function loadPresets(presets) {
  presets = presets ?? Object.keys(AVALIABLE_PRESETS);
  return presets.reduce(
    (dictionary, preset) => ({
      ...dictionary,
      ...AVALIABLE_PRESETS[preset]
    }),
    {}
  );
}

// src/index.ts
var replace = (code, options = {}) => {
  if (code.includes(DISABLE_KEY)) return;
  const ignore = (options.ignore || []).map((i) => i.trim().toLowerCase());
  const dict = {
    ...loadPresets(options.presets),
    ...options.dict
  };
  return replaceCore(code, dict, ignore);
};
var src_default = replace;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  replace
});
