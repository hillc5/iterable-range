import { withinBounds, underLimit, updateValue } from './utils';
import initializeRangeConfig from './config/initializeRangeConfig';
import applyTransforms from './transforms/applyTransforms';
import generateTransform from './transforms/generateTransform';
import TRANSFORM_TYPES from './transforms/transform-types';

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
 * @param  {Object} rangeConfig - The configuration that defines this range iterator
 *         It has the following schema:
 *         
 *         {
 *             start <Number>           - the starting value in the range,
 *             end <Number>             - the ending value (non-inclusive) in the range,
 *             limit <Number>           - the maximum number of values to produce
 *             transforms <Array>       - a list of transformation functions to be applied to the value
 *             reverse <Boolean>        - a flag indicating whether the output should be reversed
 *             takeUntil <Function>     - a stopping function, if it returns true, stop producing output
 *         }

 * @return {function} iter - An iterator function that returns an Object with { next: fn } 
 */
function _getRangeIterator(rangeConfig) {
    const { 
        start, 
        end, 
        limit, 
        transforms, 
        reverse, 
        takeUntil 
    } = rangeConfig;

    let pushCount = 0;

    const [startVal, endVal] = reverse ? [end - 1, start] : [start, end];
    
    function iter() {
        let element = startVal;

        return {
            next() {
                const { value, newElement } = _generateValue(element, transforms, endVal, reverse);
                element = newElement;

                if (withinBounds(element, endVal, reverse) && underLimit(pushCount, limit) && !takeUntil(value)) {
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
 * 
 * @return {Object} result - iterable object with functions to transform (map), 
 *                           reverse, filter, or limit (limit) the range output 
 *                           { limit(num), map(fn), filter(fn) [Symbol.iterator] }
 */
export default function range(start = 0, end) {
    if (end === undefined || end === null) {
        end = start;
        start = 0;
    }

    const getNewConfig = initializeRangeConfig(start, end);

    const rangeObject = {
        limit(num) {
            return {
                ...rangeObject,
                [Symbol.iterator]: _getRangeIterator(getNewConfig({ limit: num }))
            };
        },

        map(fn) {
            const update = { transforms: [ generateTransform(TRANSFORM_TYPES.MAP, fn) ] };
            
            return {
                ...rangeObject,
                [Symbol.iterator]: _getRangeIterator(getNewConfig(update))
            }
        },

        filter(fn) {
            const update = { transforms: [ generateTransform(TRANSFORM_TYPES.FILTER, fn) ] };
            
            return {
                ...rangeObject,
                [Symbol.iterator]: _getRangeIterator(getNewConfig(update))
            }
        },

        reverse() {
            return {
                ...rangeObject,
                [Symbol.iterator]: _getRangeIterator(getNewConfig({ reverse: true }))
            };
        },

        takeUntil(fn) {
            return {
                ...rangeObject,
                [Symbol.iterator]: _getRangeIterator(getNewConfig({ takeUntil: fn }))
            };
        },

        [Symbol.iterator]: _getRangeIterator(getNewConfig())
    }

    return rangeObject;
}