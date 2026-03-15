import { callAI } from '@/lib/api';

export default {
  async fetchDocs() {
    // Placeholder – real implementation will call the official JavaScript docs API
    const response = await callAI('javascript-docs-endpoint');
    return response;
  },
};