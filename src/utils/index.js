export function withinBounds(index, end, reverse) {
    return reverse ? index >= end : index <= end;
}

export function updateValue(index, decrement) {
    return decrement ? index - 1 : index + 1;
}