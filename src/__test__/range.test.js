import test from 'tape';

import range from '../range';

test('range - should return an iterable that produces all values from the given start (inclusive) to the given end (non-inclusive)', t => {
    const expected = [ 1, 2, 3, 4, 5, 6, 7, 8, 9  ];
    const start = 1;
    const end = 10;

    t.isEquivalent([...range(start, end)], expected);
    t.end();
});

test('range - should return an iterable that produces all values from 0 to the given end (non-inclusive) if a single value passed in', t => {
    const expected = [ 0, 1, 2, 3, 4 ];
    const end = 5;

    t.isEquivalent([...range(end)], expected);
    t.end();
});

test('range - should return an iterable that produces no output if start and end are not defined', t => {
    t.isEquivalent([...range()], []);
    t.end();
});

test('range - should produce mapped values over the given start to end (non-inclusive) range if .map is called', t => {
    const mapFn = val => val * val;
    const start = 1;
    const end = 5;

    const expected = [ 1, 4, 9, 16 ];

    t.isEquivalent([...range(start, end).map(mapFn)], expected);
    t.end();
});

test('range - should only produce values that return a truthy value from a filtering function if .filter is called', t =>  {
    const filterFn = val => val % 2;
    const start = 1;
    const end = 5;

    const expected = [ 1, 3 ];

    t.isEquivalent([...range(start, end).filter(filterFn)], expected);
    t.end();
});

test('range - should produced a reversed set of values if reverse is called', t => {
    const start = 1;
    const end = 10;

    const expected = [ 9, 8, 7, 6, 5, 4, 3, 2, 1 ];

    t.isEquivalent([...range(start, end).reverse()], expected);
    t.end();
});

test('range - should only produce the number of values equal to a threshold defined by .limit', t => {
    const start = 1;
    const end =  100;
    const limitValue = 10;

    const expected = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

    t.isEquivalent([...range(start, end).limit(limitValue)], expected);
    t.end();
});

test('range - should apply filter to transformed values if it is applied after map', t => {
    const mapFn = val => val * val;
    const filterFn = val => val <= 25;

    const start = 1;
    const end = 10;

    const expected =  [ 1, 4, 9, 16, 25 ];

    t.isEquivalent([...range(start, end).map(mapFn).filter(filterFn)], expected);
    t.end();
});

test('range - should only transform values that pass the filter if filter is called before map', t => {
    const mapFn = val => val * val;
    const filterFn = val => val % 2;

    const start = 1;
    const end = 10;

    const expected = [ 1, 9, 25, 49, 81 ];

    t.isEquivalent([...range(start, end).filter(filterFn).map(mapFn)], expected);
    t.end();
});

test('range - should only use the last limit value if multiple limit calls are made', t => {
    const start = 1;
    const end = 100;
    const limitOne = 50;
    const limitTwo = 10;

    const expected = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

    t.isEquivalent([...range(start, end).limit(limitOne).limit(limitTwo)], expected);
    t.end();
});

test('range - should stop producing values once takeUntil returns true', t => {
    const takeUntil = val => val > 6;
    const start = 1;
    const end = 10;

    const expected = [ 1, 2, 3, 4, 5, 6 ];

    t.isEquivalent([...range(start, end).takeUntil(takeUntil)], expected);
    t.end();
});

test('range - stop producing values if the takeUntil function returns true, regardless of where in the chain it is called', t => {
    const takeUntil = val => val === 49;
        const start = 1;
        const end = 10;

        const expected = [ 1, 4, 9, 16, 25, 36 ];

        t.isEquivalent([...range(start, end).takeUntil(takeUntil).map(val => val * val)], expected);
        t.end();
});

test('range - should not produce any values if start is after end', t => {
    const start = 10;
    const end = 0

    const expected = [];

    t.isEquivalent([...range(start, end)], expected);
    t.end();
});


test('range - should not produce any values if limit is called with a negative number', t => {
    const start = 1;
    const end = 10;

    const expected = [];

    t.isEquivalent([...range(start, end).limit(-1)], expected);
    t.end();
});