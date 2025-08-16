import { PluginSimple } from 'markdown-it';

/**
 * A plugin for markdown-it that adds LaTeX commands. This plugin adds the following commands:
 * - `\newpage`: Adds a new page.
 * - `\\[10px]`: Adds a line break with a height of 10px.
 */
declare const MarkdownItLatexCmds: PluginSimple;

export { MarkdownItLatexCmds, MarkdownItLatexCmds as default };
