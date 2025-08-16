interface FrontMatterResults<T> {
    /**
     * Body content (without front matter).
     */
    readonly body: string;
    /**
     * Line number where the body begins.
     */
    readonly bodyBegin: number;
    /**
     * Parsed front matter object.
     */
    readonly frontMatter: T;
    /**
     * Front matter string.
     */
    readonly frontMatterString?: string;
}
interface FrontMatterOptions {
    /**
     * Behavior when an error occurs while parsing the front matter YAML.
     * - "last": Returns the last successfully parsed front matter.
     * - "empty": Returns an empty front matter object.
     * - "error": Throws an error.
     * @default "error"
     */
    errorBehavior?: "last" | "empty" | "error";
}
declare class FrontMatterParser<T = {
    [key: string]: any;
}> {
    private options;
    private _lastFrontMatter;
    constructor(options?: FrontMatterOptions);
    private _emptyResults;
    /**
     * Get the line number where the body begins.
     */
    private _bodyBegin;
    /**
     * Split the content into front matter and body.
     *
     * @param content Markdown content, including front matter and body.
     * @returns
     * - `false` if the content does not contain front matter
     * - `{ frontMatterString, body, bodyBegin }` if contains
     * @see {@link FrontMatterResults}
     */
    split(content: string): false | {
        frontMatterString: string;
        body: string;
        bodyBegin: number;
    };
    private _parse;
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
    parse(content: string): FrontMatterResults<T>;
}

export { type FrontMatterOptions, FrontMatterParser, type FrontMatterResults, FrontMatterParser as default };
