import { KatexOptions } from 'katex';
import { PluginWithOptions } from 'markdown-it';

/**
 * A markdown-it plugin for rendering KaTeX math expressions, improved from
 * https://github.com/waylonflinn/markdown-it-katex.
 *
 * This one is typed and has clearer code.
 */
declare const MarkdownItKatex: PluginWithOptions<KatexOptions>;

export { MarkdownItKatex, MarkdownItKatex as default };
