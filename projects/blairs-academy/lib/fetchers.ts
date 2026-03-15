import python from './fetchers/python';
import javascript from './fetchers/javascript';
import go from './fetchers/go';
import rust from './fetchers/rust';
import typescript from './fetchers/typescript';

export const fetchers = {
  python,
  javascript,
  go,
  rust,
  typescript,
};

export type Language = keyof typeof fetchers;

export default fetchers;