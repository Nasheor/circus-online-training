import { about, accessibility, feedback, privacy } from './about';
import { business } from './business';
import * as cards from './cards';
import * as common from './common';
import { community } from './community';
import { learn } from './learn';
import { glossary, library } from './library';
import { map } from './map';
import * as pages from './pages';
import { profile } from './profile';
import { wattworks } from './wattworks';

/** All English text. Other locales provide a DeepPartial of this shape. */
export const en = {
  ...common,
  ...pages,
  cardCategories: cards.categories,
  methodologies: cards.methodologies,
  cards: cards.cards,
  wattworks,
  profile,
  map,
  business,
  learn,
  community,
  library,
  glossary,
  about,
  privacy,
  accessibility,
  feedback,
};
