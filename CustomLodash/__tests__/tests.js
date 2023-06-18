const assert = require('assert');
const arrays = require('../src/arrays.js');

describe("Array functions", () => {
    test("chunk should return chunks of array in requested size", () => {
      expect(arrays.chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
      expect(arrays.chunk(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
      expect(arrays.chunk([], 2)).toEqual([]);
      expect(arrays.chunk(['a', 'b', 'c', 'd'], 1.3)).toEqual([['a', 'b'], ['c', 'd']]);
    });

    test("compact should return an array with all falsey values removed", () => {
      expect(arrays.compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]);
      expect(arrays.compact([0, false, ''])).toEqual([]);
      expect(arrays.compact()).toEqual([]);
    });

    test("drop should return a slice of array with n elements dropped from the beginning", () => {
      expect(arrays.drop([1, 2, 3])).toEqual([2, 3]);
      expect(arrays.drop([0, 1, 2, 3], 3)).toEqual([3]);
      expect(arrays.drop()).toEqual([]);
    });

    test("take should create a slice of `array` with `n` elements taken from the beginning", () => {
      expect(arrays.take([1, 2, 3])).toEqual([1]);
      expect(arrays.take([1, 2, 3], 2)).toEqual([1, 2]);
      expect(arrays.take([1, 2, 3], 5)).toEqual([1, 2, 3]);
      expect(arrays.take([1, 2, 3], 0)).toEqual([]);
      expect(arrays.take([], 2)).toEqual([]);

    });

    test("dropWhile should return a slice of `array` excluding elements dropped from the beginning", () => {
      const  users = [
        { 'user': 'barney',  'active': false },
        { 'user': 'fred',    'active': false },
        { 'user': 'pebbles', 'active': true }
      ];

      expect(arrays.dropWhile(users, function(o) { return !o.active; })).toEqual([{ 'user': 'pebbles', 'active': true }]);

    });

    test("filter should iterate over elements of `array`, returning an array of all elements `predicate` returns truthy for", () => {
      const users = [
        { 'user': 'barney', 'age': 36, 'active': true },
        { 'user': 'fred',   'age': 40, 'active': false }
      ];

      expect(arrays.filter(users, function(o) { return !o.active; })).toEqual([{ 'user': 'fred',   'age': 40, 'active': false }]);
      expect(arrays.filter(users, ({ active }) => active)).toEqual([{ 'user': 'barney', 'age': 36, 'active': true }]);
    });

    test("includes should return true if value is in array", () => {
      expect(arrays.includes([1, 2, 3], 1)).toEqual(true);
      expect(arrays.includes([1, 2, 3], 4)).toEqual(false);
      expect(arrays.includes(['c', 'd', 'b'], 'a')).toEqual(false);
    });

    test("map should create an array of values by running each element in collection thruough `func`", () => {
      function square(n) {
        return n * n;
      }
      
      expect(arrays.map([4, 8], square)).toEqual([16, 64]);
    });

  });