// src/index.ts
import Katex from "katex";
import { htmlEscape } from "@renovamen/utils";
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
      return displayMode ? `<p>${Katex.renderToString(tex, options2)}</p>
` : Katex.renderToString(tex, options2);
    } catch (error) {
      if (options2.throwOnError) console.warn(error);
      const errorMsg = htmlEscape(error.toString());
      const escapedTex = htmlEscape(tex);
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
export {
  MarkdownItKatex,
  src_default as default
};
