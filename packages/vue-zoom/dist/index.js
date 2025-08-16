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
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_vue = require("vue");
var import_core = require("@vueuse/core");
var src_default = (0, import_vue.defineComponent)({
  name: "Zoom",
  props: {
    scale: {
      type: Number,
      required: true
    }
  },
  setup(props, { slots }) {
    const container = (0, import_vue.ref)();
    const zoom = (0, import_vue.ref)();
    const sizeC = (0, import_core.useElementSize)(container);
    const sizeZ = (0, import_core.useElementSize)(zoom);
    const left = (0, import_vue.computed)(
      () => Math.max(0, (sizeC.width.value - props.scale * sizeZ.width.value) / 2)
    );
    return () => (0, import_vue.h)(
      "div",
      {
        class: "vue-zoom-container",
        ref: container,
        style: {
          height: "100%"
        }
      },
      [
        (0, import_vue.h)(
          "div",
          {
            class: "vue-zoom",
            ref: zoom,
            style: {
              width: "fit-content",
              transformOrigin: "top left",
              transform: `scale(${props.scale})`,
              marginLeft: `${left.value}px`
            }
          },
          [slots.default()]
        )
      ]
    );
  }
});
