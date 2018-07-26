import { isIterable } from '../utils';

function _getDistinctIterator(iter) {
    const s = new Set();

    return function* distinctIterator() {
        for (let x of iter) {
            if (!s.has(x)) {
                s.add(x);

                yield x;
            }
        }

        return;
    }
}

/**
 * distinct returns an iterable that will produce unique values from the given iterable.
 * 
 * @param  {iterable} iter Iterable
 * @return {iterable}
 */
export default function distinct(iter) {
    if (!isIterable(iter)) {
        throw new TypeError('distinct requires that its argument implements the iterable protocol.  See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols]')
    }

    return {
        [Symbol.iterator]: _getDistinctIterator(iter)
    };
}