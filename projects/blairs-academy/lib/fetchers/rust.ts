import { APIInfo } from './python';

export const RustAPIList: APIInfo[] = [
  {
    title: 'println!',
    description: 'Prints to the standard output, with a newline. Use format strings for powerful formatting.',
    signature: 'println!("format string", arg1, arg2, ...)',
    parameters: [
      { name: 'format', description: 'The format string.' },
      { name: 'args', description: 'The values to format.', optional: true },
    ],
    returnType: '()',
    example: 'println!("Hello, {}!", "Rust");\nprintln!("Value: {:?}", (1, 2));',
    category: 'builtins',
  },
  {
    title: 'Vec::new',
    description: 'Constructs a new, empty Vec<T>. The vector will not allocate until elements are pushed onto it.',
    signature: 'pub const fn new() -> Vec<T>',
    parameters: [],
    returnType: 'A new, empty vector.',
    example: 'let mut v: Vec<i32> = Vec::new();\nv.push(1);\nv.push(2);',
    category: 'builtins',
  },
  {
    title: 'Option',
    description: 'The Option type represents an optional value: every Option is either Some and contains a value, or None, and does not.',
    signature: 'pub enum Option<T> { Some(T), None }',
    parameters: [
      { name: 'Some(T)', description: 'The variant representing the presence of a value.' },
      { name: 'None', description: 'The variant representing the absence of a value.' },
    ],
    returnType: 'An enum representing an optional value.',
    example: 'let x: Option<u32> = Some(2);\nlet y: Option<u32> = None;\n\nmatch x {\n    Some(val) => println!("Got value: {}", val),\n    None => println!("No value"),\n}',
    category: 'builtins',
  },
];

export async function fetchRustAPIs(): Promise<APIInfo[]> {
  console.log('[Convex] Storing Rust APIs with status "learning"...');
  return RustAPIList;
}

export default {
  fetchDocs: fetchRustAPIs,
};