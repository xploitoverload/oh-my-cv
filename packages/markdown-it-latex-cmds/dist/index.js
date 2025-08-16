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
  MarkdownItLatexCmds: () => MarkdownItLatexCmds,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
var renderNewPage = () => `<div class="md-it-newpage"></div>`;
var renderLineBreak = (tokens, idx) => `<div class="md-it-line-break" style="margin-top:${tokens[idx].meta.h};"></div>`;
var checkPattern = (state, start, pattern, options = {}) => {
  const { minLength = pattern.length, silent = false } = options;
  const pos = state.bMarks[start] + state.tShift[start];
  const max = state.eMarks[start];
  if (silent) return false;
  if (pos + minLength > max) return false;
  if (state.src.slice(pos, pos + pattern.length) !== pattern) return false;
  return {
    pos,
    max
  };
};
var newPage = (state, start, end, silent) => {
  if (!checkPattern(state, start, "\\newpage", { silent })) return false;
  state.line = start + 1;
  const token = state.push("renderNewPage", "", 0);
  token.block = true;
  token.map = [start, state.line];
  token.markup = "\\newpage";
  return true;
};
var lineBreak = (state, start, end, silent) => {
  const res = checkPattern(state, start, "\\\\[", {
    minLength: 5,
    // Should be at least "\\[x]"
    silent
  });
  if (!res) return false;
  const { pos, max } = res;
  let lastPos = pos + 4;
  while (lastPos < max && state.src[lastPos] !== "]") lastPos++;
  if (lastPos >= max) return false;
  const height = state.src.slice(pos + 3, lastPos);
  if (height.match(/(^|[^\\])(\\\\)*\s/)) return false;
  state.line = start + 1;
  const token = state.push("renderLineBreak", "", 0);
  token.meta = { h: height.replace(UNESCAPE_RE, "$1") };
  token.block = true;
  token.map = [start, state.line];
  token.markup = "\\[]";
  return true;
};
var MarkdownItLatexCmds = (md) => {
  md.renderer.rules.renderNewPage = renderNewPage;
  md.renderer.rules.renderLineBreak = renderLineBreak;
  md.block.ruler.after("blockquote", "newPage", newPage);
  md.block.ruler.after("newPage", "lineBreak", lineBreak);
};
var src_default = MarkdownItLatexCmds;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MarkdownItLatexCmds
});
