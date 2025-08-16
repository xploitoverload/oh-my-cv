/**
 * Dynamically injects CSS into the document. Borrowed from Vite:
 * https://github.com/vitejs/vite/blob/main/packages/vite/src/client/client.ts
 *
 * This used to be implemented using constructable stylesheets, but that was abandoned
 * due to low performance, see https://github.com/vitejs/vite/pull/11818.
 *
 * @param id To make sure the CSS won't override each other.
 * @param content A string of CSS to inject.
 */
declare const injectCss: (id: string, content: string) => void;
/**
 * Remove the CSS from the document.
 *
 * @param id The ID of the CSS to remove.
 */
declare const removeCss: (id: string) => void;

export { injectCss, removeCss };
