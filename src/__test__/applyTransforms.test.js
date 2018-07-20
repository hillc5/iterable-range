import test from 'tape';
import sinon from 'sinon';

import { TRANSFORM_TYPES, applyTransforms } from '../range';

test('applyTransforms - should return the given index if there are no transforms in the transforms list', t => {
    const index = 0;
    const transforms = [];

    const result = applyTransforms(index, transforms);
    t.equal(result, index);
    t.end();
});

test('applyTransforms - should return the given index if no transforms array is passed in', t => {
    const index = 0;
    const transforms = undefined;

    const result = applyTransforms(index, transforms);
    t.equal(result, index);
    t.end();
});

test('applyTransforms - should return the given index if a null transforms parameter is passed in', t => {
    const index = 0;
    const transforms = null;

    const result = applyTransforms(index, transforms);
    t.equal(result, index);
    t.end();
});

test('applyTransforms - should return the given index if transforms is not an array', t => {
    const index = 0;
    const transforms = 'this is an array';

    const result = applyTransforms(index, transforms);
    t.equal(result, index);
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

    t.equal(result, expectedVal);
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

    t.equal(result, undefined);
    t.end();
});

test('applyTransforms - should return the index if a single filter transform returns truthy',  t => {
    const index = 5;
    const transforms = [
        {
            type: TRANSFORM_TYPES.FILTER,
            transform: val => val === 5
        }
    ];

    const result = applyTransforms(index, transforms);

    t.equal(result, index);
    t.end();
});

test('applyTransforms - should not call any waiting transforms if any preceding filter function returns falsy', t => {
    const mapFn = sinon.stub();
    const index = 0;
    const filterFn = val => false;

    const transforms = [
        {
            type: 
        }
    ];
})