import { MaybeComputedElementRef, WatchThrottledOptions } from '@vueuse/core';
import { MaybeRef } from '@vueuse/shared';

type PageSize = {
    width: number;
    height: number;
};
type PageMargins = Partial<{
    top: number;
    bottom: number;
    left: number;
    right: number;
}>;

/**
 * Break the content into pages based on the given size and margins.
 *
 * @param target HTML element
 * @param html Content that will be rendered as innerHTML of the target element
 * @param size Size and margins of each page
 * @param options
 *
 * @returns A render function to manually trigger the page breaking
 *
 * @example
 * ```vue
 * <template>
 *  <div ref="target" />
 * </template>
 *
 * <script setup>
 * import { ref } from "vue";
 * import { useSmartPages } from "vue-smart-pages";
 *
 * const target = ref();
 *
 * const { render } = useSmartPages(target, "<p>Content</p>", { width: 210, height: 297 }, { top: 10, bottom: 10, left: 10, right: 10 });
 * </script>
 * ```
 */
declare const useSmartPages: (target: MaybeComputedElementRef, html: MaybeRef<string>, size: MaybeRef<PageSize>, margins?: MaybeRef<PageMargins>, options?: {
    beforeRender?: () => void | Promise<void>;
    afterRender?: () => void | Promise<void>;
    watchThrottledOptions?: WatchThrottledOptions<Readonly<boolean>>;
}) => {
    render: () => Promise<void>;
};

export { type PageMargins, type PageSize, useSmartPages as default, useSmartPages };
