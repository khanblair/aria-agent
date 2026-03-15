import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getByLanguage = query({
  args: { language: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('docs_cache')
      .withIndex('byLanguage', (q) => q.eq('language', args.language))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    language: v.string(),
    category: v.string(),
    endpoint: v.string(),
    title: v.string(),
    content: v.string(),
    example: v.string(),
    status: v.union(v.literal('learning'), v.literal('learned')),
    priority: v.number(),
    fetchedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('docs_cache')
      .withIndex('byLanguage', (q) => q.eq('language', args.language))
      .filter((q) => q.eq(q.field('endpoint'), args.endpoint))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert('docs_cache', args);
    }
  },
});

export const getMetadata = query({
  args: { language: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('language_metadata')
      .withIndex('byLanguage', (q) => q.eq('language', args.language))
      .unique();
  },
});

export const updateMetadata = mutation({
  args: {
    language: v.string(),
    displayName: v.string(),
    icon: v.string(),
    color: v.string(),
    totalLearned: v.number(),
    totalAvailable: v.number(),
    status: v.union(v.literal('not_started'), v.literal('in_progress'), v.literal('completed')),
    lastLearnedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('language_metadata')
      .withIndex('byLanguage', (q) => q.eq('language', args.language))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert('language_metadata', args);
    }
  },
});
