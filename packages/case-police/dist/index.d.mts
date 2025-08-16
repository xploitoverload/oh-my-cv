/**
 * @fileoverview This file is modified from https://github.com/antfu/case-police/blob/main/packages/case-police/src/utils.ts.
 *
 * The original file relies on Node.js APIs, which are removed in this file, so that
 * this package can be used in the browser environment.
 */
type Preset = "softwares" | "products" | "general" | "brands" | "abbreviates";
type ChangedCase = {
    from: string;
    to: string;
    index: number;
};
type CasePoliceReturn = {
    code: string;
    changed: ChangedCase[];
};

/**
 * Works like `case-police`'s CLI, but in the browser environment.
 *
 * @param code The code to correct.
 * @param options Options for case-police.
 *  - `ignore` A list of words to ignore.
 *  - `dict` Custom dictionary JSON, will be merged with original dict
 *  - `presets` Filter the default presets (softwares, products, general, brands, abbreviates)
 *
 * @returns
 *  - `{ code, changed }` The corrected code and a list of changed words, if any changes are made
 *  - `undefined` if the code contains `@case-police-disable` or no changes are made
 *
 * @see {@link CasePoliceReturn}
 */
declare const replace: (code: string, options?: {
    ignore?: string[];
    dict?: Record<string, string>;
    presets?: Preset[];
}) => CasePoliceReturn | undefined;

export { type CasePoliceReturn, type ChangedCase, type Preset, replace as default, replace };
