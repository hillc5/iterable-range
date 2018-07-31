# iterable-range
The iterable-range module provides iterable range creation functionality with a number of helper methods.  Created ranges are lazily evaluated and thus all transforms/modifiers are applied only as needed.  Created ranges include the start but not the end values supplied in the parameters

# Contents
* [Installation](#installation)
* [Usage](#usage)
  * [Quick creation](#quick-creation)
  * [Using *step* parameter](#using-step-parameter)
  * [Replay-ability](#replay-ability)
  * [Import with CommonJS](#import-using-commonjs)
* [Methods](#methods)
  * [map](#map)
  * [filter](#filter)
  * [limit](#limit)
  * [reverse](#reverse)
  * [takeUntil](#takeUntil)
  * [contains](#contains)
  * [length](#length)
* [Operators](#operators)
  * [concat](#concat)
  * [zip](#zip)
  * [distinct](#distince)

# Installation
```bash
npm i --save iterable-range
```

# Usage
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

const r2 = range(10, -10, -5);

[...r2]              // [10, 5, 0, -5]
[...r2.reverse()]    // [-5, 0, 5, 10]
```

### Replay-ability
An iterable range can be re-ran an infinite number of times, producing the same values each time.  A normal iterator will only be able to be ran once, producing the *done* for any subsequent runs after the first.  A range will
just re-run as if it was just initialized.
```javascript
import range from 'iterable-range';

const r = range(0, 100, 20);
[...r] // [0, 20, 40, 60, 80];
[...r] // [0, 20, 40, 60, 80];
...
...
[...r] // You get the idea
```

### Import using CommonJS
```javascript
// For commonjs (for now)
const range = require('iterable-range').default
const { concat, zip, distinct } = require('iterable-range');
```

# Methods
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
**Parameters: *takeUntilFn*** - A function that indicates when the range iterator should stop producing values.  

If takeUntilFn returns *truthy* for any value then the range iterator will disregard that value and stop producing values.  

**Note** No matter where the .takeUntil method is called, it will be applied after all transforms have been applied to any value.

```javascript
const r = range(1, 10);

[...r.takeUntil(val => val > 6)] // [1, 2, 3, 4, 5, 6]
[...r.takeUntil(val => val === 25).map(val =>  val * val)] // [1, 4, 9, 16]

```


### contains
**Parameters: *num*** - Number to check whether it will be produced by the base range iterable.  

contains will produce true or false if the given num is going to be produced by the initially created range (the range that has not had any other method applied to it).  This is done in constant *O(1)* time and does not iterate over the produced range, or store anything in another data structure in order to determine if the value will be produced

```javascript
const r1 = range(10);
r1.contains(3)  // true
r1.contains(10) // false

const r2 = range(-10);
r2.contains(-3)  // true
r2.contains(-10) // false
r2.contains(3)   // false

const r3 = range(-10, 10, 5);
r3.contains(-10)  // true
r3.contains(-8)   // false
r3.contains(0)    // true
r3.contains(10)   // false

```


### length
Returns the number of values that will be produced by the base range iterable.  Calling length will return the number of items that will be produced.  This is done in constant *O(1)* time and does not iterate over the values, or store them in another data structure to determine the length

```javascript
const r1 = range(1, 10);
r1.length()  // 9

const r2 = range(10);
r2.length()  // 10

const r3 = range(1, 20, 2);
r3.length()  // 10

const r4 = range(-10, -32, -3);
r4.length()  // 8

const r5 = range(1, Infinity);
r5.length()  // Infinity

```

# Operators
Operators are added utility methods that may or may not be restricted to usage with iterable ranges.

### concat
**Parameters: *...Iterable(s)*** -  Any number of iterables.  
**Throws: *TypeError*** - If any given argument is not an iterable.  
 
concat returns an iterable that will produce values from each iterator.  The values produced will be from only one iterable at a time, until it has been exhausted.  The ordering will be in the same order that the iterables are provided  

```javascript
import range, { concat } from 'iterable-range';

const r1 = range(0, 10, 2);
const r2 = range(8, -1, -2);

[...concat(r1, r2)]  // [0, 2, 4, 6, 8, 8, 6, 4, 2, 0]


const iter1 = 'hello ';
const iter2 = 'world';

[...concat(iter1, iter2)] // ['h', 'e', 'l', 'l'. 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

```


### zip
**Parameters: *...Iterable(s)*** - Any number of iterable(s).  
**Throws: *TypeError*** - If any given argument is not an iterable.  

zip returns an iterable that will produce the interleaved values of the provided iterables.  It will produce its values from the iterables in the order that they are passed into the function.  It will continue to produce values until all given iterables have exhausted there values.

**Note** The iterable returned by the zip function will only produce values one time.  Any subsequent call after the initial call will return *{ done: true }*
**Note** Any iterables passed in that are not *replay-able* will also be exhausted

```javascript
import range, { zip } from 'iterable-range';

const r1 = range(1, 10, 2);
const r2 = range(1, 20, 4);

[...zip(r1, r2)] // [1, 1, 3, 5, 5, 9, 7, 13, 9, 17]

const i1 = [1, 2, 3, 4];
const i2 = [4, 3, 2, 1];

[...zip(i1, i2)] // [1, 4, 2, 3, 3, 2, 4, 1];

const i3 = [1, 2, 3, 4, 6, 6, 6];

[...zip(i3, i2)] // [1, 4, 2, 3, 3, 2, 4, 1, 6, 6, 6];

```

### distinct
**Parameters: *Iterable*** - Any item that implements the iterable protocol  
**Throws: *TypeError*** - If parameter does not implement the iterable protocol  

distinct returns an iterable that will produce only unique values.  Any duplicates found in the given iterable will only be returned once, all others will be discarded.

**Note** distinct will exhaust any non-replayable iterable that is operated on.  
**Note** distinct uses a Set internally and could potentially use memory-space O(m) (m = total number of produced values)

```javascript
import range, { zip, distinct } from 'iterable-range';

const r1 = range(1, 20, 2);
const r2 = range(1, 20, 4);
const z = zip(r1, r2);

[...distinct(z)] // [1, 3, 5, 9, 7, 13, 17, 11, 15, 19]

[...distinct('Hello World!')] // ['H', 'e', 'l', 'o', ' ', 'W', 'r', 'd', '!']

```