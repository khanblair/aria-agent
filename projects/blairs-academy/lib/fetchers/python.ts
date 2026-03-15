export type Parameter = {
  name: string;
  description: string;
  optional?: boolean;
};

export type APIInfo = {
  /** Human readable title – also used for the URL slug */
  title: string;
  /** Short description shown on the overview grid */
  description: string;
  /** Full function / class signature (as a string) */
  signature: string;
  /** List of parameters */
  parameters: Parameter[];
  /** Return type description */
  returnType: string;
  /** Ready‑to‑copy example code */
  example: string;
  /** Category – helps with future filtering (builtins, stdlib, etc.) */
  category: 'builtins' | 'stdlib';
};

/**
 * In a real implementation this would call an external API (e.g. docs.python.org)
 * and store the result in Convex with status = "learning".
 *
 * For the purpose of this incremental‑learning step we ship a static list.
 */
export const PythonAPIList: APIInfo[] = [
  {
    title: 'abs',
    description: 'Return the absolute value of a number. The argument may be an integer, a floating point number, or an object implementing __abs__().',
    signature: 'abs(x)',
    parameters: [{ name: 'x', description: 'A number or an object implementing __abs__().' }],
    returnType: 'number',
    example: 'print(abs(-5))  # 5\nprint(abs(3.14))  # 3.14',
    category: 'builtins',
  },
  {
    title: 'all',
    description: 'Return True if all elements of the iterable are true (or if the iterable is empty).',
    signature: 'all(iterable)',
    parameters: [{ name: 'iterable', description: 'An iterable object (e.g., list, tuple, set).' }],
    returnType: 'bool',
    example: 'print(all([True, True, False]))  # False\nprint(all([1, 2, 3]))  # True\nprint(all([]))  # True',
    category: 'builtins',
  },
  {
    title: 'any',
    description: 'Return True if any element of the iterable is true. If the iterable is empty, return False.',
    signature: 'any(iterable)',
    parameters: [{ name: 'iterable', description: 'An iterable object.' }],
    returnType: 'bool',
    example: 'print(any([False, False, True]))  # True\nprint(any([0, 0, 0]))  # False\nprint(any([]))  # False',
    category: 'builtins',
  },
  {
    title: 'print',
    description: 'Print objects to the text stream file, separated by sep and followed by end.',
    signature: 'print(*objects, sep=" ", end="\\n", file=sys.stdout, flush=False)',
    parameters: [
      { name: '*objects', description: 'Objects to be printed.' },
      { name: 'sep', description: 'String inserted between values, default is space.', optional: true },
      { name: 'end', description: 'String appended after the last value, default is newline.', optional: true },
    ],
    returnType: 'None',
    example: 'print("Hello", "World", sep="-")\n# Hello-World',
    category: 'builtins',
  },
  {
    title: 'len',
    description: 'Return the length (the number of items) of an object.',
    signature: 'len(s)',
    parameters: [{ name: 's', description: 'An object like string, list, tuple, etc.' }],
    returnType: 'int',
    example: 'print(len("Python"))  # 6\nprint(len([1, 2, 3]))  # 3',
    category: 'builtins',
  },
  {
    title: 'range',
    description: 'Returns an immutable sequence of numbers, commonly used for looping a specific number of times in for loops.',
    signature: 'range(stop) | range(start, stop[, step])',
    parameters: [
      { name: 'start', description: 'Starting value (inclusive).', optional: true },
      { name: 'stop', description: 'Ending value (exclusive).' },
      { name: 'step', description: 'Difference between numbers.', optional: true },
    ],
    returnType: 'range object',
    example: 'for i in range(3):\n    print(i)\n# 0\n# 1\n# 2',
    category: 'builtins',
  },
  {
    title: 'enumerate',
    description: 'Returns an enumerate object. It allows you to loop over something and have an automatic counter.',
    signature: 'enumerate(iterable, start=0)',
    parameters: [
      { name: 'iterable', description: 'Any iterable object.' },
      { name: 'start', description: 'The index to start counting from.', optional: true },
    ],
    returnType: 'enumerate object',
    example: 'fruits = ["apple", "banana"]\nfor i, fruit in enumerate(fruits):\n    print(i, fruit)\n# 0 apple\n# 1 banana',
    category: 'builtins',
  },
  {
    title: 'zip',
    description: 'Iterates over several iterables in parallel, producing tuples with an item from each one.',
    signature: 'zip(*iterables, strict=False)',
    parameters: [
      { name: '*iterables', description: 'Any number of iterables.' },
      { name: 'strict', description: 'If True, all iterables must have the same length.', optional: true },
    ],
    returnType: 'iterator of tuples',
    example: 'names = ["A", "B"]\nages = [10, 20]\nfor n, a in zip(names, ages):\n    print(n, a)\n# A 10\n# B 20',
    category: 'builtins',
  },
  {
    title: 'json.dumps',
    description: 'Serialize obj to a JSON formatted str.',
    signature: 'json.dumps(obj, *, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)',
    parameters: [
      { name: 'obj', description: 'The object to serialize.' },
      { name: 'indent', description: 'Indentation for pretty printing.', optional: true },
      { name: 'sort_keys', description: 'Whether to sort keys of dictionaries.', optional: true },
    ],
    returnType: 'str',
    example: 'import json\nd = {"a": 1, "b": 2}\nprint(json.dumps(d, indent=2))\n# {\n#   "a": 1,\n#   "b": 2\n# }',
    category: 'stdlib',
  },
  {
    title: 'os.path.join',
    description: 'Join one or more path components intelligently.',
    signature: 'os.path.join(path, *paths)',
    parameters: [
      { name: 'path', description: 'The base path.' },
      { name: '*paths', description: 'Additional path components.' },
    ],
    returnType: 'str',
    example: 'import os\nfull_path = os.path.join("v1", "api", "docs")\nprint(full_path)  # v1/api/docs (on Unix)',
    category: 'stdlib',
  },
];

/**
 * Mock fetcher – in production you would replace this with a real HTTP request.
 * The function also writes the data to Convex (mocked here with a console.log).
 */
export async function fetchPythonAPIs(): Promise<APIInfo[]> {
  // Simulate a Convex write (status = "learning")
  // In the real app you would do:
  // await convex.mutation('docs_cache/insert', { language: 'python', ... })
  console.log('[Convex] Storing 10 Python APIs with status "learning"...');

  // Return the static list for the UI to consume
  return PythonAPIList;
}

export default {
  fetchDocs: fetchPythonAPIs,
};