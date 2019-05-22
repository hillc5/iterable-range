import { hasInvalidParameters } from './utils';

import RangeBuilder from './RangeBuilder';

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

    return new RangeBuilder({ start, end, step });
}
