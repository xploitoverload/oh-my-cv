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
  MarkdownItCrossRef: () => MarkdownItCrossRef,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var _anchorId = (tokens, idx) => Number(tokens[idx].meta.id + 1).toString();
var _anchorLabel = (tokens, idx) => tokens[idx].meta.label;
var _isOpen = (state, start) => {
  return state.src.charCodeAt(start) === 91 && state.src.charCodeAt(start + 1) === 126;
};
var _isClose = (state, pos) => {
  return state.src.charCodeAt(pos) === 93;
};
var _extractLabel = (state, start, end) => {
  return state.src.slice(start, end);
};
var render = (type) => (tokens, idx) => {
  const id = `cross-ref-${_anchorId(tokens, idx)}`;
  const label = _anchorLabel(tokens, idx);
  return type === "ref" ? `<sup data-scope="cross-ref" data-part="reference"><a data-scope="cross-ref" data-part="link" href="#${id}" id="${id}">${label}</a></sup>` : `<ul data-scope="cross-ref" data-part="definitions"><li id="${id}" data-scope="cross-ref" data-part="definition" data-label="${label}">`;
};
var _processDefToken = (state, startLine, endLine, pos, label) => {
  state.env.crossRef ??= {};
  state.env.crossRef.labelToId ??= {};
  state.env.crossRef.labelToId[label] = -1;
  const openToken = new state.Token("renderDefOpen", "", 1);
  openToken.meta = { label };
  openToken.level = state.level++;
  state.tokens.push(openToken);
  const bMarks = state.bMarks[startLine];
  const tShift = state.tShift[startLine];
  const sCount = state.sCount[startLine];
  const posAfterColon = pos;
  const initial = sCount + pos - (bMarks + tShift);
  let offset = initial;
  while (pos < state.eMarks[startLine]) {
    const ch = state.src.charCodeAt(pos);
    if (state.md.utils.isSpace(ch)) {
      offset += ch === 9 ? 4 - offset % 4 : 1;
    } else {
      break;
    }
    pos++;
  }
  state.tShift[startLine] = pos - posAfterColon;
  state.sCount[startLine] = offset - initial;
  state.bMarks[startLine] = posAfterColon;
  state.blkIndent += 4;
  if (state.sCount[startLine] < state.blkIndent)
    state.sCount[startLine] += state.blkIndent;
  state.md.block.tokenize(state, startLine, endLine);
  state.blkIndent -= 4;
  state.tShift[startLine] = tShift;
  state.sCount[startLine] = sCount;
  state.bMarks[startLine] = bMarks;
  const closeToken = new state.Token("renderDefClose", "", -1);
  closeToken.level = --state.level;
  state.tokens.push(closeToken);
};
var processDef = (state, startLine, endLine, silent) => {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  if (start + 4 > max || !_isOpen(state, start)) return false;
  let pos = start + 2;
  while (pos < max && !_isClose(state, pos)) pos++;
  if (pos === start + 2) return false;
  if (pos + 1 >= max || state.src.charCodeAt(pos + 1) !== 58) return false;
  if (silent) return true;
  const label = _extractLabel(state, start + 2, pos);
  _processDefToken(state, startLine, endLine, pos + 2, label);
  return true;
};
var processRef = (state, silent) => {
  if (!state.env.crossRef?.labelToId) return false;
  if (state.pos + 3 > state.posMax || !_isOpen(state, state.pos)) return false;
  let pos = state.pos + 2;
  while (pos < state.posMax && !_isClose(state, pos)) pos++;
  if (pos === state.pos + 2 || pos >= state.posMax) return false;
  const label = _extractLabel(state, state.pos + 2, pos);
  if (state.env.crossRef.labelToId[label] === void 0) return false;
  if (!silent) {
    state.env.crossRef.list ??= [];
    const id = state.env.crossRef.labelToId[label] === -1 ? state.env.crossRef.list.push(label) - 1 : state.env.crossRef.labelToId[label];
    state.env.crossRef.labelToId[label] = id;
    const token = state.push("renderRef", "", 0);
    token.meta = { id, label };
  }
  state.pos = pos + 1;
  return true;
};
var postProcessDef = (state) => {
  for (const token of state.tokens) {
    if (token.type === "renderDefOpen") {
      token.meta = {
        ...token.meta,
        id: state.env.crossRef?.labelToId?.[token.meta.label] ?? -1
      };
    }
  }
};
var MarkdownItCrossRef = (md) => {
  md.renderer.rules.renderRef = render("ref");
  md.renderer.rules.renderDefOpen = render("defOpen");
  md.renderer.rules.renderDefClose = () => "</li>\n</ul>\n";
  md.block.ruler.before("reference", "processDef", processDef, {
    alt: ["paragraph", "reference"]
  });
  md.inline.ruler.after("image", "processRef", processRef);
  md.core.ruler.after("inline", "postProcessDef", postProcessDef);
};
var src_default = MarkdownItCrossRef;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MarkdownItCrossRef
});
