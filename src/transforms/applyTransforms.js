import TRANSFORM_TYPES from './transform-types';

/**
 * @param  {Any} value - the value that will have the given transforms applied
 * @param  {Array} transforms - list of transform objects of form
 *                              { type: TRANSFORM_TYPES{MAP|FILTER}, transform: transformFn }
 * @return {Any} result - new value produced by the transform functions
 *                        (Note: if a FILTER function returns falsy, undefined will be returned).
 */
export default function applyTransforms(value, transforms = []) {
    if (!transforms || !Array.isArray(transforms)) return { value, filtered: false };

    for (const transformObj of transforms) {
        const { type, transform } = transformObj;
        if (type === TRANSFORM_TYPES.FILTER) {
            if (!transform(value)) return { value: undefined, filtered: true };
        } else {
            value = transform(value);
        }
    }

    return { value, filtered: false };
}
