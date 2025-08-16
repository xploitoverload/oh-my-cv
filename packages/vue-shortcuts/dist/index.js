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
  useShortcuts: () => useShortcuts
});
module.exports = __toCommonJS(src_exports);
var import_vue = require("vue");
var import_core = require("@vueuse/core");
var import_utils = require("@renovamen/utils");
var useShortcuts = (keys, cb) => {
  const adjustedKeys = keys.replace("ctrl", import_utils.isMac ? "meta" : "ctrl").split("+");
  const magic = (0, import_core.useMagicKeys)({
    passive: false,
    onEventFired: (e) => {
      if (e.type !== "keydown") return;
      const isKeyActive = (key) => {
        switch (key) {
          case "ctrl":
            return e.ctrlKey;
          case "meta":
            return e.metaKey;
          case "shift":
            return e.shiftKey;
          default:
            return e.key === key;
        }
      };
      if (adjustedKeys.every(isKeyActive)) e.preventDefault();
    }
  });
  const shortcuts = magic[adjustedKeys.join("+")];
  const { current } = magic;
  (0, import_vue.watch)(shortcuts, (v) => {
    if (v && current.size === adjustedKeys.length) cb();
  });
};
var src_default = useShortcuts;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useShortcuts
});
