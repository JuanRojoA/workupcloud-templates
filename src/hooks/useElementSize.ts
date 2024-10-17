import { RefObject, useEffect, useState } from 'react';

interface ElementSize {
    width: number;
    height: number;
}

/**
 * A custom React hook that returns the width and height of an HTML element.
 *
 * @param {RefObject<HTMLElement>} ref - A React ref pointing to the HTML element whose size you want to track.
 * @returns {ElementSize} An object containing the width and height of the element in pixels.
 *
 * @example
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { width, height } = useElementSize(ref);
 *
 *   return (
 *     <div ref={ref} style={{ resize: 'both', overflow: 'auto', width: '200px', height: '200px' }}>
 *       <p>Width: {width}px</p>
 *       <p>Height: {height}px</p>
 *     </div>
 *   );
 * };
 */
const useElementSize = (ref: RefObject<HTMLElement>): ElementSize => {
    const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                setSize({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
                });
            }
        };

        handleResize();

        const resizeObserver = new ResizeObserver(handleResize);

        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                resizeObserver.unobserve(ref.current);
            }
            resizeObserver.disconnect();
        };
    }, [ref]);

    return size;
};

export { useElementSize };
