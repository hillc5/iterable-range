import TRANSFORM_TYPES from './transform-types';

/**
 * @param  {string} type - one of either TRANSFORM_TYPES {MAP|FILTER}
 * @param  {Function} fn - the transform function (map returns a new value,
 *                         filter expected to return truthy|falsy)
 * @return {Object} result - { type: TRANSFORM_TYPES{MAP|FILTER}, transform: fn }
 */
export default function generateTransform(type = TRANSFORM_TYPES.MAP, fn) {
    return { type, transform: fn };
}
