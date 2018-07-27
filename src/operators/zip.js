import 'regenerator-runtime/runtime';
import { isIterable } from '../utils';

function _getZipIterator(iters) {
    let currentIterator = 0;
    let terminatedIterators = 0;
    let iterators = {};

    return function* zipIterator() {
        while(terminatedIterators < iters.length) {
            if (!iterators[currentIterator]) {
                iterators[currentIterator] = { iterator: iters[currentIterator][Symbol.iterator]() };
            }
            const { iterator, iteratorComplete } = iterators[currentIterator];
            const { value, done } =  iterator.next();

            if (done) {
                if (!iteratorComplete) {
                    terminatedIterators++;
                    iterators[currentIterator].iteratorComplete = true;
                }
            } else {
                yield value;
            }

            currentIterator = (currentIterator + 1) % iters.length;
        }
    }
}

/**
 * zip returns an iterable that will produce the interleaved values from the iterables
 * provided.  The new zipped iterable will produce values until all provided iterables
 * are done.
 *
 * The iterable returned can only be run once and cannot be "replayed".
 * 
 * @param  {Iterable(s)} iters Any number of iterabls
 * @return {Iterable}          
 */
export default function zip(...iters) {
    if (iters.some(iter => !isIterable(iter))) {
        throw new TypeError('zip requires that all arguments implement the iterable protocol.  See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols]');
    }

    return {
        [Symbol.iterator]: _getZipIterator(iters)
    }
};
