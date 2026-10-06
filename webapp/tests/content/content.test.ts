import { describe, expect, it } from 'vitest';
import { ACTIVITIES, CANVAS_BLOCKS, DATA_CATEGORIES, GO_FURTHER } from '~/content/business';
import { LESSONS } from '~/content/lessons';
import { en } from '~/content/locales/en';
import { REGIONS } from '~/content/regions';
import { RESOURCES, getResource } from '~/content/resources';
import { CARDS, PHASES, cardsOfDeck } from '~/content/structure';

describe('WattWorks cards', () => {
  it('has the 69 cards of the printed set', () => {
    expect(CARDS).toHaveLength(69);
    expect(cardsOfDeck('p1')).toHaveLength(16);
    expect(cardsOfDeck('p2')).toHaveLength(11);
    expect(cardsOfDeck('p3')).toHaveLength(34);
    // The eight white intro and outro cards.
    expect(cardsOfDeck('intro').length + cardsOfDeck('boost').length).toBe(8);
  });

  it('has unique ids and English text for exactly those cards', () => {
    const ids = CARDS.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.keys(en.cards).sort()).toEqual([...ids].sort());
    for (const card of CARDS) expect(en.cards[card.id].lines.length, card.id).toBeGreaterThan(0);
  });

  it('has one tool card per phase, where the printed deck has it', () => {
    const toolCards = CARDS.filter((card) => card.kind === 'tool').map((card) => card.id);
    expect(toolCards).toEqual(['p1-12', 'p2-6', 'p3-1']);
    for (const phase of PHASES) {
      const card = CARDS.find((item) => item.id === phase.toolCardId);
      expect(card?.toolId).toBe(phase.toolId);
    }
  });

  it('marks the five methodology cards', () => {
    const tagged = Object.fromEntries(
      CARDS.filter((card) => card.methodologyId).map((card) => [card.id, card.methodologyId]),
    );
    expect(tagged).toEqual({
      'p3-2': 'persona',
      'p3-8': 'smart',
      'p3-10': 'peer-to-peer',
      'p3-13': 'stakeholder-mapping',
      'p3-25': 'action-planner',
    });
  });
});

describe('resource manifest', () => {
  it('has unique ids, a source and a Library label for every resource', () => {
    const ids = RESOURCES.map((resource) => resource.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const resource of RESOURCES) {
      expect(resource.local ?? resource.external, resource.id).toBeTruthy();
      expect(en.library.items[resource.id], resource.id).toBeTruthy();
    }
  });

  it('resolves every resource the tools refer to', () => {
    const referenced = [
      ...ACTIVITIES.flatMap((activity) => (activity.resource ? [activity.resource] : [])),
      ...DATA_CATEGORIES.flatMap((category) => ('resource' in category ? [category.resource] : [])),
      ...GO_FURTHER.map((item) => item.resource),
      ...REGIONS.map((region) => region.resourceId),
      ...LESSONS.map((lesson) => lesson.manual),
      ...en.business.build.resources.map((resource) => resource.id),
    ];
    for (const id of referenced) expect(() => getResource(id), id).not.toThrow();
  });
});

describe('English text covers the structure', () => {
  it('names every activity, canvas block, data item, region and lesson', () => {
    for (const activity of ACTIVITIES) expect(en.business.explore.activities[activity.id]).toBeTruthy();
    for (const block of CANVAS_BLOCKS) expect(en.business.draw.blocks[block].prompt).toBeTruthy();
    for (const category of DATA_CATEGORIES) {
      expect(en.business.collect.categories[category.id].name).toBeTruthy();
      for (const item of category.items) expect(en.business.collect.items[item]).toBeTruthy();
    }
    for (const region of REGIONS) expect(en.map.regions[region.id as keyof typeof en.map.regions].name).toBeTruthy();
    for (const lesson of LESSONS) {
      const text = en.learn.lessons[lesson.id];
      expect(text.quiz).toHaveLength(3);
      for (const question of text.quiz) expect(question.options[question.answer]).toBeTruthy();
    }
  });
});
