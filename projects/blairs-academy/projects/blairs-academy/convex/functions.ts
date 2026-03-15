import { query, mutation } from 'convex/server';
import { v } from 'convex/values';
import { docs_cache, language_metadata } from './schema';

// -----------------------------------------------------------------
// Queries
// -----------------------------------------------------------------
export const getByLanguage = query({
  args: { language: v.string() },
  handler: async (ctx, { language }) => {
    const docs = await ctx.db
      .query('docs_cache')
      .filter((q) => q.eq(q.field('language'), language))
      .collect();
    return docs;
  },
});

export const getAllByLanguage = query({
  args: { language: v.string() },
  handler: async (ctx, { language }) => {
    return await ctx.db
      .query('docs_cache')
      .filter((q) => q.eq(q.field('language'), language))
      .collect();
  },
});

export const getLanguageMeta = query({
  args: { language: v.string() },
  handler: async (ctx, { language }) => {
    return await ctx.db
      .query('language_metadata')
      .filter((q) => q.eq(q.field('language'), language))
      .first();
  },
});

// -----------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------
export const upsert = mutation({
  args: {
    language: v.string(),
    endpoint: v.string(),
    title: v.string(),
    content: v.string(),
    example: v.string(),
    fetchedAt: v.string(),
    status: v.optional(v.union(v.literal('learning'), v.literal('learned'))),
    priority: v.optional(v.int()),
  },
  handler: async (ctx, args) => {
    // If a doc with same language+endpoint exists, update it; otherwise insert.
    const existing = await ctx.db
      .query('docs_cache')
      .filter((q) =>
        q.and(
          q.eq(q.field('language'), args.language),
          q.eq(q.field('endpoint'), args.endpoint)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        example: args.example,
        fetchedAt: args.fetchedAt,
        status: args.status ?? existing.status,
        priority: args.priority ?? existing.priority,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert('docs_cache', {
        language: args.language,
        endpoint: args.endpoint,
        title: args.title,
        content: args.content,
        example: args.example,
        fetchedAt: args.fetchedAt,
        status: args.status ?? 'learning',
        priority: args.priority ?? 1,
      });
      return id;
    }
  },
});

export const updateLanguageMeta = mutation({
  args: {
    language: v.string(),
    totalLearned: v.int(),
    totalAvailable: v.int(),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('completed')
    ),
    lastLearnedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('language_metadata')
      .filter((q) => q.eq(q.field('language'), args.language))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalLearned: args.totalLearned,
        totalAvailable: args.totalAvailable,
        status: args.status,
        lastLearnedAt: args.lastLearnedAt,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert('language_metadata', {
        language: args.language,
        displayName: args.language,
        icon: '',
        color: '',
        totalLearned: args.totalLearned,
        totalAvailable: args.totalAvailable,
        status: args.status,
        lastLearnedAt: args.lastLearnedAt,
      });
      return id;
    }
  },
});