import { callAI } from '@/lib/api';

export default {
  async fetchDocs() {
    // Placeholder – real implementation will call the official Python docs API
    const response = await callAI('python-docs-endpoint');
    return response;
  },
};