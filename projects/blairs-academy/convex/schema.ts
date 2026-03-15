import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  docs_cache: defineTable({
    language: v.string(),
    category: v.string(),
    endpoint: v.string(),
    title: v.string(),
    content: v.string(),
    example: v.string(),
    status: v.union(v.literal('learning'), v.literal('learned')),
    priority: v.number(),
    fetchedAt: v.string(),
  })
    .index('byLanguage', ['language'])
    .index('byStatus', ['status']),

  language_metadata: defineTable({
    language: v.string(),
    displayName: v.string(),
    icon: v.string(),
    color: v.string(),
    totalLearned: v.number(),
    totalAvailable: v.number(),
    status: v.union(v.literal('not_started'), v.literal('in_progress'), v.literal('completed')),
    lastLearnedAt: v.string(),
  }).index('byLanguage', ['language']),
});