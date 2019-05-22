import test from 'tape';

import range from '../range';

test('range - should return an iterable that produces all values from the given start (inclusive) to the given end (non-inclusive)', t => {
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const start = 1;
    const end = 10;

    t.isEquivalent([...range(start, end)], expected);
    t.end();
});

test('range - should return an iterable that produces all values from 0 to a given POSITIVE end (non-inclusive) if a single postive number passed in', t => {
    const expected = [0, 1, 2, 3, 4];
    const end = 5;

    t.isEquivalent([...range(end)], expected);
    t.end();
});

test('range - should return an iterable that produces all values from 0 to a given POSITIVE end (non-inclusive) if a start is null, end is not', t => {
    const expected = [0, 1, 2, 3, 4];
    const end = 5;

    t.isEquivalent([...range(null, end)], expected);
    t.end();
});

test('range - should return an iterable that produces values from 0 to a given NEGATIVE end (non-inclusive) if single negative number passed in', t => {
    const expected = [-0, -1, -2, -3, -4];
    const end = -5;

    t.isEquivalent([...range(end)], expected);
    t.end();
});

test('range - should return an iterable that produces no output if start and end are not defined', t => {
    t.isEquivalent([...range()], []);
    t.end();
});

test('range - should return an iterable that produces output that utilizes a given step amount', t => {
    const expected = [1, 6, 11, 16];
    const r = range(1, 20, 5);

    t.isEquivalent([...r], expected);
    t.end();
});

test('range - should produce values if start, is greater than end only if step is negative', t => {
    const start = 20;
    const end = 1;
    const step = -2;

    const expected = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
    const r = range(start, end, step);

    t.isEquivalent([...r], expected);
    t.end();
});

test('range - should be able to reverse a range with a positive step', t => {
    const start = 1;
    const end = 10;
    const step = 2;

    const r = range(start, end, step);

    const normal = [1, 3, 5, 7, 9];
    const reverse = [9, 7, 5, 3, 1];

    t.isEquivalent([...r], normal);
    t.isEquivalent([...r.reverse()], reverse);
    t.end();
});

test('range - should be able to reverse a range with a negative step', t => {
    const start = -1;
    const end = -10;
    const step = -2;

    const r = range(start, end, step);

    const normal = [-1, -3, -5, -7, -9];
    const reverse = [-9, -7, -5, -3, -1];

    t.isEquivalent([...r], normal);
    t.isEquivalent([...r.reverse()], reverse);
    t.end();
});

test('range - should produce values if it is called multiple times', t => {
    const r = range(1, 5);
    const expected = [1, 2, 3, 4];
    t.isEquivalent([...r], expected);
    t.isEquivalent([...r], expected);
    t.end();
});

test('range - should return a new iterable any time a map method is called on an already defined range', t => {
    const r = range(1, 5);
    const rExpected = [1, 2, 3, 4];
    const r2 = r.map(val => val * -1);
    const r2Expected = [-1, -2, -3, -4];

    t.notEqual(r, r2);
    t.isNotEquivalent([...r], [...r2]);
    t.isEquivalent([...r], rExpected);
    t.isEquivalent([...r2], r2Expected);
    t.end();
});

test('range - should return a new iterable any time a filter method is called on an already defined range', t => {
    const r = range(1, 5);
    const rExpected = [1, 2, 3, 4];
    const r2 = r.filter(val => val % 2);
    const r2Expected = [1, 3];

    t.notEqual(r, r2);
    t.isNotEquivalent([...r], [...r2]);
    t.isEquivalent([...r], rExpected);
    t.isEquivalent([...r2], r2Expected);
    t.end();
});

test('range - should return a new iterable any time the limit method is called on an already defined range', t => {
    const r = range(1, 5);
    const rExpected = [1, 2, 3, 4];
    const r2 = r.limit(2);
    const r2Expected = [1, 2];

    t.notEqual(r, r2);
    t.isNotEquivalent([...r], [...r2]);
    t.isEquivalent([...r], rExpected);
    t.isEquivalent([...r2], r2Expected);
    t.end();
});

test('range - should return a new iterable any time the reverse method is called on an already defined range', t => {
    const r = range(1, 5);
    const rExpected = [1, 2, 3, 4];
    const r2 = r.reverse();
    const r2Expected = [4, 3, 2, 1];

    t.notEqual(r, r2);
    t.isNotEquivalent([...r], [...r2]);
    t.isEquivalent([...r], rExpected);
    t.isEquivalent([...r2], r2Expected);
    t.end();
});

test('range - should return a new iterable any time the takeUntil method is called on an already defined range', t => {
    const r = range(1, 5);
    const rExpected = [1, 2, 3, 4];
    const r2 = r.takeUntil(val => val === 4);
    const r2Expected = [1, 2, 3];

    t.notEqual(r, r2);
    t.isNotEquivalent([...r], [...r2]);
    t.isEquivalent([...r], rExpected);
    t.isEquivalent([...r2], r2Expected);
    t.end();
});

test('range - should truly be replayable and successive transformation calls should not cache', t => {
    const r = range(1, 10);
    t.isEquivalent([...r.takeUntil(val => val > 5)], [1, 2, 3, 4, 5]);
    t.isEquivalent([...r], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    t.isEquivalent(
        [...r.takeUntil(val => val === 25).map(val => val * val)],
        [1, 4, 9, 16]
    );
    t.isEquivalent([...r], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    t.isEquivalent(
        [...r.map(val => val * val)],
        [1, 4, 9, 16, 25, 36, 49, 64, 81]
    );
    t.isEquivalent(
        [
            ...r
                .filter(val => val !== 3)
                .map(val => val * val)
                .takeUntil(val => val > 36)
        ],
        [1, 4, 16, 25, 36]
    );
    t.end();
});

test('range - should produce mapped values over the given start to end (non-inclusive) range if .map is called', t => {
    const mapFn = val => val * val;
    const start = 1;
    const end = 5;

    const expected = [1, 4, 9, 16];

    t.isEquivalent([...range(start, end).map(mapFn)], expected);
    t.end();
});

test('range - should only produce values that return a truthy value from a filtering function if .filter is called', t => {
    const filterFn = val => val % 2;
    const start = 1;
    const end = 5;

    const expected = [1, 3];

    t.isEquivalent([...range(start, end).filter(filterFn)], expected);
    t.end();
});

test('range - should produced a reversed set of values if reverse is called', t => {
    const start = 1;
    const end = 10;

    const expected = [9, 8, 7, 6, 5, 4, 3, 2, 1];

    t.isEquivalent([...range(start, end).reverse()], expected);
    t.end();
});

test('range - should only produce the number of values equal to a threshold defined by .limit', t => {
    const start = 1;
    const end = 100;
    const limitValue = 10;

    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    t.isEquivalent([...range(start, end).limit(limitValue)], expected);
    t.end();
});

test('range - should apply filter to transformed values if it is applied after map', t => {
    const mapFn = val => val * val;
    const filterFn = val => val <= 25;

    const start = 1;
    const end = 10;

    const expected = [1, 4, 9, 16, 25];

    t.isEquivalent(
        [
            ...range(start, end)
                .map(mapFn)
                .filter(filterFn)
        ],
        expected
    );
    t.end();
});

test('range - should only transform values that pass the filter if filter is called before map', t => {
    const mapFn = val => val * val;
    const filterFn = val => val % 2;

    const start = 1;
    const end = 10;

    const expected = [1, 9, 25, 49, 81];

    t.isEquivalent(
        [
            ...range(start, end)
                .filter(filterFn)
                .map(mapFn)
        ],
        expected
    );
    t.end();
});

test('range - should only use the last limit value if multiple limit calls are made', t => {
    const start = 1;
    const end = 100;
    const limitOne = 50;
    const limitTwo = 10;

    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    t.isEquivalent(
        [
            ...range(start, end)
                .limit(limitOne)
                .limit(limitTwo)
        ],
        expected
    );
    t.end();
});

test('range - should stop producing values once takeUntil returns true', t => {
    const takeUntil = val => val > 6;
    const start = 1;
    const end = 10;

    const expected = [1, 2, 3, 4, 5, 6];

    t.isEquivalent([...range(start, end).takeUntil(takeUntil)], expected);
    t.end();
});

test('range - stop producing values if the takeUntil function returns true, regardless of where in the chain it is called', t => {
    const takeUntil = val => val === 49;
    const start = 1;
    const end = 10;

    const expected = [1, 4, 9, 16, 25, 36];

    t.isEquivalent(
        [
            ...range(start, end)
                .takeUntil(takeUntil)
                .map(val => val * val)
        ],
        expected
    );
    t.end();
});

test('range - should not produce any values if start is after end', t => {
    const start = 10;
    const end = 0;

    const expected = [];

    t.isEquivalent([...range(start, end)], expected);
    t.end();
});

test('range - should not produce any values if no parameters are passed in', t => {
    t.isEquivalent([...range()], []);
    t.end();
});

test('range - should not produce any values if start or end is not a number', t => {
    t.isEquivalent([...range('start', {})], []);
    t.end();
});

test('range - should not produce any values if limit is called with a negative number', t => {
    const start = 1;
    const end = 10;

    const expected = [];

    t.isEquivalent([...range(start, end).limit(-1)], expected);
    t.end();
});

test('range - should return the correct number of values to be produced when length() is called', t => {
    const r1 = range(10);
    t.equals(r1.length(), [...r1].length);

    const r2 = range(-10, 10);
    t.equals(r2.length(), [...r2].length);

    const r3 = range(-25);
    t.equals(r3.length(), [...r3].length);

    const r4 = range(3, 42, 7);
    t.equals(r4.length(), [...r4].length);

    const r5 = range(-21, -1234, -31);
    t.equals(r5.length(), [...r5].length);

    t.end();
});

test('range - should determine if any given value will be included in the initial ranges produced values using contains', t => {
    const r1 = range(10);
    t.equals(r1.contains(3), true);
    t.equals(r1.contains(10), false);

    const r2 = range(-20);
    t.equals(r2.contains(-17), true);
    t.equals(r2.contains(1), false);

    const r3 = range(1, 20, 5);
    t.equals(r3.contains(5), false);
    t.equals(r3.contains(6), true);

    const r4 = range(-10, 10, 2);
    t.equals(r4.contains(-8), true);
    t.equals(r4.contains(10), false);

    const r5 = range(-20, -23423, -2343);
    t.equals(r5.contains(-7049), true);
    t.equals(r5.contains(-40000), false);

    t.end();
});
