import 'regenerator-runtime/runtime';
import { combineIterators } from '../utils';

const NOOP = value => value;

export default function combine(iters, combineFn = NOOP) {
    const combinedIterators = combineIterators(iters);

    function* combineGenerator() {
        let { value, done } = combinedIterators.next();
        while (!done) {
            yield combineFn(value);
            const {
                value: nextValue,
                done: nextDone
            } = combinedIterators.next();
            value = nextValue;
            done = nextDone;
        }
    }

    return combineGenerator();
}
