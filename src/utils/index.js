import 'regenerator-runtime/runtime';

export function returnFalse() {
    return false;
}

export function getNewConfig(config, ...args) {
    if (!args.length) {
        return config;
    }

    const [update] = args;

    if (update.transforms) {
        update.transforms = [...config.transforms, ...update.transforms];
    }

    config = {
        ...config,
        ...update
    };

    return config;
}

export function withinBounds(index, end, reverse, negativeStep) {
    /* eslint-disable indent */
    return negativeStep
        ? reverse
            ? index <= end
            : index > end
        : reverse
        ? index >= end
        : index < end;
}

export function updateValue(index, decrement, step = 1) {
    return decrement ? index - step : index + step;
}

export function underLimit(pushCount, limit) {
    return limit === undefined || pushCount < limit;
}

export function getStartAndEndValue(start, end, step, reverse) {
    if (reverse) {
        const diff = (end - start) % step || step;
        return [end - diff, start];
    }

    return [start, end];
}

export function hasInvalidParameters(start, end, step) {
    if (isNaN(start) || isNaN(end)) return true;

    const diff = end - start;

    return (diff > 0 && step < 0) || (diff < 0 && step > 0);
}

export function isIterable(iter) {
    if (iter === null || iter === undefined) {
        return false;
    }

    return typeof iter[Symbol.iterator] === 'function';
}

export function combineIterators(iters) {
    if (!Array.isArray(iters)) {
        throw new TypeError('The first argument must be of type Array');
    }

    if (iters.some(iter => !isIterable(iter))) {
        throw new TypeError(
            'All elements in the given list must implement the iterable protocol'
        );
    }

    const iterators = iters.reduce((iteratorDict, iter, index) => {
        iteratorDict[index] = iter[Symbol.iterator]();
        return iteratorDict;
    }, {});

    const terminatedIterators = {};

    function* comboGenerator() {
        while (Object.keys(terminatedIterators).length < iters.length) {
            const result = [];
            Object.values(iterators).forEach((iterator, index) => {
                const { value, done } = iterator.next();

                if (done) {
                    terminatedIterators[index] = true;
                } else {
                    result.push(value);
                }
            });

            if (result.length) {
                yield result;
            }
        }
    }

    return comboGenerator();
}
