import { PluginSimple } from 'markdown-it';

/**
 * A markdown-it plugin for cross-references.
 *
 * @example
 *
 * ```markdown
 * [~Reference name]: This is a reference.
 *
 *     It can span multiple lines.
 *
 * This is a reference to [~Reference name].
 * ```
 */
declare const MarkdownItCrossRef: PluginSimple;

export { MarkdownItCrossRef, MarkdownItCrossRef as default };
