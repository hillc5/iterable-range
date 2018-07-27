import test from 'tape';
import { isIterable } from '../../utils';
import zip from '../zip';

test('zip - should throw an error if any given argument is not an iterable', t => {
    const iter1 = [1, 2, 3, 4];
    const iter2 = 'Charlie is Iterable';
    const nonIter = 42;

    t.throws(() => { zip(iter1, iter2, nonIter); });
    t.end();
});

test('zip - should return an iterator when called with iterables', t => {
    const iter1 = [1, 2, 3, 4];
    const iter2 = 'Charlie is Iterable';

    const z = zip(iter1, iter2);

    t.equals(isIterable(z), true);
    t.end();
});

test('zip - should interleave values from 2 iterators', t => {
    const iter1 = [1, 2, 3, 4];
    const iter2 = [4, 3, 2, 1];

    const expected = [1, 4, 2, 3, 3, 2, 4, 1];

    t.isEquivalent([...zip(iter1, iter2)], expected);
    t.end();
});

test('zip - should iterleave values from 2 iterators until one ends, then just use the remaining iterables values', t => {
    const iter1 = [1, 2, 3, 4, 6, 6, 6];
    const iter2 = [4, 3, 2, 1];

    const expected = [1, 4, 2, 3, 3, 2, 4, 1, 6, 6, 6];

    t.isEquivalent([...zip(iter1, iter2)], expected);
    t.end();
});

test('zip - should only be able to produce values one time (normal iterable behavior)', t => {
    const iter1 = [1, 2, 3, 4];
    const iter2 = [4, 3, 2, 1];

    const expected = [1, 4, 2, 3, 3, 2, 4, 1];

    const z = zip(iter1, iter2);
    t.isEquivalent([...z], expected);
    t.isEquivalent([...z], []);
    t.end();
});
