import { APIInfo } from './python';

export const GoAPIList: APIInfo[] = [
  {
    title: 'fmt.Println',
    description: 'Formats using the default formats for its operands and writes to standard output. Spaces are always added between operands and a newline is appended.',
    signature: 'func Println(a ...any) (n int, err error)',
    parameters: [{ name: 'a', description: 'The values to be printed.' }],
    returnType: 'Returns the number of bytes written and any write error encountered.',
    example: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, Go!")\n}',
    category: 'builtins',
  },
  {
    title: 'fmt.Printf',
    description: 'Formats according to a format specifier and writes to standard output. It returns the number of bytes written and any write error encountered.',
    signature: 'func Printf(format string, a ...any) (n int, err error)',
    parameters: [
      { name: 'format', description: 'The format string.' },
      { name: 'a', description: 'The values to be formatted.' },
    ],
    returnType: 'int, error',
    example: 'fmt.Printf("Hello, %s!\\n", "Go")',
    category: 'builtins',
  },
  {
    title: 'make',
    description: 'Allocates and initializes an object of type slice, map, or chan (only).',
    signature: 'func make(t Type, size ...IntegerType) Type',
    parameters: [
      { name: 't', description: 'The type to allocate.' },
      { name: 'size', description: 'The size/capacity.', optional: true },
    ],
    returnType: 'The initialized object.',
    example: 's := make([]int, 0, 10)\nm := make(map[string]int)',
    category: 'builtins',
  },
  {
    title: 'append',
    description: 'Appends elements to the end of a slice. If it has sufficient capacity, the destination is resliced to accommodate the new elements. If it does not, a new underlying array will be allocated.',
    signature: 'func append(slice []Type, elems ...Type) []Type',
    parameters: [
      { name: 'slice', description: 'The slice to append to.' },
      { name: 'elems', description: 'The elements to append.' },
    ],
    returnType: 'The updated slice.',
    example: 's := []int{1, 2}\ns = append(s, 3, 4)\nfmt.Println(s) // [1 2 3 4]',
    category: 'builtins',
  },
  {
    title: 'len',
    description: 'Returns the length of v, according to its type (array, slice, map, channel, or string).',
    signature: 'func len(v Type) int',
    parameters: [{ name: 'v', description: 'The object to check the length of.' }],
    returnType: 'int',
    example: 's := "Hello"\nfmt.Println(len(s)) // 5',
    category: 'builtins',
  },
  {
    title: 'http.Get',
    description: 'Issues a GET to the specified URL.',
    signature: 'func Get(url string) (resp *Response, err error)',
    parameters: [{ name: 'url', description: 'The URL to make the GET request to.' }],
    returnType: '(*Response, error)',
    example: 'resp, err := http.Get("http://example.com/")\nif err != nil {\n\tlog.Fatal(err)\n}\ndefer resp.Body.Close()',
    category: 'builtins',
  },
  {
    title: 'os.Getenv',
    description: 'Retrieves the value of the environment variable named by the key.',
    signature: 'func Getenv(key string) string',
    parameters: [{ name: 'key', description: 'The environment variable key.' }],
    returnType: 'string',
    example: 'path := os.Getenv("PATH")\nfmt.Println(path)',
    category: 'builtins',
  },
];

export async function fetchGoAPIs(): Promise<APIInfo[]> {
  console.log('[Convex] Storing Go APIs with status "learning"...');
  return GoAPIList;
}

export default {
  fetchDocs: fetchGoAPIs,
};