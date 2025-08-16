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
  FrontMatterParser: () => FrontMatterParser,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/front-matter.ts
var yamlParser = __toESM(require("js-yaml"));
var OPTIONAL_BYTE_ORDER_MARK = "\\ufeff?";
var PLATFORM = typeof process !== "undefined" ? process.platform : "";
var PATTERN = "^(" + OPTIONAL_BYTE_ORDER_MARK + "(= yaml =|---)$([\\s\\S]*?)^(?:\\2|\\.\\.\\.)\\s*$" + (PLATFORM === "win32" ? "\\r?" : "") + "(?:\\n)?)";
var FrontMatterParser = class {
  options;
  _lastFrontMatter = {};
  constructor(options = {}) {
    this.options = options;
    this.options.errorBehavior = options.errorBehavior || "error";
  }
  _emptyResults = (body) => ({
    frontMatter: {},
    body,
    bodyBegin: 1
  });
  /**
   * Get the line number where the body begins.
   */
  _bodyBegin(match, content) {
    const offset = match.index + match[0].length;
    const lines = content.slice(0, offset).split("\n");
    return lines.length;
  }
  /**
   * Split the content into front matter and body.
   *
   * @param content Markdown content, including front matter and body.
   * @returns
   * - `false` if the content does not contain front matter
   * - `{ frontMatterString, body, bodyBegin }` if contains
   * @see {@link FrontMatterResults}
   */
  split(content) {
    const regex = new RegExp(PATTERN, "m");
    const match = regex.exec(content);
    if (!match) return false;
    const frontMatterString = match[match.length - 1].trim();
    const body = content.slice(match[0].length);
    const bodyBegin = this._bodyBegin(match, content);
    return {
      frontMatterString,
      body,
      bodyBegin
    };
  }
  _parse(content) {
    const split = this.split(content);
    if (!split) return this._emptyResults(content);
    try {
      const frontMatter = yamlParser.load(split.frontMatterString) || {};
      this._lastFrontMatter = frontMatter;
      return { ...split, frontMatter };
    } catch (e) {
      const frontMatter = this.options.errorBehavior === "error" ? (() => {
        throw e;
      })() : this.options.errorBehavior === "last" ? this._lastFrontMatter : {};
      return { ...split, frontMatter };
    }
  }
  /**
   * Extract and parse front matter from a markdown document. A front matter should look like:
   *
   * ```
   * ---
   * key: value
   * ---
   * ```
   *
   * @param content Markdown content, including front matter and body.
   * @returns `{ body, bodyBegin, frontMatter, frontMatterString }`
   * @see {@link FrontMatterResults}
   */
  parse(content) {
    const lines = content.split(/(\r?\n)/);
    if (lines[0] && /= yaml =|---/.test(lines[0])) {
      return this._parse(content);
    } else {
      return this._emptyResults(content);
    }
  }
};

// src/index.ts
var src_default = FrontMatterParser;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FrontMatterParser
});
