import 'regenerator-runtime/runtime';
import { isIterable } from '../utils';

export default function concat(...iters) {
    if (iters.some(iter => !isIterable(iter))) {
        throw new TypeError('concat requires that all arguments implement the iterable protocol.');
    }

    return {
        [Symbol.iterator]: function* concatIterator() {
            for (const iter of iters) {
                for (const value of iter) {
                    yield value;
                }
            }
        }
    };
}
