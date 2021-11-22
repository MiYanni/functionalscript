const { pipe } = require('../../func')
const mr = require('../../map-reduce')

/** 
 * @template T
 * @typedef {Promise<T>|T} PromiseOrValue
 */

/** 
 * @template T
 * @template R
 * @typedef {(f: (value: T) => PromiseOrValue<R>) => (c: AsyncIterable<T>) => AsyncIterable<R>} Map
 */

/** @type {<T, R>(f: (value: T) => PromiseOrValue<R>) => (c: AsyncIterable<T>) => AsyncIterable<R>} */
const map = f => c => ({
    async *[Symbol.asyncIterator]() {
        for await (const i of c) {
            yield f(i)
        }
    }
})

/** @type {<T>(c: AsyncIterable<AsyncIterable<T>>) => AsyncIterable<T>} */
const flatten = c => ({
    async *[Symbol.asyncIterator]() {
        for await (const i of c) {
            yield *i
        }
    }
})

/** @type {<T>(f: (value: T) => Promise<boolean>) => (c: AsyncIterable<T>) => AsyncIterable<T>} */
const filter = f => c => ({
    async *[Symbol.asyncIterator]() {
        for await (const i of c) {
            if (await f(i)) {
                yield i
            }
        }
    }
})

/** @type {<T, R>(f: (value: T) => AsyncIterable<R>) => (c: AsyncIterable<T>) => AsyncIterable<R>} */
const flatMap = f => pipe(map(f))(flatten)

/** 
 * @template A
 * @template T
 * @typedef {(accumulator: A) => (value: T) => PromiseOrValue<A>} Merge
 */

/** @type {<A, T>(merge: Merge<A, T>) => (init: A) => (c: AsyncIterable<T>) => Promise<A>} */
const reduce = merge => init => async c => {
    let result = init
    for await (const i of c) {
        result = await merge(result)(i)
    }
    return result
}

/** @type {<A, T>(merg: Merge<A, T>) => (init: A) => (c: AsyncIterable<T>) => AsyncIterable<A>} */
const exclusiveScan = merge => init => c => ({
    async *[Symbol.asyncIterator]() {
        let result = init
        for await (const i of c) {
            result = await merge(result)(i)
            yield result
        }
    }
})

/** @type {<A, T>(merge: Merge<A, T>) => (init: A) => (c: AsyncIterable<T>) => AsyncIterable<A>} */
const inclusiveScan = merge => init => c => ({
    async *[Symbol.asyncIterator]() {
        yield init
        yield* exclusiveScan(merge)(init)(c)
    }
})

/** @type {<T>(iterable: Iterable<T>) => AsyncIterable<T>} */
const cast = iterable => ({
    async *[Symbol.asyncIterator]() {
        for (const i of iterable) {
            yield i
        }
    }
})

/** @type {<I, S, R>(op: mr.Operation<I, S, R>) => (_: AsyncIterable<I>) => Promise<R>} */
const apply = ({ merge, init, result }) => async c => result(await reduce(merge)(init)(c))

const sum = apply(mr.sum)

const join = pipe(mr.join)(apply)

module.exports = {
    /** @readonly */
    apply,
    /** @readonly */
    cast,
    /** @readonly */
    map,
    /** @readonly */
    filter,
    /** @readonly */
    flatMap,
    /** @readonly */
    reduce,
    /** @readonly */
    sum,
    /** @readonly */
    join,
    /** @readonly */
    exclusiveScan,
    /** @readonly */
    inclusiveScan,
}