// src/index.ts
import { watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { isMac } from "@renovamen/utils";
var useShortcuts = (keys, cb) => {
  const adjustedKeys = keys.replace("ctrl", isMac ? "meta" : "ctrl").split("+");
  const magic = useMagicKeys({
    passive: false,
    onEventFired: (e) => {
      if (e.type !== "keydown") return;
      const isKeyActive = (key) => {
        switch (key) {
          case "ctrl":
            return e.ctrlKey;
          case "meta":
            return e.metaKey;
          case "shift":
            return e.shiftKey;
          default:
            return e.key === key;
        }
      };
      if (adjustedKeys.every(isKeyActive)) e.preventDefault();
    }
  });
  const shortcuts = magic[adjustedKeys.join("+")];
  const { current } = magic;
  watch(shortcuts, (v) => {
    if (v && current.size === adjustedKeys.length) cb();
  });
};
var src_default = useShortcuts;
export {
  src_default as default,
  useShortcuts
};
