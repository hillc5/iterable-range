import {
    withinBounds,
    underLimit,
    updateValue,
    getStartAndEndValue,
    returnFalse,
    getNewConfig
} from '../utils';

import applyTransforms from '../transforms/applyTransforms';
import generateTransform from '../transforms/generateTransform';
import TRANSFORM_TYPES from '../transforms/transform-types';

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

    let element = startVal;

    return {
        next() {
            const { value, newElement } = _generateValue(
                element,
                transforms,
                endVal,
                reverse
            );
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

export default class RangeBuilder {
    constructor({
        start,
        end,
        step,
        transforms = [],
        reverse = false,
        limit,
        takeUntil = returnFalse
    }) {
        this.rangeConfig = {
            start,
            end,
            step,
            transforms,
            reverse,
            limit,
            takeUntil
        };
    }

    limit(num) {
        return new RangeBuilder(getNewConfig(this.rangeConfig, { limit: num }));
    }

    map(fn) {
        const update = {
            transforms: [generateTransform(TRANSFORM_TYPES.MAP, fn)]
        };

        return new RangeBuilder(getNewConfig(this.rangeConfig, update));
    }

    filter(fn) {
        const update = {
            transforms: [generateTransform(TRANSFORM_TYPES.FILTER, fn)]
        };

        return new RangeBuilder(getNewConfig(this.rangeConfig, update));
    }

    reverse() {
        return new RangeBuilder(
            getNewConfig(this.rangeConfig, { reverse: true })
        );
    }

    takeUntil(fn) {
        return new RangeBuilder(
            getNewConfig(this.rangeConfig, { takeUntil: fn })
        );
    }

    contains(num) {
        const { step, start, end } = this.rangeConfig;
        const numWithinStart = step > 0 ? num >= start : num <= start;
        const numWithinEnd = step > 0 ? num < end : num > end;
        return numWithinStart && numWithinEnd && (num - start) % step === 0;
    }

    length() {
        const { start, end, step } = this.rangeConfig;
        return Math.ceil((end - start) / step);
    }

    [Symbol.iterator]() {
        return _getRangeIterator(this.rangeConfig);
    }
}
