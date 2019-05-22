import test from 'tape';
import { isIterable } from '../../utils';
import concat from '../concat';
import zip from '../zip';
import range from '../../range';

test('concat - should throw an error if any of the given arguments are not an iterable', t => {
    const iter = [1, 2, 3];
    const nonIter = 42;
    t.throws(() => {
        concat(iter, nonIter);
    });
    t.end();
});

test('concat - should return an iterable when provided iterable arguments', t => {
    const iter1 = [1, 3, 5];
    const iter2 = 'Hello Woild';
    t.equals(isIterable(concat(iter1, iter2)), true);
    t.end();
});

test('concat - should produce all values for an iterable before any others, in the order they are given', t => {
    const iter1 = range(0, 100, 25);
    const iter2 = range(-100, 0, 25);
    const iter3 = zip(iter1, iter2);

    const c = concat(iter1, iter2, iter3);

    const expected = [
        0,
        25,
        50,
        75,
        -100,
        -75,
        -50,
        -25,
        0,
        -100,
        25,
        -75,
        50,
        -50,
        75,
        -25
    ];

    t.isEquivalent([...c], expected);
    t.end();
});

test('concat - should accept empty arguments', t => {
    const iter1 = [];
    const iter2 = [1, 2, 3];

    t.isEquivalent([...concat()], []);
    t.isEquivalent([...concat(iter1, iter2)], iter2);
    t.end();
});
