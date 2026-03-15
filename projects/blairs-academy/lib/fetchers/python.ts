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
    title: 'print',
    description: 'Print objects to the standard output stream.',
    signature: 'print(*objects, sep=" ", end="\\n", file=sys.stdout, flush=False) -> None',
    parameters: [
      { name: '*objects', description: 'One or more objects to be printed.' },
      { name: 'sep', description: 'String inserted between values, default a space.', optional: true },
      { name: 'end', description: 'String appended after the last value, default a newline.', optional: true },
      { name: 'file', description: 'A file‑like object (stream); defaults to sys.stdout.', optional: true },
      { name: 'flush', description: 'Whether to forcibly flush the stream.', optional: true },
    ],
    returnType: 'None',
    example: `print("Hello, world!")\nprint("A", "B", "C", sep="-")`,
    category: 'builtins',
  },
  {
    title: 'len',
    description: 'Return the number of items in a container.',
    signature: 'len(s) -> int',
    parameters: [{ name: 's', description: 'A sequence, collection or iterator.' }],
    returnType: 'int',
    example: `my_list = [1, 2, 3]\nprint(len(my_list))  # 3`,
    category: 'builtins',
  },
  {
    title: 'range',
    description: 'Generate an immutable sequence of numbers.',
    signature: 'range(stop) | range(start, stop[, step]) -> range object',
    parameters: [
      { name: 'start', description: 'First value of the sequence.', optional: true },
      { name: 'stop', description: 'Generate numbers up to, but not including, this value.' },
      { name: 'step', description: 'Difference between each number.', optional: true },
    ],
    returnType: 'range object',
    example: `for i in range(5):\n    print(i)\n# 0 1 2 3 4`,
    category: 'builtins',
  },
  {
    title: 'enumerate',
    description: 'Return an iterator that yields pairs (index, item).',
    signature: 'enumerate(iterable, start=0) -> iterator',
    parameters: [
      { name: 'iterable', description: 'Any iterable object.' },
      { name: 'start', description: 'Starting index of the enumeration.', optional: true },
    ],
    returnType: 'iterator of (int, element) tuples',
    example: `fruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits, start=1):\n    print(i, fruit)`,
    category: 'builtins',
  },
  {
    title: 'zip',
    description: 'Aggregate elements from each of the iterables.',
    signature: 'zip(*iterables) -> iterator of tuples',
    parameters: [{ name: '*iterables', description: 'One or more iterable objects.' }],
    returnType: 'iterator of tuples',
    example: `names = ["Alice", "Bob"]\nages = [25, 30]\nfor name, age in zip(names, ages):\n    print(name, age)`,
    category: 'builtins',
  },
  {
    title: 'os',
    description: 'Miscellaneous operating system interfaces.',
    signature: 'module os',
    parameters: [],
    returnType: 'module',
    example: `import os\nprint(os.getcwd())  # current working directory`,
    category: 'stdlib',
  },
  {
    title: 'sys',
    description: 'System-specific parameters and functions.',
    signature: 'module sys',
    parameters: [],
    returnType: 'module',
    example: `import sys\nprint(sys.version)`,
    category: 'stdlib',
  },
  {
    title: 'json',
    description: 'Encode and decode JSON data.',
    signature: 'module json',
    parameters: [],
    returnType: 'module',
    example: `import json\ndata = {"name": "Bob", "age": 30}\njson_str = json.dumps(data)\nprint(json_str)`,
    category: 'stdlib',
  },
  {
    title: 'collections',
    description: 'Container datatypes providing alternatives to Python’s general‑purpose built‑ins.',
    signature: 'module collections',
    parameters: [],
    returnType: 'module',
    example: `from collections import Counter\ncnt = Counter("abracadabra")\nprint(cnt)`,
    category: 'stdlib',
  },
  {
    title: 'itertools',
    description: 'Functions creating iterators for efficient looping.',
    signature: 'module itertools',
    parameters: [],
    returnType: 'module',
    example: `import itertools\nfor combo in itertools.combinations([1,2,3], 2):\n    print(combo)`,
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