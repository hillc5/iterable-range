import {
    withinBounds, underLimit, updateValue, getStartAndEndValue, hasInvalidParameters
} from './utils';
import initializeRangeConfig from './config/initializeRangeConfig';
import applyTransforms from './transforms/applyTransforms';
import generateTransform from './transforms/generateTransform';
import TRANSFORM_TYPES from './transforms/transform-types';

function _generateValue(element, transforms, end, reverse, step) {
    let newElement = element;
    let { value, filtered } = applyTransforms(newElement, transforms);

    // While any filtered transforms remove a value, increment to the next element
    // and apply transforms to produce another value
    while (filtered && withinBounds(newElement, end, reverse, step < 0)) {
        newElement = updateValue(newElement, reverse, step);
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
 *             transforms <Array>       - a list of transformation functions to be applied to the
 *                                        value
 *             reverse <Boolean>        - a flag indicating whether the output should be reversed
 *             takeUntil <Function>     - a stopping function, if it returns true, stop producing
 *                                        output
 *         }

 * @return {function} iter - An iterator function that returns an Object with { next: fn }
 */
function _getRangeIterator(rangeConfig) {
    const {
        start,
        end,
        step,
        limit,
        transforms,
        reverse,
        takeUntil
    } = rangeConfig;

    let pushCount = 0;

    const [startVal, endVal] = getStartAndEndValue(start, end, step, reverse);


    function iter() {
        let element = startVal;

        return {
            next() {
                const { value, newElement } = _generateValue(element, transforms, endVal, reverse);
                element = newElement;

                if (
                    withinBounds(element, endVal, reverse, step < 0) &&
                    underLimit(pushCount, limit) &&
                    !takeUntil(value)
                ) {
                    pushCount += 1;
                    element = updateValue(element, reverse, step);
                    return { value, done: false };
                }

                // Replay-ability of limited range iterators.
                pushCount = 0;
                return { done: true };
            }
        };
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
export default function range(start, end, step) {
    if (end === undefined || end === null) {
        end = start || 0;
        start = 0;

        if (!step && end < 0) {
            step = -1;
        }
    }

    if (start === null) {
        start = 0;
    }

    if (step === undefined || step === null) {
        step = 1;
    }

    if (hasInvalidParameters(start, end, step)) {
        start = 0;
        end = 0;
        step = 1;
    }

    const getNewConfig = initializeRangeConfig(start, end, step);

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
            };
        },

        filter(fn) {
            const update = { transforms: [ generateTransform(TRANSFORM_TYPES.FILTER, fn) ] };

            return {
                ...rangeObject,
                [Symbol.iterator]: _getRangeIterator(getNewConfig(update))
            };
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

        contains(num) {
            const numWithinStart = step > 0 ? num >= start : num <= start;
            const numWithinEnd = step > 0 ? num < end : num > end;
            return (numWithinStart && numWithinEnd) && (num - start) % step === 0;
        },

        length() {
            return Math.ceil((end - start) / step);
        },

        [Symbol.iterator]: _getRangeIterator(getNewConfig())
    };

    return rangeObject;
}
