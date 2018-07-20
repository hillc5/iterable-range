import { withinBounds, updateValue } from './utils';

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
    if (!transforms || !Array.isArray(transforms)) return value;

    let transformsIdx = 0;
    let result = value;
    
    while(transformsIdx < transforms.length && result !== undefined) {
        let { type, transform } = transforms[transformsIdx];
        
        if (type === TRANSFORM_TYPES.FILTER) {
            if (!transform(result)) {
                result = undefined;
            }
        } else {
            result = transform(result);
        }

        transformsIdx++;
    }

    return result;
}

/**
 * @param  {number} start - The starting value
 * @param  {number} end - The ending (inclusive) value
 * @param  {number} takeNum - The total number of values desired to be returned
 * @param  {array<Object>} transforms - List of transform object of the form 
 *                                      { type: TRANSFORM_TYPES{MAP|FILTER}, transform: fn }
 * @return {function} iter - An iterator function that returns an Object with { next: fn } 
 */
function _getRangeIterator(start, end, takeNum, transforms, reverse) {
    let pushCount = 0;

    [start, end] = reverse ? [end, start] : [start, end];
    
    function iter() {
        let element = start;

        return {
            next() {
                let value = applyTransforms(element, transforms);
                
                while (value === undefined && withinBounds(element, end, reverse)) {
                    element = updateValue(element, reverse);
                    value = applyTransforms(element, transforms);
                }

                const underTakeThresh = (takeNum === undefined || pushCount < takeNum);

                if (withinBounds(element, end, reverse) && underTakeThresh) {
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

    let transforms = [];
    let takeNum;
    let reverse;

    const rangeObject = {
        take(num) {
            takeNum = num;
            this[Symbol.iterator] = _getRangeIterator(start, end, takeNum, [...transforms], reverse);
            return rangeObject;
        },

        map(fn) {
            transforms.push(generateTransform(TRANSFORM_TYPES.MAP, fn));
            this[Symbol.iterator] = _getRangeIterator(start, end, takeNum, [...transforms], reverse);
            return rangeObject;
        },

        filter(fn) {
            transforms.push(generateTransform(TRANSFORM_TYPES.FILTER, fn));
            this[Symbol.iterator] = _getRangeIterator(start, end, takeNum, [...transforms], reverse);
            return rangeObject;
        },

        reverse() {
            reverse = true;
            this[Symbol.iterator] = _getRangeIterator(start, end, takeNum, [...transforms], reverse);
            return rangeObject;
        },

        [Symbol.iterator]: _getRangeIterator(start, end, takeNum, [...transforms], reverse)
    }

    return rangeObject;
}