import { callAI } from '@/lib/api';

export default {
  async fetchDocs() {
    // Placeholder – real implementation will call the official Rust docs API
    const response = await callAI('rust-docs-endpoint');
    return response;
  },
};