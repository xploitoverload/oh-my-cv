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
  MarkdownItKatex: () => MarkdownItKatex,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_katex = __toESM(require("katex"));
var import_utils = require("@renovamen/utils");
var isValidDelim = (state, pos) => {
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  const nextChar = pos + 1 <= state.posMax ? state.src.charCodeAt(pos + 1) : -1;
  const isWhitespace = (char) => char === 32 || char === 9;
  const isDigit = (char) => char >= 48 && char <= 57;
  const canOpen = !isWhitespace(nextChar);
  const canClose = !isWhitespace(prevChar) && !isDigit(nextChar);
  return { canOpen, canClose };
};
var mathInline = (state, silent) => {
  if (state.src[state.pos] !== "$") return false;
  const res = isValidDelim(state, state.pos);
  if (!res.canOpen) {
    if (!silent) state.pending += "$";
    state.pos += 1;
    return true;
  }
  const start = state.pos + 1;
  let match = start;
  while ((match = state.src.indexOf("$", match)) !== -1) {
    let pos = match - 1;
    while (state.src[pos] === "\\") pos -= 1;
    if ((match - pos) % 2 === 1) break;
    match += 1;
  }
  if (match === -1) {
    if (!silent) state.pending += "$";
    state.pos = start;
    return true;
  }
  if (match - start === 0) {
    if (!silent) state.pending += "$$";
    state.pos = start + 1;
    return true;
  }
  const closeDelim = isValidDelim(state, match);
  if (!closeDelim.canClose) {
    if (!silent) state.pending += "$";
    state.pos = start;
    return true;
  }
  if (!silent) {
    const token = state.push("mathInline", "math", 0);
    token.markup = "$";
    token.content = state.src.slice(start, match);
  }
  state.pos = match + 1;
  return true;
};
var mathBlock = (state, start, end, silent) => {
  let pos = state.bMarks[start] + state.tShift[start];
  const max = state.eMarks[start];
  if (pos + 2 > max || state.src.slice(pos, pos + 2) !== "$$") return false;
  pos += 2;
  let firstLine = state.src.slice(pos, max);
  if (silent) return true;
  let found = firstLine.trim().endsWith("$$");
  if (found) firstLine = firstLine.trim().slice(0, -2);
  let next = start;
  let lastLine = "";
  while (!found) {
    next += 1;
    if (next >= end) break;
    pos = state.bMarks[next] + state.tShift[next];
    const lineMax = state.eMarks[next];
    if (pos < lineMax && state.tShift[next] < state.blkIndent) break;
    const trimmedLine = state.src.slice(pos, lineMax).trim();
    if (trimmedLine.endsWith("$$")) {
      lastLine = trimmedLine.slice(0, -2);
      found = true;
    }
  }
  state.line = next + 1;
  const token = state.push("mathBlock", "math", 0);
  token.block = true;
  token.content = (firstLine.trim() ? `${firstLine}
` : "") + state.getLines(start + 1, next, state.tShift[start], true) + (lastLine.trim() ? lastLine : "");
  token.map = [start, state.line];
  token.markup = "$$";
  return true;
};
var MarkdownItKatex = (md, options = { throwOnError: false }) => {
  const renderKatex = (tex, options2, displayMode) => {
    options2.displayMode = displayMode;
    try {
      return displayMode ? `<p>${import_katex.default.renderToString(tex, options2)}</p>
` : import_katex.default.renderToString(tex, options2);
    } catch (error) {
      if (options2.throwOnError) console.warn(error);
      const errorMsg = (0, import_utils.htmlEscape)(error.toString());
      const escapedTex = (0, import_utils.htmlEscape)(tex);
      return displayMode ? `<p class='katex-error' title='${errorMsg}'>${escapedTex}</p>
` : `<span title='${errorMsg}'>${escapedTex}</span>`;
    }
  };
  md.inline.ruler.after("escape", "mathInline", mathInline);
  md.block.ruler.after("blockquote", "mathBlock", mathBlock, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
  md.renderer.rules.mathInline = (tokens, idx) => renderKatex(tokens[idx].content, options, false);
  md.renderer.rules.mathBlock = (tokens, idx) => renderKatex(tokens[idx].content, options, true);
};
var src_default = MarkdownItKatex;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MarkdownItKatex
});
