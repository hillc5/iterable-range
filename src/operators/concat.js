import 'regenerator-runtime/runtime';
import { isIterable } from '../utils';

export default function concat(...iters) {
    if (iters.some(iter => !isIterable(iter))) {
        throw new TypeError('concat requires that all arguments implement the iterable protocol.  See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols]')
    }

    return {
        [Symbol.iterator]: function* concatIterator() {
            for (let iter of iters) {
                for (let value of iter) {
                    yield value;
                }
            }
        }
    };
}