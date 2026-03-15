import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // -----------------------------------------------------------------
  // Docs cache – stores the actual documentation entries.
  // -----------------------------------------------------------------
  docs_cache: defineTable({
    language: v.string(),
    endpoint: v.string(),
    title: v.string(),
    content: v.string(),
    example: v.string(),
    fetchedAt: v.string(),
    // Incremental‑learning fields
    status: v.union(v.literal('learning'), v.literal('learned')),
    priority: v.int(),
  })
    .index('byLanguage', ['language'])
    .index('byStatus', ['status']),

  // -----------------------------------------------------------------
  // Language metadata – tracks overall learning progress.
  // -----------------------------------------------------------------
  language_metadata: defineTable({
    language: v.string(),
    displayName: v.string(),
    icon: v.string(),
    color: v.string(),
    totalLearned: v.int(),
    totalAvailable: v.int(),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('completed')
    ),
    lastLearnedAt: v.string(),
  }).index('byLanguage', ['language']),
});