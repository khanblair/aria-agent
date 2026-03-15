import { APIInfo } from './python';

export const JavaScriptAPIList: APIInfo[] = [
  {
    title: 'Array.prototype.map()',
    description: 'Creates a new array populated with the results of calling a provided function on every element in the calling array.',
    signature: 'map(callbackFn, thisArg)',
    parameters: [
      { name: 'callbackFn', description: 'Function that is called for every element of arr.' },
      { name: 'thisArg', description: 'Value to use as this when executing callbackFn.', optional: true },
    ],
    returnType: 'A new array with each element being the result of the callback function.',
    example: 'const array1 = [1, 4, 9, 16];\nconst map1 = array1.map((x) => x * 2);\nconsole.log(map1); // [2, 8, 18, 32]',
    category: 'builtins',
  },
  {
    title: 'Array.prototype.filter()',
    description: 'Creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.',
    signature: 'filter(callbackFn, thisArg)',
    parameters: [
      { name: 'callbackFn', description: 'Function to test each element of the array. Return true to keep the element.' },
      { name: 'thisArg', description: 'Value to use as this when executing callbackFn.', optional: true },
    ],
    returnType: 'A shallow copy of a portion of the given array that pass the test.',
    example: 'const words = ["spray", "limit", "elite", "exuberant"];\nconst result = words.filter((word) => word.length > 6);\nconsole.log(result); // ["exuberant"]',
    category: 'builtins',
  },
  {
    title: 'Array.prototype.reduce()',
    description: 'Executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element.',
    signature: 'reduce(callbackFn, initialValue)',
    parameters: [
      { name: 'callbackFn', description: 'A function to execute for each element in the array.' },
      { name: 'initialValue', description: 'A value to which accumulator is initialized the first time the callback is called.', optional: true },
    ],
    returnType: 'The value that results from running the "reducer" callback function to completion over the entire array.',
    example: 'const array1 = [1, 2, 3, 4];\nconst initialValue = 0;\nconst sumWithInitial = array1.reduce((acc, curr) => acc + curr, initialValue);\nconsole.log(sumWithInitial); // 10',
    category: 'builtins',
  },
  {
    title: 'Object.keys()',
    description: 'Returns an array of a given object\'s own enumerable string-keyed property names.',
    signature: 'Object.keys(obj)',
    parameters: [{ name: 'obj', description: 'The object of which the enumerable own properties are to be returned.' }],
    returnType: 'An array of strings that represent all the enumerable properties of the given object.',
    example: 'const object1 = { a: "somestring", b: 42 };\nconsole.log(Object.keys(object1)); // ["a", "b"]',
    category: 'builtins',
  },
  {
    title: 'Object.values()',
    description: 'Returns an array of a given object\'s own enumerable string-keyed property values.',
    signature: 'Object.values(obj)',
    parameters: [{ name: 'obj', description: 'An object.' }],
    returnType: 'An array containing the given object\'s own enumerable string-keyed property values.',
    example: 'const object1 = { a: "somestring", b: 42 };\nconsole.log(Object.values(object1)); // ["somestring", 42]',
    category: 'builtins',
  },
  {
    title: 'Object.assign()',
    description: 'Copies all enumerable own properties from one or more source objects to a target object.',
    signature: 'Object.assign(target, ...sources)',
    parameters: [
      { name: 'target', description: 'The target object.' },
      { name: 'sources', description: 'The source object(s).' },
    ],
    returnType: 'The target object.',
    example: 'const target = { a: 1 };\nconst source = { b: 2 };\nObject.assign(target, source);\nconsole.log(target); // { a: 1, b: 2 }',
    category: 'builtins',
  },
  {
    title: 'Promise.all()',
    description: 'Takes an iterable of promises as input and returns a single Promise that fulfills to an array of the fulfillment values.',
    signature: 'Promise.all(iterable)',
    parameters: [{ name: 'iterable', description: 'An iterable object, such as an Array, of promises.' }],
    returnType: 'A Promise that resolves to an array of the results of the input promises.',
    example: 'const p1 = Promise.resolve(3);\nconst p2 = 42;\nPromise.all([p1, p2]).then(values => console.log(values)); // [3, 42]',
    category: 'builtins',
  },
  {
    title: 'fetch()',
    description: 'Starts the process of fetching a resource from the network, returning a promise which is fulfilled once the response is available.',
    signature: 'fetch(resource, options)',
    parameters: [
      { name: 'resource', description: 'This defines the resource that you wish to fetch.' },
      { name: 'options', description: 'An object containing any custom settings that you want to apply to the request.', optional: true },
    ],
    returnType: 'A Promise that resolves to a Response object.',
    example: 'fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data));',
    category: 'builtins',
  },
];

export async function fetchJavaScriptAPIs(): Promise<APIInfo[]> {
  console.log('[Convex] Storing JavaScript APIs with status "learning"...');
  return JavaScriptAPIList;
}

export default {
  fetchDocs: fetchJavaScriptAPIs,
};