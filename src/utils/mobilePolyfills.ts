type PromiseWithResolvers<T> = {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: unknown) => void
}

type AtCapable<T> = T & {
  at?: (index: number) => unknown
}

type PromiseConstructorWithResolvers = PromiseConstructor & {
  withResolvers?: <T>() => PromiseWithResolvers<T>
}

const defineValue = <T extends object, K extends PropertyKey>(target: T, key: K, value: unknown) => {
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value,
  })
}

const arrayPrototype = Array.prototype as AtCapable<Array<unknown>>
const stringPrototype = String.prototype as AtCapable<String>
const promiseConstructor = Promise as PromiseConstructorWithResolvers

const at = function at<T>(this: ArrayLike<T>, index: number): T | undefined {
    const length = this.length >>> 0
    const relativeIndex = Math.trunc(index) || 0
    const resolvedIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex

    return resolvedIndex < 0 || resolvedIndex >= length ? undefined : this[resolvedIndex]
}

if (!arrayPrototype.at) {
  defineValue(Array.prototype, 'at', at)
}

if (!stringPrototype.at) {
  defineValue(String.prototype, 'at', function at(this: string, index: number): string | undefined {
    const value = String(this)
    const length = value.length >>> 0
    const relativeIndex = Math.trunc(index) || 0
    const resolvedIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex

    return resolvedIndex < 0 || resolvedIndex >= length ? undefined : value.charAt(resolvedIndex)
  })
}

const typedArrayConstructors = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
  typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
].filter((constructor): constructor is typeof Int8Array => constructor !== undefined)

typedArrayConstructors.forEach((typedArrayConstructor) => {
  if (!(typedArrayConstructor.prototype as AtCapable<object>).at) {
    defineValue(typedArrayConstructor.prototype, 'at', at)
  }
})

if (!promiseConstructor.withResolvers) {
  defineValue(Promise, 'withResolvers', function withResolvers<T>(): PromiseWithResolvers<T> {
    let resolve!: PromiseWithResolvers<T>['resolve']
    let reject!: PromiseWithResolvers<T>['reject']
    const promise = new Promise<T>((promiseResolve, promiseReject) => {
      resolve = promiseResolve
      reject = promiseReject
    })

    return { promise, resolve, reject }
  })
}

// Polyfill for Symbol.iterator to fix mobile Safari for...of loop issues
if (typeof Symbol !== 'undefined' && !Array.prototype[Symbol.iterator]) {
  defineValue(Array.prototype, Symbol.iterator, function (this: unknown[]) {
    let index = 0
    const array = this
    return {
      next: function () {
        return {
          value: array[index],
          done: index++ >= array.length
        }
      }
    }
  })
}

// Polyfill for TypedArray Symbol.iterator (for Uint8Array, etc. used by PDF.js)
typedArrayConstructors.forEach((typedArrayConstructor) => {
  if (typeof Symbol !== 'undefined' && !(typedArrayConstructor.prototype as ArrayLike<number> & Iterable<number>)[Symbol.iterator]) {
    defineValue(typedArrayConstructor.prototype, Symbol.iterator, function (this: ArrayLike<number>) {
      let index = 0
      const array = this
      return {
        next: function () {
          return {
            value: array[index],
            done: index++ >= array.length
          }
        }
      }
    })
  }
})
