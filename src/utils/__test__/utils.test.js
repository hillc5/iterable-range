import test from 'tape';

import {
    withinBounds,
    underLimit,
    updateValue,
    getStartAndEndValue,
    hasInvalidParameters,
    isIterable,
    combineIterators
} from '..';

test('withinBounds - should return true for an index less than a given end if reverse is false', t => {
    const lessThanValue = 0;
    const end = 5;
    const reverse = false;

    t.equal(withinBounds(lessThanValue, end, reverse), true);
    t.end();
});

test('withinBounds - should return false for an index greater than or equal to a given end if reverse is false', t => {
    const greaterThanValue = 10;
    const equalValue = 5;
    const end = 5;
    const reverse = false;

    t.equal(withinBounds(greaterThanValue, end, reverse), false);
    t.equal(withinBounds(equalValue, end, reverse), false);
    t.end();
});

test('withinBounds - should return true for an index greater than or equal to a given end if reverse is true', t => {
    const greaterThanValue = 10;
    const equalValue = 5;
    const end = 5;
    const reverse = true;

    t.equal(withinBounds(greaterThanValue, end, reverse), true);
    t.equal(withinBounds(equalValue, end, reverse), true);
    t.end();
});

test('withinBounds - should return false for an index less than a given end if reverse is true', t => {
    const lessThanValue = 0;
    const end = 5;
    const reverse = true;

    t.equal(withinBounds(lessThanValue, end, reverse), false);
    t.end();
});

test('getStartAndEndValue - should return given start and end in an array if reverse is false', t => {
    const start = 1;
    const end = 10;
    const step = 1;
    const reverse = false;

    const expected = [start, end];

    t.isEquivalent(getStartAndEndValue(start, end, step, reverse), expected);
    t.end();
});

test('getStartAndEndValue - should return a value that would be equal to the last value in a step determined range as the start, and the start as the end if reverse is true', t => {
    const start = 1;
    const end = 10;
    const step = 3;
    const reverse = true;

    // produced values for this range would be [1, 4, 7] so start needs to be 7
    const expected = [7, 1];

    t.isEquivalent(getStartAndEndValue(start, end, step, reverse), expected);
    t.end();
});

test('updateValue - should return an incremented value if decrement is false', t => {
    const index = 0;
    const expected = 1;
    const decrement = false;

    t.equal(updateValue(index, decrement), expected);
    t.end();
});

test('updateValue - should return a decremented value if decrement is true', t => {
    const index = 0;
    const expected = -1;
    const decrement = true;

    t.equal(updateValue(index, decrement), expected);
    t.end();
});

test('underLimit - should return true if limit is undefined', t => {
    const limit = undefined;
    const pushCount = 0;

    t.equal(underLimit(pushCount, limit), true);
    t.end();
});

test('underLimit - should return true if pushCount is under limit', t => {
    const limit = 1;
    const pushCount = 0;

    t.equal(underLimit(pushCount, limit), true);
    t.end();
});

test('underLimit - should return false if pushCount is equal to limit', t => {
    const limit = 1;
    const pushCount = 1;

    t.equal(underLimit(pushCount, limit), false);
    t.end();
});

test('underLimit - should return false if pushCount is over limit', t => {
    const limit = 1;
    const pushCount = 2;

    t.equal(underLimit(pushCount, limit), false);
    t.end();
});

test('hasInvalidParameters - should return true if start is not a number', t => {
    t.equal(hasInvalidParameters('hello', 2), true);
    t.equal(hasInvalidParameters({}, 5), true);
    t.equal(hasInvalidParameters(() => true, 5), true);
    t.end();
});

test('hasInvalidParameters - should return true if end is not a number', t => {
    t.equal(hasInvalidParameters(2, 'hello'), true);
    t.equal(hasInvalidParameters(5, {}), true);
    t.equal(hasInvalidParameters(5, () => true), true);
    t.end();
});

test('hasInvalidParameters - should return true if start is greater than end and step is positive', t => {
    t.equal(hasInvalidParameters(10, 5, 2), true);
    t.end();
});

test('hasInvalidParameters - should return false if start is greater than end and step is negative', t => {
    t.equal(hasInvalidParameters(10, 5, -2), false);
    t.end();
});

test('hasInvalidParameters - should return true if start is less than end and step is negative', t => {
    t.equal(hasInvalidParameters(5, 10, -2), true);
    t.end();
});

test('hasInvalidParameters - should return false if start is less than end and step is positive', t => {
    t.equal(hasInvalidParameters(5, 10, 2), false);
    t.end();
});

test('isIterable -should return true for an iterable, false if not', t => {
    t.equal(isIterable([1, 2]), true);
    t.equal(isIterable(new Map()), true);
    t.equal(isIterable('test'), true);
    t.equal(isIterable(new Set([1, 2])), true);
    t.equal(isIterable(undefined), false);
    t.equal(isIterable(null), false);
    t.equal(isIterable(2), false);
    t.equal(isIterable(true), false);
    t.equal(isIterable({ a: false }), false);
    t.equal(isIterable({ [Symbol.iterator]: () => {} }), true);
    t.end();
});

test('combineIterators - should return an iterable', t => {
    const iter1 = [1, 2, 3];
    const iter2 = ['a', 'b', 'c'];
    const iter3 = 'Charlie';

    const combinedIter = combineIterators([iter1, iter2, iter3]);

    t.isEqual(isIterable(combinedIter), true);
    t.end();
});

test('combineIterators - should produce an array of combined values from each iterator for each call to .next', t => {
    const iter1 = [1, 2, 3];
    const iter2 = ['a', 'b', 'c'];
    const iter3 = 'Charlie';

    const combinedIter = combineIterators([iter1, iter2, iter3]);

    t.isEqual(isIterable(combinedIter), true);
    t.isEquivalent(combinedIter.next().value, [1, 'a', 'C']);
    t.end();
});

test('combineIterators - should produce arrays as values for each iterator included, until all iterators are exhausted', t => {
    const iter1 = [1, 2, 3];
    const iter2 = [1, 2];
    const iter3 = 'Lisa';

    const expectedValues = [[1, 1, 'L'], [2, 2, 'i'], [3, 's'], ['a']];

    const combinedIter = combineIterators([iter1, iter2, iter3]);

    t.isEquivalent([...combinedIter], expectedValues);
    t.end();
});

test('combineIterators - should throw a TypeError if an array is not passed in', t => {
    const param = 42;

    t.throws(() => {
        combineIterators(param);
    });
    t.end();
});

test('combineIterators - should throw a TypeError if any item in the given array is not iterable', t => {
    const iter1 = [1, 2, 3, 4];
    const iter2 = 'Charlie is Iterable';
    const nonIter = 42;

    t.throws(() => {
        combineIterators([iter1, iter2, nonIter]);
    });
    t.end();
});

test('combineIterators - should work for a single iterable', t => {
    const iter1 = 'Charlie';
    const expected = [['C'], ['h'], ['a'], ['r'], ['l'], ['i'], ['e']];

    t.isEquivalent([...combineIterators([iter1])], expected);
    t.end();
});

test('combineIterators - should work for an empty array', t => {
    const expected = [];
    t.isEquivalent([...combineIterators([])], expected);
    t.end();
});
