import test from 'tape';
import sinon from 'sinon';

import applyTransforms from '../applyTransforms';
import TRANSFORM_TYPES from '../transform-types';

test('applyTransforms - should return the given index if there are no transforms in the transforms list', t => {
    const index = 0;
    const transforms = [];

    const result = applyTransforms(index, transforms);
    t.isEquivalent(result, { value: index, filtered: false });
    t.end();
});

test('applyTransforms - should return the given index if no transforms array is passed in', t => {
    const index = 0;
    const transforms = undefined;

    const result = applyTransforms(index, transforms);
    t.isEquivalent(result, { value: index, filtered: false });
    t.end();
});

test('applyTransforms - should return the given index if a null transforms parameter is passed in', t => {
    const index = 0;
    const transforms = null;

    const result = applyTransforms(index, transforms);
    t.isEquivalent(result, { value: index, filtered: false });
    t.end();
});

test('applyTransforms - should return the given index if transforms is not an array', t => {
    const index = 0;
    const transforms = 'this is an array';

    const result = applyTransforms(index, transforms);
    t.isEquivalent(result, { value: index, filtered: false });
    t.end();
});

test('applyTransforms - should return the correctly mapped value when a given transform is of type MAP', t => {
    const index = 5;
    const transforms = [
        {
            type: TRANSFORM_TYPES.MAP,
            transform: val => val * val
        }
    ];

    const expectedVal = 25;

    const result = applyTransforms(index, transforms);

    t.isEquivalent(result, { value: expectedVal, filtered: false });
    t.end();
});

test('applyTransforms - should return undefined if a single filter transform returns falsy', t => {
    const index = 5;
    const transforms = [
        {
            type: TRANSFORM_TYPES.FILTER,
            transform: val => val !== 5
        }
    ];

    const result = applyTransforms(index, transforms);

    t.isEquivalent(result, { value: undefined, filtered: true });
    t.end();
});

test('applyTransforms - should return the index if a single filter transform returns truthy', t => {
    const index = 5;
    const transforms = [
        {
            type: TRANSFORM_TYPES.FILTER,
            transform: val => val === 5
        }
    ];

    const result = applyTransforms(index, transforms);

    t.isEquivalent(result, { value: index, filtered: false });
    t.end();
});

test('applyTransforms - should not call any waiting transforms if any preceding filter function returns falsy', t => {
    const mapFn = sinon.stub();
    const index = 0;
    const filterFn = () => false;

    const transforms = [
        {
            type: TRANSFORM_TYPES.FILTER,
            transform: filterFn
        },
        {
            type: TRANSFORM_TYPES.MAP,
            transform: mapFn
        }
    ];

    const result = applyTransforms(index, transforms);

    t.isEquivalent(result, { value: undefined, filtered: true });
    t.equal(mapFn.called, false);
    t.end();
});

test('applyTransforms - should apply all of the transforms in the transforms list', t => {
    const mapFnOne = val => val * 2;
    const mapFnTwo = val => val * 1e3;
    const index = 2;
    const expected = mapFnTwo(mapFnOne(index));

    const transforms = [
        {
            type: TRANSFORM_TYPES.MAP,
            transform: mapFnOne
        },
        {
            type: TRANSFORM_TYPES.MAP,
            transform: mapFnTwo
        }
    ];

    const result = applyTransforms(index, transforms);

    t.isEquivalent(result, { value: expected, filtered: false });
    t.end();
});
