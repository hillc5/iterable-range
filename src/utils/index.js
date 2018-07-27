export function withinBounds(index, end, reverse, negativeStep) {
    return negativeStep
        ? reverse ? index <= end : index > end
        : reverse ? index >= end : index < end;
}

export function updateValue(index, decrement, step = 1) {
    return decrement ? (index - step) : (index + step);
}

export function underLimit(pushCount, limit) {
    return (limit === undefined || pushCount < limit);
}

export function getStartAndEndValue(start, end, step, reverse) {
    if (reverse) {
        const diff = (end - start) % step || step;
        return [ end - diff, start ];
    }

    return [ start, end ];
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
