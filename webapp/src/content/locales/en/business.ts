/**
 * Text for the Business Model Tool (Tool 3). Step names, descriptions, canvas
 * prompts and data categories follow the tool's PDF (spelling corrected);
 * the names of the four activity groups are ours.
 */
export const business = {
  title: 'Business Model Tool',
  eyebrow: 'Tool 3 · Phase 3 – Collaboration',
  lead:
    'A hands-on guide to help your energy community build a solid business model. Five steps take you from choosing what to do, to a business model canvas, the data you need and a business plan of your own.',
  intro: [
    'Use it when your group has a concrete idea or project. You can take the steps in order or go straight to the one you need, in a meeting, a workshop or on your own.',
    'What you fill in is saved in this browser. The documents behind each step — project feedback, templates and examples — are provided by the CIRCUS partners and open in a new tab.',
  ],
  stepsLabel: 'Steps of the Business Model Tool',
  step: 'Step {n}',
  steps: {
    explore: {
      name: 'Explore and choose',
      summary: 'Discover feedback from energy community projects and select your main activity.',
    },
    draw: {
      name: 'Draw',
      summary: 'Describe, design, challenge and invent your project with the business model canvas.',
    },
    collect: {
      name: 'Collect',
      summary: 'Gather data to refine your business model and prepare your business plan.',
    },
    build: {
      name: 'Build up',
      summary: 'Set up your own business plan to test whether your project is economically viable.',
    },
    'go-further': {
      name: 'Go further',
      summary: 'Work on risk analysis, the legal entity and additional benefits.',
    },
  },
  openStep: 'Open step {n}',
  nextStep: 'Next: {name}',
  previousStep: 'Previous: {name}',
  original: 'Original Business Model Tool (clickable PDF)',
  manual: 'Business Model Tool manual',
  partnerFolder: 'Business Model Tool folder',
  disclaimer: 'Disclaimer for the project feedback documents',

  context: {
    title: 'What you already know',
    lead: 'From the earlier phases, saved in this browser.',
    profile: 'Energy profile',
    profileNone: 'No energy profile yet.',
    profileFacts:
      '{homes} homes · {usage} MWh of electricity a year with your goals · {production} MWh produced locally · {coverage} covered',
    profileOpen: 'Open the Energy Profile Tool',
    sites: 'Candidate sites',
    sitesNone: 'No candidate sites yet.',
    sitesOpen: 'Open the GIS Tool',
  },

  explore: {
    title: 'Explore and choose your energy community activities',
    lead: 'An energy community can do many things. Look at what other projects experienced, then mark what interests your group. You can come back and change this at any time.',
    groups: {
      demand: 'Use less, and use it smarter',
      electricity: 'Produce electricity',
      heat: 'Produce heat',
      storage: 'Store energy',
    },
    activities: {
      flexibility: 'Flexibility',
      awareness: 'Awareness',
      'heat-saving': 'Heat saving',
      wind: 'Wind energy',
      'rooftop-solar': 'Rooftop solar',
      'solar-shade': 'Solar shade',
      'ground-mounted': 'Ground-mounted solar',
      hydro: 'Hydro energy',
      biomass: 'Biomass',
      'solar-heat': 'Solar heat',
      geothermy: 'Geothermal energy',
      'energy-storing': 'Energy storing',
    },
    interestLabel: 'Interest of our group in {activity}',
    interest: { no: 'Not for us', maybe: 'Maybe', yes: 'Yes' },
    unset: 'Not discussed',
    note: 'Notes',
    noteLabel: 'Notes on {activity}',
    feedback: 'Project feedback',
    noFeedback: 'No project feedback document for this activity yet.',
    chosen: 'Marked “Yes”: {list}',
    chosenNone: 'Nothing marked “Yes” yet.',
  },

  draw: {
    title: 'Draw your business model with the canvas',
    lead: 'The business model canvas puts your whole project on one page, in nine blocks. Fill in what you know; leave the rest for later. If information is not available, use the figures of projects like yours.',
    blocks: {
      partners: { name: 'Key partners', prompt: 'Who are your main partners for this project?' },
      activities: {
        name: 'Key activities',
        prompt: 'How do you describe your project? What are its main activities? How do you earn money?',
      },
      resources: {
        name: 'Key resources',
        prompt: 'Which main inputs and assets does the project need to work?',
      },
      value: {
        name: 'Value propositions',
        prompt: 'Besides making money, what values is your project attached to?',
      },
      relationships: {
        name: 'Customer relationships',
        prompt: 'How do you get customers, keep them, and keep creating value for them?',
      },
      channels: {
        name: 'Channels',
        prompt: 'How do you deliver your value proposition: online, in person, or both?',
      },
      segments: {
        name: 'Customer segments',
        prompt: 'Who are your most important customers? (Think of your personas here.)',
      },
      costs: { name: 'Cost structure', prompt: 'What are your main costs, variable and fixed?' },
      revenues: { name: 'Revenue streams', prompt: 'What are your revenues?' },
    },
    canvasName: 'Name of this canvas',
    defaultName: 'Canvas {n}',
    select: 'Canvas',
    add: 'New canvas',
    delete: 'Delete this canvas',
    deleteConfirm: 'Delete “{name}”?',
    confirmDelete: 'Yes, delete',
    print: 'Print this canvas',
    printHint: 'Prints on one page; choose landscape in the print dialog.',
    empty: 'Start your first canvas.',
    start: 'Start a canvas',
    template: 'Data template for your activity',
    order:
      'A common order: start on the right with your customers and what you offer them, then the left with what you need to deliver it, and finish with costs and revenues.',
  },

  collect: {
    title: 'Collect data',
    lead: 'To refine your business model and prepare a business plan you need figures. The tool groups them in four categories. Tick what you have, and note the figure and where it comes from.',
    categories: {
      development: {
        name: 'Development and installation',
        text: 'All investments to put the energy production facilities in place.',
      },
      operating: {
        name: 'Operating cost',
        text: 'All costs to run the energy production facilities and the company.',
      },
      revenues: {
        name: 'Energy revenues',
        text: 'These depend on the support mechanisms that apply to your project.',
      },
      other: {
        name: 'Other incomes',
        text: 'If your company provides other services or deliverables.',
      },
    },
    items: {
      studies: 'Studies',
      materials: 'Materials',
      'grid-connection': 'Grid connection',
      running: 'Running the facilities and the company',
      loans: 'Loan costs',
      taxes: 'Taxes',
      'stakeholder-revenue': 'Stakeholder revenue',
      'feed-in-tariff': 'Feed-in tariff',
      tender: 'Call for tender',
      ppa: 'Power purchase agreement',
      'self-consumption': 'Self-consumption',
      'development-services': 'Project development services',
      'buying-groups': 'Buying groups',
    },
    have: 'We have this',
    value: 'Figure',
    source: 'Source',
    note: 'Note',
    progress: '{done} of {total} collected',
    template: 'Data template',
    supportMechanisms: 'About the support mechanisms',
    examplesNote: 'The items are the examples the tool names; your project may need others.',
  },

  build: {
    title: 'Build up your business plan',
    lead: 'Now that you have data, you can test whether your project is economically viable with a business plan in a spreadsheet.',
    ownTitle: 'Build your own',
    own: [
      'Each company has its own template, and no universal calculation can be made, because regulations and tariffs are constantly changing.',
      'The best advice the tool gives is to create your own business plan. Starting from a table that you do not know — or worse, that you do not understand — will lead you to mistakes.',
    ],
    why: 'That is why this site does not calculate a business plan for you.',
    resources: [
      {
        id: 'business-plan-step-by-step',
        title: 'Step by step',
        text: 'The key steps to understand the basic concepts you need to build your own business plan.',
      },
      {
        id: 'business-plan-examples',
        title: 'Get inspired',
        text: 'Existing business plans to help you create your own.',
      },
    ],
    progressTitle: 'Work in progress',
    progress:
      'A business plan is not set for the lifetime of the project. Many parameters will change during development; update it and look at what the changes mean.',
    notesLabel: 'Notes on our business plan',
    notesHint: 'Where the plan is kept, who maintains it, what to update next.',
    dataReady: 'Data collected so far: {done} of {total} items.',
  },

  goFurther: {
    title: 'Go further',
    lead: 'The business model is one aspect of your project. You should also take care of the following.',
    items: {
      benefits: {
        name: 'Additional benefits',
        text: 'The benefits your energy community generates and reinvests in the neighbourhood.',
        link: 'About additional benefits',
      },
      legal: {
        name: 'Legal entity',
        text: 'Feedback on legal entities suited to an energy community.',
        link: 'About legal entities',
      },
      risk: {
        name: 'Risk analysis',
        text: 'Evaluate how sensitive your project is to risk.',
        link: 'Risk analysis tool',
      },
    },
    done: 'We have worked on this',
    note: 'Notes',
    noteLabel: 'Notes on {item}',
    cardsHint: 'Continue with the phase 3 cards: they take the group through goals, structure, partners and resources.',
    cardsLink: 'Open the phase 3 cards',
  },
};
