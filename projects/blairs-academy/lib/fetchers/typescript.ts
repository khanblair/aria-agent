import { callAI } from '@/lib/api';

export default {
  async fetchDocs() {
    // Placeholder – real implementation will call the official TypeScript docs API
    const response = await callAI('typescript-docs-endpoint');
    return response;
  },
};