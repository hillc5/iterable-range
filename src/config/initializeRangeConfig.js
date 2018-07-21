export default function initializeRangeConfig(start, end) {
    let config = {
        start,
        end,
        transforms: [],
        reverse: false,
        limit: undefined,
        takeUntil: () => false
    };

    return (...args) => {
        if (!args.length) {
            return config
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
    }
};