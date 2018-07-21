import test from 'tape';

import initializeRangeConfig from '../initializeRangeConfig';

test('initializeRangeConfig - should return an update function', t => {
    const update = initializeRangeConfig();
    t.equal(typeof update, 'function');
    t.end();
});

test('initializeRangeConfig - should store the given start, end values in the initial config returned by the udpate function', t => {
    const start = 1;
    const end = 10;
    const update = initializeRangeConfig(start, end);

    const initConfig = update();
    t.equal(initConfig.start, start);
    t.equal(initConfig.end, end);
    t.end();
});

test('initializeRangeConfig - should provide default values to the initial config returned by its update function', t => {
    const start = 1;
    const end = 10;
    const update = initializeRangeConfig(start, end);

    const initConfig = update();
    t.equal(initConfig.start, start);
    t.equal(initConfig.end, end);
    t.isEquivalent(initConfig.transforms, []);
    t.equal(initConfig.reverse, false);
    t.equal(initConfig.limit, undefined);
    t.end();
});

test('initializeRangeConfig - should return an updated config when an update is sent to the update function', t => {
    const updateObj = {
        transforms: [ 'test' ],
        limit: 5,
        reverse: true
    };

    const start = 1;
    const end = 10;
    const update = initializeRangeConfig(start, end);

    const initConfig = update(updateObj);
    t.equal(initConfig.start, start);
    t.equal(initConfig.end, end);
    t.isEquivalent(initConfig.transforms, [ 'test' ]);
    t.equal(initConfig.reverse, true);
    t.equal(initConfig.limit, 5);
    t.end();
});

test('initializeRangeConfig - should maintain config state across updates', t => {
    const updateObj = {
        transforms: [ 'test1' ],
        limit: 5,
        reverse: true
    };

    const start = 1;
    const end = 10;
    const update = initializeRangeConfig(start, end);

    const initConfig = update(updateObj);
    t.equal(initConfig.start, start);
    t.equal(initConfig.end, end);
    t.isEquivalent(initConfig.transforms, [ 'test1' ]);
    t.equal(initConfig.reverse, true);
    t.equal(initConfig.limit, 5);

    const newConfig = update({ transforms: [ 'test2' ]});
    t.isEquivalent(newConfig.transforms, [ 'test1', 'test2' ]);
    t.notEquivalent(newConfig.transforms, initConfig.transforms);
    t.end();
});