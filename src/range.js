export const TRANSFORM_TYPES = {
    MAP: 'map',
    FILTER: 'filter'
};

/**
 * @param  {string} type - one of either TRANSFORM_TYPES {MAP|FILTER}
 * @param  {Function} fn - the transform function (map returns a new value,
 *                         filter expected to return truthy|falsy)
 * @return {Object} result - { type: TRANSFORM_TYPES{MAP|FILTER}, transform: fn }
 */
export function generateTransform(type = TRANSFORM_TYPES.MAP, fn) {
    return { type, transform: fn };
}

/**
 * @param  {Any} index - the value that will have the given transforms applied
 * @param  {Array} transforms - list of transform objects of form 
 *                              { type: TRANSFORM_TYPES{MAP|FILTER}, transform: transformFn }
 * @return {Any} result - new value produced by the transform functions 
 *                        (Note: if a FILTER function returns falsy, undefined will be returned).
 */
export function applyTransforms(index, transforms = []) {
    if (!transforms || !Array.isArray(transforms)) return index;

    let transformsIdx = 0;
    let result = index;
    
    while(transformsIdx < transforms.length && result !== undefined) {
        let { type, transform } = transforms[transformsIdx];
        
        if (type === TRANSFORM_TYPES.FILTER) {
            if (!transform(result)) {
                result = undefined;
            }
        } else {
            result = transform(result);
        }

        transformsIdx++;
    }

    return result;
}

/**
 * @param  {number} start - The starting value
 * @param  {number} end - The ending (nonInclusive) value
 * @param  {number} takeNum - The total number of values desired to be returned
 * @param  {array<Object>} transforms - List of transform object of the form 
 *                                      { type: TRANSFORM_TYPES{MAP|FILTER}, transform: fn }
 * @return {function} iter - An iterator function that returns an Object with { next: fn } 
 */
export function getRangeIterator(start, end, takeNum, transforms) {
    let pushCount = 0;
    
    function iter() {
        let index = start;

        return {
            next() {
                let value = applyTransforms(index, transforms);
                
                while (value === undefined && index < end) {
                    index++;
                    value = applyTransforms(index, transforms);
                }

                const withinBounds = index < end;
                const underTakeThresh = (takeNum === undefined || pushCount < takeNum);

                if (withinBounds && underTakeThresh) {
                    pushCount++;
                    index++;
                    return { value, done: false };
                }

                return { done: true };
            }
        }
    }

    return iter;
}

/**
 * @param  {Number} start - The starting (inclusive) value for the desired 
 *                          range (if ommitted zero is default)
 * @param  {Number} end - The ending (non-inclusive) value for the desired range
 * @return {Object} result - iterable object with functions to transform (map), 
 *                           filter, or limit (take) the range output 
 *                           { take(num), map(fn), filter(fn) [Symbol.iterator] }
 */
export default function range(start = 0, end) {
    if (!end) {
        end = start;
        start = 0;
    }

    let transforms = [];
    let takeNum;

    const rangeObject = {
        take(num) {
            takeNum = num;
            this[Symbol.iterator] = getRangeIterator(start, end, takeNum, [...transforms]);
            return rangeObject;
        },

        map(fn) {
            transforms.push(generateTransform(TRANSFORM_TYPES.MAP, fn));
            this[Symbol.iterator] = getRangeIterator(start, end, takeNum, [...transforms]);
            return rangeObject;
        },

        filter(fn) {
            transforms.push(generateTransform(TRANSFORM_TYPES.FILTER, fn));
            this[Symbol.iterator] = getRangeIterator(start, end, takeNum, [...transforms]);
            return rangeObject;
        },

        [Symbol.iterator]: getRangeIterator(start, end, takeNum, [...transforms])
    }

    return rangeObject;
}