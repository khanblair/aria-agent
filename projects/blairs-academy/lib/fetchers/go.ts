import { callAI } from '@/lib/api';

export default {
  async fetchDocs() {
    // Placeholder – real implementation will call the official Go docs API
    const response = await callAI('go-docs-endpoint');
    return response;
  },
};