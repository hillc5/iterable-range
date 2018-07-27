export default function initializeRangeConfig(start, end, step = 1) {
    let config = {
        start,
        end,
        step,
        transforms: [],
        reverse: false,
        limit: undefined,
        takeUntil: () => false
    };

    return (...args) => {
        if (!args.length) {
            return config;
        }

        const [ update ] = args;

        if (update.transforms) {
            update.transforms = [ ...config.transforms, ...update.transforms ];
        }

        config = {
            ...config,
            ...update
        };

        return config;
    };
}
