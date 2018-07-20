import test from 'tape';

import { withinBounds, updateValue } from '..';

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