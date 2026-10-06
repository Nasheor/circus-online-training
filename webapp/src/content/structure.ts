/**
 * Locale-neutral structure of the CIRCUS method: phases, decks and cards.
 * Texts live in src/content/locales/<locale>/ and are keyed by the ids defined
 * here, so translations can never drift in structure. Card ids are permanent:
 * saved workspaces refer to them.
 */

export const PHASE_IDS = ['p1', 'p2', 'p3'] as const;
export type PhaseId = (typeof PHASE_IDS)[number];

export const DECK_IDS = ['intro', 'p1', 'p2', 'p3', 'boost'] as const;
export type DeckId = (typeof DECK_IDS)[number];

export const TOOL_IDS = ['energy-profile', 'map', 'business-model'] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export const METHODOLOGY_IDS = ['persona', 'smart', 'peer-to-peer', 'stakeholder-mapping', 'action-planner'] as const;
export type MethodologyId = (typeof METHODOLOGY_IDS)[number];

export type CardCategory =
  | 'introduction' | 'packUp' | 'theEnd' | 'boost'
  | 'me' | 'neighbourhood' | 'we'
  | 'collectively' | 'experts' | 'inspiration'
  | 'keyGroup' | 'goal' | 'groupStructure' | 'partners' | 'conclusion' | 'longTerm' | 'resources'
  | 'tool';

export type CardKind = 'prompt' | 'tool' | 'info';

export interface CardDef {
  id: string;
  deck: DeckId;
  category: CardCategory;
  /** Number printed on the card; null for the unnumbered intro and outro cards. */
  number: number | null;
  kind: CardKind;
  toolId?: ToolId;
  methodologyId?: MethodologyId;
}

export interface PhaseDef {
  id: PhaseId;
  order: 1 | 2 | 3;
  slug: string;
  toolId: ToolId;
  toolCardId: string;
}

export const PHASES: readonly PhaseDef[] = [
  { id: 'p1', order: 1, slug: 'awareness', toolId: 'energy-profile', toolCardId: 'p1-12' },
  { id: 'p2', order: 2, slug: 'exploring', toolId: 'map', toolCardId: 'p2-6' },
  { id: 'p3', order: 3, slug: 'collaboration', toolId: 'business-model', toolCardId: 'p3-1' },
];

/** Page path of each tool, relative to the locale root. */
export const TOOL_PATHS: Record<ToolId, string> = {
  'energy-profile': 'tools/energy-profile',
  map: 'tools/map',
  'business-model': 'tools/business-model',
};

const TOOL_OF_PHASE: Record<PhaseId, ToolId> = { p1: 'energy-profile', p2: 'map', p3: 'business-model' };

const METHODOLOGY_CARDS: Record<string, MethodologyId> = {
  'p3-2': 'persona',
  'p3-8': 'smart',
  'p3-10': 'peer-to-peer',
  'p3-13': 'stakeholder-mapping',
  'p3-25': 'action-planner',
};

/** [category, first number, last number] in the order the deck is packed. */
type Group = [CardCategory, number, number];

const PHASE_GROUPS: Record<PhaseId, Group[]> = {
  p1: [['me', 1, 7], ['neighbourhood', 8, 11], ['tool', 12, 12], ['we', 13, 16]],
  p2: [['collectively', 1, 5], ['tool', 6, 6], ['collectively', 7, 7], ['experts', 8, 9], ['inspiration', 10, 11]],
  p3: [
    ['tool', 1, 1], ['keyGroup', 2, 3], ['goal', 4, 8], ['groupStructure', 9, 12],
    ['partners', 13, 18], ['conclusion', 19, 22], ['longTerm', 23, 29], ['resources', 30, 34],
  ],
};

function phaseCards(phase: PhaseId): CardDef[] {
  return PHASE_GROUPS[phase].flatMap(([category, first, last]) =>
    Array.from({ length: last - first + 1 }, (_, offset): CardDef => {
      const number = first + offset;
      const id = `${phase}-${number}`;
      return {
        id,
        deck: phase,
        category,
        number,
        kind: category === 'tool' ? 'tool' : 'prompt',
        ...(category === 'tool' ? { toolId: TOOL_OF_PHASE[phase] } : {}),
        ...(METHODOLOGY_CARDS[id] ? { methodologyId: METHODOLOGY_CARDS[id] } : {}),
      };
    }),
  );
}

export const CARDS: readonly CardDef[] = [
  { id: 'io-intro', deck: 'intro', category: 'introduction', number: null, kind: 'info' },
  { id: 'io-packup', deck: 'intro', category: 'packUp', number: null, kind: 'info' },
  ...phaseCards('p1'),
  ...phaseCards('p2'),
  ...phaseCards('p3'),
  { id: 'io-end', deck: 'boost', category: 'theEnd', number: null, kind: 'info' },
  ...Array.from({ length: 5 }, (_, index): CardDef => ({
    id: `io-boost-${index + 1}`,
    deck: 'boost',
    category: 'boost',
    number: index + 1,
    kind: 'prompt',
  })),
];

export const CARD_BY_ID: ReadonlyMap<string, CardDef> = new Map(CARDS.map((card) => [card.id, card]));

export const cardsOfDeck = (deck: DeckId): CardDef[] => CARDS.filter((card) => card.deck === deck);

/** Decks a group can run as a session. The intro deck is reading material only. */
export const SESSION_DECKS = ['p1', 'p2', 'p3', 'boost'] as const;
export type SessionDeckId = (typeof SESSION_DECKS)[number];

/** Consecutive cards of one category, for showing a deck in its packed order. */
export function groupedCards(deck: DeckId): { category: CardCategory; cards: CardDef[] }[] {
  const groups: { category: CardCategory; cards: CardDef[] }[] = [];
  for (const card of cardsOfDeck(deck)) {
    const last = groups[groups.length - 1];
    if (last && last.category === card.category) last.cards.push(card);
    else groups.push({ category: card.category, cards: [card] });
  }
  return groups;
}
