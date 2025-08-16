type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type PartialWithRequired<T, K extends keyof T> = Pick<T, K> & Partial<T>;
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, false>;
type Callback<T> = IsAny<T> extends true ? (param: any) => void : [T] extends [void] ? () => void : (param: T) => void;

declare const fetchFile: (url: string) => Promise<string>;
/**
 * Open file dialog with ease. This hook differs from vueuse's useFileDialog in that it
 * doesn't require Vue.
 *
 * @param accept File types to accept
 * @returns
 */
declare const useFileDialog: (accept?: string) => {
    open: () => void;
    onChange: (cb: Callback<File>) => void;
};
/**
 * Read file content as text.
 *
 * @param file File object
 * @returns Promise containing file content as string
 */
declare const readFile: (file: File) => Promise<string>;
declare const downloadFile: (filename: string, content: string) => void;

declare const slugify: (str: string) => string;
declare const htmlEscape: (str: string) => string;
declare const copy: <T>(obj: T) => T;
declare const delay: (ms: number) => Promise<unknown>;
declare const now: () => number;
declare const arrayify: <T>(value: T | T[]) => T[];

declare const isClient: boolean;
declare const isMac: boolean;
declare const isExternal: (path: string) => boolean;
declare const isObject: (v: any) => boolean;
declare const isInteger: (v: any, { allowString }?: {
    allowString?: boolean | undefined;
}) => boolean;

export { type Callback, type IfAny, type IsAny, type Optional, type PartialWithRequired, arrayify, copy, delay, downloadFile, fetchFile, htmlEscape, isClient, isExternal, isInteger, isMac, isObject, now, readFile, slugify, useFileDialog };
