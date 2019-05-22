import test from 'tape';
import { isIterable } from '../../utils';
import distinct from '../distinct';
import zip from '../zip';
import range from '../../range';

test('distinct - should throw an error if the given argument is not an iterable', t => {
    const nonIter = 42;
    t.throws(() => {
        distinct(nonIter);
    });
    t.end();
});

test('distnct - should return an iterable with correct args', t => {
    const iter = [1, 2, 3, 4];
    const d = distinct(iter);

    t.equals(isIterable(d), true);
    t.end();
});

test('distinct - should only produce unique values from any given iterable', t => {
    const iter = [1, 1, 3, 1, 3, 2, 1, 4, 0, 0, 1, 5];
    const expected = [...new Set(iter)];

    t.isEquivalent([...distinct(iter)], expected);
    t.end();
});

test('distinct - should work on ranges, and zip iterators', t => {
    const r1 = range(1, 20, 2);
    const r2 = range(1, 20, 4);

    t.isEquivalent([...distinct(r1)], [...r1]);

    const expectedZip = [1, 3, 5, 9, 7, 13, 17, 11, 15, 19];
    t.isEquivalent([...distinct(zip(r1, r2))], expectedZip);

    const r3 = range(-10, 10).map(val => Math.abs(val));

    const absExpected = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    t.isEquivalent([...distinct(r3)], absExpected);
    t.end();
});
