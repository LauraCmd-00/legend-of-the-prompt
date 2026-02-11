export const CHAPTER_ARCS = [
  {
    chapter: 1,
    titleKey: 'chapters.1.title',
    arc: 'introduction',
    description: 'The hero begins their journey. Establish the world, introduce a mentor figure, first minor conflict.',
    subChapters: [
      { sub: 1, focus: 'awakening', description: 'The hero discovers something unusual about their world.' },
      { sub: 2, focus: 'first_encounter', description: 'A minor threat appears; tutorial-like combat introduction.' },
      { sub: 3, focus: 'call_to_action', description: 'A larger threat is revealed; the hero must commit to the journey.' },
    ],
  },
  {
    chapter: 2,
    titleKey: 'chapters.2.title',
    arc: 'rising_action',
    description: 'The hero faces growing challenges, gains allies or rivals, explores new areas.',
    subChapters: [
      { sub: 1, focus: 'new_territory', description: 'Entering unfamiliar lands with new dangers.' },
      { sub: 2, focus: 'ally_or_rival', description: 'Meeting a significant NPC who helps or hinders.' },
      { sub: 3, focus: 'first_trial', description: "A significant test of the hero's abilities." },
    ],
  },
  {
    chapter: 3,
    titleKey: 'chapters.3.title',
    arc: 'midpoint',
    description: 'A major revelation changes the stakes. The hero must adapt.',
    subChapters: [
      { sub: 1, focus: 'revelation', description: 'A truth about the world or enemy is uncovered.' },
      { sub: 2, focus: 'setback', description: 'The hero suffers a significant defeat or loss.' },
      { sub: 3, focus: 'regrouping', description: 'Finding new strength or resources to continue.' },
    ],
  },
  {
    chapter: 4,
    titleKey: 'chapters.4.title',
    arc: 'climax_approach',
    description: 'The hero prepares for the final confrontation. Tensions at their peak.',
    subChapters: [
      { sub: 1, focus: 'gathering_strength', description: 'Acquiring the final tools or knowledge needed.' },
      { sub: 2, focus: 'dark_moment', description: 'The darkest hour before the final push.' },
      { sub: 3, focus: 'march_to_battle', description: 'Setting out for the final confrontation.' },
    ],
  },
  {
    chapter: 5,
    titleKey: 'chapters.5.title',
    arc: 'climax_resolution',
    description: 'The final battle and resolution of the story.',
    subChapters: [
      { sub: 1, focus: 'final_approach', description: 'Navigating the final challenges before the boss.' },
      { sub: 2, focus: 'boss_battle', description: 'The ultimate confrontation.' },
      { sub: 3, focus: 'resolution', description: "The aftermath and conclusion of the hero's story." },
    ],
  },
];
