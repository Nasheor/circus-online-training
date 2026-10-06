/** Text of the general pages: home, journey, tools overview. */

export const home = {
  title: 'Start an energy community in your village',
  eyebrow: 'Free online training · no account needed',
  lead:
    'The CIRCUS method takes a rural community from first conversations about energy to a plan it can act on. This training shows you how: three phases, a deck of conversation cards, and three tools you can use right here in your browser.',
  ctaStart: 'Find where to start',
  ctaJourney: 'See the three phases',
  how: {
    title: 'How the method works',
    lead:
      'Each phase has its own colour and its own set of WattWorks conversation cards. Partway through the cards, the group applies one tool and talks about what it shows.',
    open: 'Open phase {n}',
  },
  different: {
    title: 'Made to be used, not just read',
    items: [
      {
        title: 'The tools work in your browser',
        text: 'Build your energy profile, run a card session and fill in your business model canvas on this site. Nothing to install, no spreadsheet to download first.',
      },
      {
        title: 'One step feeds the next',
        text: 'Your energy profile, your candidate sites and your notes from the cards are kept together and shown again where you need them.',
      },
      {
        title: 'Your work stays with you',
        text: 'There is no account. Everything you enter is stored in this browser only, and you can save it as a file to keep or share.',
      },
    ],
  },
  toolsTitle: 'The tools',
  audience: {
    title: 'Who this is for',
    items: [
      {
        title: 'People in a village or rural area',
        text: 'Residents, farmers, local businesses and councillors who want to do something about energy together. You do not need to be an expert.',
      },
      {
        title: 'Advisors and facilitators',
        text: 'Anyone who supports communities and wants to learn how the CIRCUS tools and cards are used before guiding a group through them.',
      },
    ],
  },
  definition: {
    title: 'What is an energy community?',
    quote:
      'A group of rural residents and organisations ready to test the CIRCUS method, work together on the energy transition, and take action to build a more resilient community.',
    source: 'The general CIRCUS definition, from the WattWorks cards',
  },
};

export const selfCheck = {
  title: 'Where are you now?',
  lead: 'Four quick questions suggest which phase to start with. It is only a suggestion: you can start anywhere.',
  questions: [
    {
      id: 'group',
      text: 'Is there already a group of people in your community working on energy together?',
      options: [
        { id: 'no', label: 'Not yet — it is just me, or a few people separately' },
        { id: 'yes', label: 'Yes, a group is forming or already exists' },
      ],
    },
    {
      id: 'usage',
      text: 'Does the group have a shared picture of how much energy the community uses?',
      options: [
        { id: 'no', label: 'No, we have not looked at that together' },
        { id: 'yes', label: 'Yes, we have a reasonable idea' },
      ],
    },
    {
      id: 'options',
      text: 'Have you explored where and how renewable energy could be produced locally?',
      options: [
        { id: 'no', label: 'Not yet' },
        { id: 'yes', label: 'Yes, we have looked at options and places' },
      ],
    },
    {
      id: 'direction',
      text: 'Do you have a clear direction — a concrete idea or project you want to make happen?',
      options: [
        { id: 'no', label: 'Not yet, we are still comparing options' },
        { id: 'yes', label: 'Yes, and we are ready to organise ourselves around it' },
      ],
    },
  ],
  progress: 'Question {n} of {total}',
  resultTitle: 'Suggested starting point',
  result: {
    p1: 'Start with Phase 1 – Awareness. It helps people reflect on energy in their own lives and neighbourhood, and gives you a first picture of the community’s energy use.',
    p2: 'Start with Phase 2 – Exploring Renewable Energy Opportunities. You have a group and a starting picture; now look at what you could develop together, and where.',
    p3: 'Start with Phase 3 – Collaboration. You have a direction; this phase is about your group, your partners, your goals and your business model.',
  },
  go: 'Go to phase {n}',
  again: 'Answer again',
  savedNote: 'Your answers are saved in this browser so the home page can remind you where you are.',
};

export const resume = {
  title: 'Continue where you left off',
  empty: 'Nothing saved yet. Start with the questions above, or open a phase.',
  profile: 'Homes in the energy profile: {n}',
  scenarios: 'Saved scenarios: {n}',
  sessions: 'Card sessions: {n}',
  activeSession: 'Card session in progress: {title}',
  resumeSession: 'Resume the session',
  sites: 'Candidate sites: {n}',
  canvases: 'Business model canvases: {n}',
  open: 'Open My community',
};

export const journey = {
  title: 'The CIRCUS journey',
  lead:
    'Three phases take a community from individual awareness to working together. You can follow them in order or start where your group is today.',
  rhythmTitle: 'Every phase follows the same rhythm',
  rhythm: [
    { title: 'Talk', text: 'Use the first WattWorks cards of the phase to get everyone’s view on the table.' },
    { title: 'Apply the tool', text: 'One card asks the group to apply the tool of that phase and discuss the results.' },
    { title: 'Decide what is next', text: 'The remaining cards turn what you saw into shared conclusions and next steps.' },
  ],
  phaseLabel: 'Phase {n}',
  goal: 'What this phase is for',
  audience: 'Who it is for',
  sequence: 'What you do',
  sequenceCards: '{category} cards {range}',
  sequenceCard: '{category} card {range}',
  sequenceTool: 'Card {n}: apply the {tool}',
  carry: 'What you take with you',
  facilitator: 'Notes for whoever leads the session',
  startSession: 'Start a card session for this phase',
  browseCards: 'Browse the {n} cards',
  openTool: 'Open the {tool}',
  lesson: 'How to use the {tool}',
  nextPhase: 'Next: phase {n} – {name}',
  previousPhase: 'Previous: phase {n} – {name}',
  markDone: 'We have completed this phase',
  done: 'Completed',
  phases: {
    p1: {
      goal: [
        'Before deciding what kind of project to pursue, it is essential to understand your starting point. This phase gets people talking about energy in their own lives and in the neighbourhood, and gives the group a first shared picture of how much energy the community uses.',
        'The questions behind it: how much energy does our community use today? Where can we save energy? What would it take to become more energy self-sufficient?',
      ],
      carry: [
        'A saved energy profile of your community, with one or more “what if” scenarios.',
        'Notes on what motivates people and what is already happening in the neighbourhood.',
        'A sense of who wants to keep working on energy together.',
      ],
    },
    p2: {
      goal: [
        'Now that there is a group, this phase explores what you could develop together and where. You look at initiatives that already exist, use the GIS Tool to see which locations could suit ground-mounted solar or agrivoltaics, and decide which options to examine more closely.',
        'It also asks who could enrich the group — experts, organisations, other projects worth visiting.',
      ],
      carry: [
        'A short list of candidate sites, each with why it looks promising and what the concerns are.',
        'The options the group wants to examine more closely.',
        'Names of experts to invite and projects to visit for inspiration.',
      ],
    },
    p3: {
      goal: [
        'This phase is for a group with a concrete idea. You apply the Business Model Tool, then use the cards to work through who benefits, what your goals are, how the group is structured, who your partners are, how you decide together, and what resources you can draw on.',
        'It ends with the long term: where you want to be in ten or twenty years, and the first steps you can take now.',
      ],
      carry: [
        'Your chosen activities and a business model canvas.',
        'A checklist of the data you still need for a business plan.',
        'Agreed goals, roles, partners and first steps.',
      ],
    },
  },
  facilitatorNotes: [
    'Draw the cards in their numbered order, read each one aloud and discuss it. The cards work with or without a CIRCUS trainer.',
    'Check the perspective you should answer from: it is written above the question (Me, Neighbourhood, We, and so on).',
    'You do not need to go through every card. Choose the ones most relevant to your situation.',
    'Write down your insights as you go — the session mode on this site keeps a note for each card.',
    'The method does not set a duration. Take the time your group needs, over one meeting or several.',
  ],
};

export const toolsPage = {
  title: 'The tools',
  lead:
    'You do not need to be an expert: these tools are made to get you started and keep you going. Each belongs to one phase of the journey, but you can open any of them directly.',
  usedIn: 'Used in phase {n} – {name}',
  usedThroughout: 'Used in every phase',
  open: 'Open the tool',
  learn: 'Learn how to use it',
};
