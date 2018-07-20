# iterable-range
The iterable-range module provides iterable range creation functionality with a number of helper methods.  Created ranges are lazily evaluated and thus all transforms/modifiers are applied only as needed.  Created ranges include both the start and end values supplied in the provided output

## Installation
```bash
npm i --save iterable-range
```

## Usage

#### Quick creation
```javascript
import range from 'iterable-range';

const r = range(1, 5);

for (let x of r) {
    console.log(x)  // Prints 1 2 3 4 5
}

[...r] // [1, 2, 3, 4, 5]

const r2 = range(5) // Single argument, defaults initial value to 0

[...r2] // [0, 1, 2, 3, 4, 5]

```

## Helper Methods

###  map 
**Parmeters: *mapFn*** - The function to be applied to each viable value in the range.  
Mapfn is supplied with just the value to be acted upon

```javascript
const r = range(1, 5);

[...r.map(val => val * val)] // [1, 4, 9, 16, 25]

// Can have multiple applications

[...r.map(val => val * val).map(val => val % 2 === 0 ? 0 : 1)] // [1, 0, 1, 0, 1]

```

### filter
**Parameters: *filterFn*** - The function to be applied to each vialb value in the range.  
If filterFn returns *falsy* for any given value then that value will not appear in the next chained method, and will effectively be removed from the range.  Filterfn is supplied with just the value to be acted upon

```javascript
const r = range(1, 5);

[...r.filter(val => val % 2)] // [1, 3, 5]

// Can be chained before or after map function

[...r.map(val => val * val).filter(val => val % 2)] // [1, 9, 25]
[...r.filter(val => val % 2).map(val => val * val)] // [1, 9, 25]

```


### take
**Parameters: *numToTake*** - The number of elements to be produced by the range and it's transform chain.  
The take method can appear in any place in the range transform chain, and if multiple calls are made, the last call will be the used value

```javascript
const r = range(1, Infinity)  // Will run for ever if used without .take(numToTake)

[...r.take(5)] // [1, 2, 3, 4, 5]
[...r.take(5).take(10)] // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[...r.map(val => val * val).filter(val => val % 2).take(100)] // Will produce the first 100 odd square numbers

```

### reverse
Reverses the output from the range iterable.  It can be called anywhere in the transform chain, but multiple calls will not negate one another -- Once reverse is called output will always be reversed.

```javascript
const r = range(1, 10);

[...r.reverse()] // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

[...r.map(val => val * val).take(5).reverse()] // [25, 16, 9, 4 ,1]

```