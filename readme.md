# iterable-range
The iterable-range module provides iterable range creation functionality with a number of helper methods.  Created ranges are lazily evaluated and thus all transforms/modifiers are applied only as needed.  Created ranges include the start but not the end values supplied in the parameters

## Installation
```bash
npm i --save iterable-range
```

## Usage
**range(*start*, *end*, *step[optional]*)**

### Quick creation
```javascript
import range from 'iterable-range';

const r = range(1, 5);

for (let x of r) {
    console.log(x)  // Prints 1 2 3 4
}

[...r] // [1, 2, 3, 4]

const r2 = range(5) // Single argument, defaults initial value to 0

[...r2] // [0, 1, 2, 3, 4]

```

### Using *step* parameter
```javascript
import range from 'iterable-range';

const r = range(1, 10, 2);

[...r]           // [1, 3, 5 ,7, 9]
[...r.reverse()] // [9, 7, 5, 3, 1]

const r = range(10, -10, -5);

[...r]              // [10, 5, 0, -5]
[...r.reverse()]    // [-5, 0, 5, 10]
```

## Methods
Every method applied to an iterable range returns a new iterable range, preserving the original.
```javascript
const r = range(1, 5);

[...r] // [1, 2, 3, 4]

const r2 = r.map(val => val * -1);

[...r2] // [-1, -2, -3, -4]
[...r] // [1, 2, 3, 4]

```


###  map 
**Parmeters: *mapFn*** - The function to be applied to each viable value in the range.  
Mapfn is supplied with just the value to be acted upon

```javascript
const r = range(1, 5);

[...r.map(val => val * val)] // [1, 4, 9, 16]

// Can have multiple applications

[...r.map(val => val * val).map(val => val % 2 === 0 ? 0 : 1)] // [1, 0, 1, 0]

// Works as expected when a step value is provided
const rWithStep = range(1, 10, 2);

[...rWithStep]                        // [1, 3, 5, 7, 9]
[...rWithStep.map(val => val * val)]  // [1, 9, 25, 49, 81]

```

### filter
**Parameters: *filterFn*** - The function to be applied to each vialb value in the range.  
If filterFn returns *falsy* for any given value then that value will not appear in the next chained method, and will effectively be removed from the range.  Filterfn is supplied with just the value to be acted upon

```javascript
const r = range(1, 5);

[...r.filter(val => val % 2)] // [1, 3]

// Can be chained before or after map function

[...r.map(val => val * val).filter(val => val % 2)] // [1, 9]
[...r.filter(val => val % 2).map(val => val * val)] // [1, 9]

```


### limit
**Parameters: *limitVal*** - The number of elements to be produced by the range and it's transform chain.  
The limit method can appear in any place in the range transform chain, and if multiple calls are made, the last call will be the used value

```javascript
const r = range(1, Infinity)  // Will run for ever if used without .limit(limitVal)

[...r.limit(5)] // [1, 2, 3, 4, 5]
[...r.limit(5).limit(10)] // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[...r.map(val => val * val).filter(val => val % 2).limit(100)] // Will produce the first 100 odd square numbers

```

### reverse
Reverses the output from the range iterable.  It can be called anywhere in the transform chain, but multiple calls will not negate one another -- Once reverse is called output will always be reversed.

```javascript
const r = range(1, 10);

[...r.reverse()] // [9, 8, 7, 6, 5, 4, 3, 2, 1]

[...r.map(val => val * val).limit(5).reverse()] // [25, 16, 9, 4 ,1]

// if step is provided reverse still returns the exact reverse of the normal output

const rWithStep = range(-20, 42, 7);

[...rWithStep]              // [-20, -13, -6, 1, 8, 15, 22, 29, 36]
[...rWithStep.reverse()]    // [36, 29, 22, 15, 8, 1, -6, -13, -20]

```

### takeUntil
**Parameters: *takeUntilFn*** - A function that indicates when the range iterator should stop producing values.  If takeUntilFn returns *truthy* for any value then the range iterator will disregard that value and stop producing values.  

**Note** No matter where the .takeUntil method is called, it will be applied after all transforms have been applied to any value.

```javascript
const r = range(1, 10);

[...r.takeUntil(val => val > 6)] // [1, 2, 3, 4, 5, 6]
[...r.takeUntil(val => val === 25).map(val =>  val * val)] // [1, 4, 9, 16]

```