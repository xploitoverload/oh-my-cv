// src/index.ts
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
export {
  MarkdownItLatexCmds,
  src_default as default
};
