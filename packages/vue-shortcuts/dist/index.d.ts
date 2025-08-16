/**
 * Handle keyboard shortcuts, dealing ctrl/meta key for Windows/Mac automatically.
 *
 * @param keys Keyboard shortcuts, split by `+`, e.g. `ctrl+shift+e`.
 * @param cb Callback function to be called when the shortcuts are triggered.
 */
declare const useShortcuts: (keys: string, cb: () => void) => void;

export { useShortcuts as default, useShortcuts };
