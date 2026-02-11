import { z } from 'zod';

export const narrationMetaSchema = z.object({
  theme: z.string(),
  chapter: z.number(),
  sub_chapter: z.number(),
  scene_type: z.string(),
  mood: z.string(),
});

export const narrationChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  consequence_preview: z.string(),
  is_premium: z.boolean(),
  consequence_type: z.string(),
});

export const narrationResponseSchema = z.object({
  meta: narrationMetaSchema,
  story_state_summary: z.string(),
  scene_title: z.string(),
  scene_description: z.string(),
  narrative: z.string(),
  choices: z.array(narrationChoiceSchema).min(3).max(4),
  tech_notes: z.string(),
});

// Transform snake_case AI response to camelCase for TypeScript
export function transformNarrationResponse(raw: z.infer<typeof narrationResponseSchema>) {
  return {
    meta: {
      theme: raw.meta.theme,
      chapter: raw.meta.chapter,
      subChapter: raw.meta.sub_chapter,
      sceneType: raw.meta.scene_type,
      mood: raw.meta.mood,
    },
    storyStateSummary: raw.story_state_summary,
    sceneTitle: raw.scene_title,
    sceneDescription: raw.scene_description,
    narrative: raw.narrative,
    choices: raw.choices.map((c) => ({
      id: c.id,
      label: c.label,
      consequencePreview: c.consequence_preview,
      isPremium: c.is_premium,
      consequenceType: c.consequence_type,
    })),
    techNotes: raw.tech_notes,
  };
}
