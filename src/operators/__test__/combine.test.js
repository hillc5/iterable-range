import test from 'tape';

import combine from '../combine';

test('combine - should throw an error if an array is not passed in as the argument', t => {
    t.throws(() => {
        combine();
    });
    t.end();
});

test('combine - should throw an error if any item in the given array is not an iterable', t => {
    t.throws(() => {
        combine([42]);
    });
    t.end();
});

test('combine - should throw an error if the given combineFn is not a function', t => {
    t.throws(() => [...combine(['test'], 42)]);
    t.end();
});

test('combine - should return an array of combined values from each given iterable for every produced value if no combineFn given', t => {
    const iter1 = [1, 2, 3];
    const iter2 = [4, 5, 6];
    const iter3 = [7, 8, 9];
    const iter4 = [10];

    const iters = [iter1, iter2, iter3, iter4];

    const expected = [[1, 4, 7, 10], [2, 5, 8], [3, 6, 9]];

    t.isEquivalent([...combine(iters)], expected);
    t.end();
});

test('combine - should produce values that are returned by the transformation function', t => {
    const sum = values => values.reduce((result, val) => result + val, 0);

    const iter1 = [1, 2, 3];
    const iter2 = [4, 5, 6];
    const iter3 = [7, 8, 9];

    const iters = [iter1, iter2, iter3];

    const expected = [12, 15, 18];

    t.isEquivalent([...combine(iters, sum)], expected);
    t.end();
});
