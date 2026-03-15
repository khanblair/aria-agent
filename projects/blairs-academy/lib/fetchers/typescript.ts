import { callAI } from '../api';
import { APIInfo } from './python';

export const TypeScriptAPIList: APIInfo[] = [
  {
    title: 'Pick<T, K>',
    description: 'Constructs a type by picking the set of properties K from T.',
    signature: 'type Pick<T, K extends keyof T> = { [P in K]: T[P]; }',
    parameters: [
      { name: 'T', description: 'The source type.' },
      { name: 'K', description: 'The keys to pick from T.' },
    ],
    returnType: 'A new type consisting of picked properties.',
    example: 'interface Todo { title: string; completed: boolean; }\ntype TodoPreview = Pick<Todo, "title">;',
    category: 'builtins',
  },
  {
    title: 'Omit<T, K>',
    description: 'Constructs a type by picking all properties from T and then removing K.',
    signature: 'type Omit<T, K extends keyof any> = { [P in Exclude<keyof T, K>]: T[P]; }',
    parameters: [
      { name: 'T', description: 'The source type.' },
      { name: 'K', description: 'The keys to omit from T.' },
    ],
    returnType: 'A new type with the specified properties removed.',
    example: 'interface Todo {\n  title: string;\n  description: string;\n  completed: boolean;\n  createdAt: number;\n}\n\ntype TodoInfo = Omit<Todo, "completed" | "createdAt">;\n\nconst todoInfo: TodoInfo = {\n  title: "Pick up kids",\n  description: "Kindergarten closes at 5pm",\n};',
    category: 'builtins',
  },
  {
    title: 'Partial<T>',
    description: 'Constructs a type with all properties of T set to optional. This utility will return a type that represents all subsets of a given type.',
    signature: 'type Partial<T> = { [P in keyof T]?: T[P]; }',
    parameters: [
      { name: 'T', description: 'The source type.' },
    ],
    returnType: 'A new type with all properties of T marked as optional.',
    example: 'interface Todo {\n  title: string;\n  description: string;\n}\n\nfunction updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {\n  return { ...todo, ...fieldsToUpdate };\n}\n\nconst todo1 = {\n  title: "organize desk",\n  description: "clear clutter",\n};\n\nconst todo2 = updateTodo(todo1, {\n  description: "throw out trash",\n});',
    category: 'builtins',
  },
  {
    title: 'Record<K, T>',
    description: 'Constructs an object type whose property keys are K and whose property values are T. This utility can be used to map the properties of a type to another type.',
    signature: 'type Record<K extends keyof any, T> = { [P in K]: T; }',
    parameters: [
      { name: 'K', description: 'The type of the keys.' },
      { name: 'T', description: 'The type of the values.' },
    ],
    returnType: 'An object type with keys K and values T.',
    example: 'interface CatInfo { age: number; breed: string; }\ntype CatName = "miffy" | "boris";\nconst cats: Record<CatName, CatInfo> = {\n  miffy: { age: 10, breed: "Persian" },\n  boris: { age: 5, breed: "Maine Coon" },\n};',
    category: 'builtins',
  },
  {
    title: 'Awaited<T>',
    description: 'This type is meant to model operations like await in async functions, or the .then() method on Promises - specifically, the way that they recursively unwrap Promises.',
    signature: 'type Awaited<T> = T extends null | undefined ? T : T extends object & { then(onfulfilled: infer F, ...args: any): any } ? F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never : T;',
    parameters: [
      { name: 'T', description: 'The type to be unwrapped.' },
    ],
    returnType: 'The unwrapped "awaited" type.',
    example: 'type A = Awaited<Promise<string>>; // string\ntype B = Awaited<Promise<Promise<number>>>; // number',
    category: 'builtins',
  },
];

export async function fetchTypeScriptAPIs(): Promise<APIInfo[]> {
  console.log('[Convex] Storing TypeScript APIs with status "learning"...');
  return TypeScriptAPIList;
}

export default {
  fetchDocs: fetchTypeScriptAPIs,
};