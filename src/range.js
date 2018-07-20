import { withinBounds, underTakeThreshold, updateValue } from './utils';

export const TRANSFORM_TYPES = {
    MAP: 'map',
    FILTER: 'filter'
};

/**
 * @param  {string} type - one of either TRANSFORM_TYPES {MAP|FILTER}
 * @param  {Function} fn - the transform function (map returns a new value,
 *                         filter expected to return truthy|falsy)
 * @return {Object} result - { type: TRANSFORM_TYPES{MAP|FILTER}, transform: fn }
 */
export function generateTransform(type = TRANSFORM_TYPES.MAP, fn) {
    return { type, transform: fn };
}

/**
 * @param  {Any} value - the value that will have the given transforms applied
 * @param  {Array} transforms - list of transform objects of form 
 *                              { type: TRANSFORM_TYPES{MAP|FILTER}, transform: transformFn }
 * @return {Any} result - new value produced by the transform functions 
 *                        (Note: if a FILTER function returns falsy, undefined will be returned).
 */
export function applyTransforms(value, transforms = []) {
    if (!transforms || !Array.isArray(transforms)) return { value, filtered: false };
    
    for (let transformObj of transforms) {
        const { type, transform } = transformObj;
        if (type === TRANSFORM_TYPES.FILTER) {
            if (!transform(value)) return { value: undefined, filtered: true };
        } else {
            value = transform(value);
        }
    }

    return { value, filtered: false };
}

function _generateValue(element, transforms, end, reverse) {
    let newElement = element;
    let { value, filtered } = applyTransforms(newElement, transforms);
    
    while (filtered && withinBounds(newElement, end, reverse)) {
        newElement = updateValue(newElement, reverse);
        // weird destructuring syntax for existing variables
        ({ value, filtered } = applyTransforms(newElement, transforms));
    }

    return { value, newElement };
}

/**
 * @param  {number} start - The starting value
 * @param  {number} end - The ending (inclusive) value
 * @param  {number} takeNum - The total number of values desired to be returned
 * @param  {array<Object>} transforms - List of transform object of the form 
 *                                      { type: TRANSFORM_TYPES{MAP|FILTER}, transform: fn }
 * @return {function} iter - An iterator function that returns an Object with { next: fn } 
 */
function _getRangeIterator({ start, end, takeNum, transforms, reverse }) {
    let pushCount = 0;

    [start, end] = reverse ? [end - 1, start] : [start, end];
    
    function iter() {
        let element = start;

        return {
            next() {
                const { value, newElement } = _generateValue(element, transforms, end, reverse);
                element = newElement;

                if (withinBounds(element, end, reverse) && underTakeThreshold(pushCount, takeNum)) {
                    pushCount++;
                    element = updateValue(element, reverse);
                    return { value, done: false };
                }

                return { done: true };
            }
        }
    }

    return iter;
}

/**
 * @param  {Number} start - The starting (inclusive) value for the desired 
 *                          range (if ommitted zero is default)
 * @param  {Number} end - The ending (inclusive) value for the desired range
 * @return {Object} result - iterable object with functions to transform (map), 
 *                           reverse, filter, or limit (take) the range output 
 *                           { take(num), map(fn), filter(fn) [Symbol.iterator] }
 */
export default function range(start = 0, end) {
    if (end === undefined || end === null) {
        end = start;
        start = 0;
    }

    const getNewConfig = initializeConfig(start, end)
    let config = getNewConfig();

    const rangeObject = {
        take(num) {
            config = getNewConfig(config, { takeNum: num })
            this[Symbol.iterator] = _getRangeIterator(config);
            return rangeObject;
        },

        map(fn) {
            const update = getTransformUpdate(config.transforms, generateTransform(TRANSFORM_TYPES.MAP, fn));
            config = getNewConfig(config, update)
            this[Symbol.iterator] = _getRangeIterator(config);
            return rangeObject;
        },

        filter(fn) {
            const update = getTransformUpdate(config.transforms, generateTransform(TRANSFORM_TYPES.FILTER, fn));
            config = getNewConfig(config, update)
            this[Symbol.iterator] = _getRangeIterator(config);
            return rangeObject;
        },

        reverse() {
            config = getNewConfig(config, { reverse: true })
            this[Symbol.iterator] = _getRangeIterator(config);
            return rangeObject;
        },

        [Symbol.iterator]: _getRangeIterator(config)
    }

    return rangeObject;
}

function getTransformUpdate(transforms, newTransform) {
    return {
        transforms: [ ...transforms, newTransform ]
    };
}

function initializeConfig(start, end) {
    return (...args) => {
        if (!args.length) {
            return {
                start,
                end,
                transforms: [],
                reverse: false,
                takeNum: undefined
            }
        }

        const [ current, update = {} ] = args;
        return {
            ...current,
            ...update
        }
    }
};
