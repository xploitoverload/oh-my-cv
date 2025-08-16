// src/utils.ts
import abbreviates from "case-police/dict/abbreviates.json" assert { type: "json" };
import brands from "case-police/dict/brands.json" assert { type: "json" };
import general from "case-police/dict/general.json" assert { type: "json" };
import products from "case-police/dict/products.json" assert { type: "json" };
import softwares from "case-police/dict/softwares.json" assert { type: "json" };
var DISABLE_KEY = "@case-police-disable";
var IGNORE_REGEX = /@case-police-ignore\s+([^\s]+)/g;
var UTF8_RANGE = "[\x80-\uFFFF]";
var AVALIABLE_PRESETS = {
  softwares,
  products,
  general,
  brands,
  abbreviates
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
export {
  src_default as default,
  replace
};
