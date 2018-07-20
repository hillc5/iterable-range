export function withinBounds(index, end, reverse) {
    return reverse ? index >= end : index < end;
}

export function updateValue(index, decrement) {
    return decrement ? index - 1 : index + 1;
}

export function underLimit(pushCount, limit) {
    return (limit === undefined || pushCount < limit);
}
