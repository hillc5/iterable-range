import test from 'tape';

import { withinBounds, underLimit, updateValue, getStartAndEndValue, hasInvalidParameters } from '..';

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

    const expected = [7, 1] // produced values for this range would be [1, 4, 7] so start needs to be 7
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