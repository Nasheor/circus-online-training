/** Lessons: a short introduction to each tool. Content follows the tool manuals. */

export interface Lesson {
  title: string;
  minutes: number;
  intro: string;
  sections: { title: string; paragraphs?: string[]; steps?: string[]; bullets?: string[] }[];
  quiz: { question: string; options: string[]; answer: number; explain: string }[];
  tryLabel: string;
}

export const learn = {
  title: 'Learn the method',
  lead: 'Four short lessons introduce the WattWorks cards and the three tools: what each is for, how to use it and how to read what it shows. Each ends with a quick check.',
  intro: [
    'The lessons are for anyone who wants to use the CIRCUS method with a community, or simply understand it before a first meeting. Take them in any order; if you are new, start with the cards.',
    'This online training is an introduction. It does not lead to a certificate: CIRCUS advisors are certified through the multi-day training given by the project partners.',
  ],
  lessonLabel: 'Lesson {n}',
  start: 'Start the lesson',
  inThisLesson: 'In this lesson',
  checkTitle: 'Quick check',
  checkLead: 'Three questions to check what you have picked up. Nothing is recorded.',
  correct: 'Right.',
  incorrect: 'Not quite.',
  next: 'Next lesson: {title}',
  allLessons: 'All lessons',
  manualLabel: 'Tool manual',
  lessons: {
    cards: {
      title: 'The WattWorks cards',
      minutes: 10,
      intro:
        'WattWorks is the thread that runs through the whole CIRCUS method: a set of conversation cards that helps a group talk, decide and act, one question at a time.',
      sections: [
        {
          title: 'What it is',
          paragraphs: [
            'WattWorks is an interactive set of 69 conversation cards. Whether you are just starting out or already working with an engaged group, it serves as a talk trigger and practical guide through each stage, from first ideas to collective action and long-term impact.',
            'The cards come in three colours, one for each phase: red for Awareness, orange for Exploring Renewable Energy Opportunities and green for Collaboration. White cards open and close the set.',
          ],
        },
        {
          title: 'How to use the cards',
          steps: [
            'Choose your phase: pick the colour that matches where your group is.',
            'Draw a card. The cards follow a clear, chronological structure. Read the card aloud and discuss it, with or without guidance from a CIRCUS trainer.',
            'Reflect and discuss. Check the perspective you should answer from: it is written above the question.',
            'Explore the extra resources. Some cards point to a tool or a methodology.',
            'Write down your insights.',
            'Move on to the next phase when the group is ready.',
          ],
        },
        {
          title: 'Reading a card',
          bullets: [
            'The word above the question is the perspective: “Me” asks for your own view, “Neighbourhood” for what you see around you, “We” for the group.',
            'The number gives the order within the phase.',
            'A card marked “Tool” asks the group to apply one of the three tools and discuss the results.',
            'Five green cards name a methodology (Persona, SMART, Peer to Peer, Stakeholder Mapping, Action Planner) that can help with that question.',
          ],
        },
        {
          title: 'Using the cards on this site',
          paragraphs: [
            'Session mode shows one card at a time on a shared screen and keeps a note for each. When you reach a tool card, the tool opens on this site, and a bar at the top brings you back to your cards. At the end you get a summary to print or keep.',
            'You can also download the print files and play with cards on the table: around a meeting table, during a workshop or in an informal conversation.',
          ],
        },
        {
          title: 'Good to know',
          bullets: [
            'You do not need to go through every card. Choose the ones most relevant to your situation.',
            'The cards are made for groups, but the “Me” cards also work for one person reflecting alone.',
            'Keep using them: the closing cards, “Boost for the future”, are questions to return to regularly.',
          ],
        },
      ],
      quiz: [
        {
          question: 'Does a group have to discuss every card in a phase?',
          options: ['Yes, in order, without skipping', 'No, it can choose the cards most relevant to its situation', 'Only the cards marked “Tool”'],
          answer: 1,
          explain: 'The manual says you don’t need to go through every card: choose the ones most relevant to your situation.',
        },
        {
          question: 'What does the word printed above the question tell you?',
          options: ['How long to spend on the card', 'The perspective to answer from', 'Which tool to open'],
          answer: 1,
          explain: 'It names the perspective: Me, Neighbourhood, We, and so on.',
        },
        {
          question: 'Which phase suits a group that already has a concrete project idea?',
          options: ['Phase 1 – Awareness', 'Phase 2 – Exploring Renewable Energy Opportunities', 'Phase 3 – Collaboration'],
          answer: 2,
          explain: 'Phase 3 is for communities that already have a clear direction and are ready to put their plans into action.',
        },
      ],
      tryLabel: 'Open the WattWorks cards',
    },
    'energy-profile': {
      title: 'The Energy Profile Tool',
      minutes: 15,
      intro:
        'Before deciding what kind of project to pursue, it is essential to understand your starting point. The Energy Profile Tool gives a group that shared picture in a few minutes.',
      sections: [
        {
          title: 'What it is for',
          paragraphs: [
            'The tool is a low-threshold conversation starter: no technical knowledge and no measured data are needed. It helps a group answer three questions. How much energy does our community use today? Where can we save energy? What would it take to become more energy self-sufficient?',
            'It is used in phase 1, when a group is forming. Card 12 of the red cards asks you to apply it and discuss the results.',
          ],
        },
        {
          title: 'What you enter',
          steps: [
            'Homes and heating: how many homes of each type there are, and whether they heat with a gas boiler, a hybrid heat pump or an all-electric heat pump. A rough count is enough.',
            'Cars: the average number of cars per household, and how many are fully electric.',
            'Solar and wind today: the number of solar panels in the community and any wind turbines nearby.',
            'What if: goals for using less electricity, using less energy for heating, and more electric cars.',
          ],
        },
        {
          title: 'Reading the result',
          bullets: [
            'Electricity use per year, today and with your goals, split into household electricity, heat pumps and electric cars.',
            'Local production per year from solar and wind, and the share of the yearly use it covers.',
            'A chart of the twelve months: columns for production, a line for use. Use is highest in winter; solar production is highest in summer.',
            'Two “matching” figures: how many more solar panels would cover the month with the lowest use, and the month with the highest use.',
          ],
        },
        {
          title: 'What the numbers are, and are not',
          paragraphs: [
            'The result is an estimate built from reference values per type of home. Those values come from the original Excel tool and are Dutch averages; you can replace them under “Assumptions behind the numbers” if you have figures for your own area.',
            'The picture is about electricity. A home with a gas boiler adds its household electricity but no electricity for heating, and its gas use is not shown.',
            'Covering the highest month with solar panels alone usually takes a very large number of panels, because a panel produces much less in winter. That is a useful result, not a failure: it opens the conversation about saving energy, wind and storage.',
          ],
        },
        {
          title: 'In a meeting',
          bullets: [
            'Fill it in together on a shared screen; the results change as you type.',
            'Save a scenario called “Today”, then try a goal and save that too. The comparison shows what the goal changes.',
            'Discuss: were the results surprising? What new insights do you gain from this?',
            'When you want real figures instead of estimates, the project also offers Tool 1B (monthly data collected from households) and Tool 1C (savings per household).',
          ],
        },
      ],
      quiz: [
        {
          question: 'What do you need before you can use the Energy Profile Tool?',
          options: ['Twelve months of meter readings from every household', 'A rough count of homes by type and heating', 'An energy consultant'],
          answer: 1,
          explain: 'It is an estimation tool: rough counts are enough, and no measured data is needed.',
        },
        {
          question: 'Why does covering the highest month take many more solar panels than covering the lowest month?',
          options: ['Because panels are more expensive in winter', 'Because use is highest in winter, when a panel produces least', 'Because wind turbines stop in winter'],
          answer: 1,
          explain: 'Use peaks in winter while a solar panel produces far less than in summer, so the gap per panel is much larger.',
        },
        {
          question: 'In this tool, how much electricity for heating does a home with a gas boiler add?',
          options: ['None', 'The same as a hybrid heat pump', 'Twice as much as an all-electric heat pump'],
          answer: 0,
          explain: 'Only heat pumps use electricity for heating. Gas use is not part of this electricity picture.',
        },
      ],
      tryLabel: 'Open the Energy Profile Tool',
    },
    map: {
      title: 'The GIS Tool',
      minutes: 10,
      intro:
        'Once a group wants to produce energy together, the next question is where. The GIS Tool puts that question on a map.',
      sections: [
        {
          title: 'What it is',
          paragraphs: [
            'The GIS Tool is a user-friendly web map that helps communities and planners identify and assess suitable locations for ground-mounted solar panels (GM-PV) and for agrivoltaics (Agri-PV), where solar panels and farming share the same land.',
            'It brings open geospatial data together with what communities care about: food security, environmental protection, the landscape and regulations. All you need is an internet connection.',
          ],
        },
        {
          title: 'How to use it',
          steps: [
            'Open the map for your region.',
            'Select map layers: use the legend to turn layers on or off by ticking or unticking the boxes.',
            'Explore the map: zoom in and out, search for an address, and examine the suitability maps.',
            'Discuss what you see. No technical background is needed.',
          ],
        },
        {
          title: 'When to use it',
          bullets: [
            'In phase 2, to identify and discuss promising locations. Card 6 of the orange cards asks you to apply it.',
            'In phase 3, to look at feasibility and land use in more detail.',
            'Together with the WattWorks cards: what stood out, what new insights emerged, and where do you see opportunities to work together?',
          ],
        },
        {
          title: 'Keeping track',
          paragraphs: [
            'On this site each region has a guide with the layers of that map and a list of candidate sites. For every site you can note where it is, why it looks promising and what the concerns are, and paste a link to the map view. The list is shown again in the Business Model Tool.',
            'Most maps also let visitors draw a point or an area and leave a comment. Those comments are stored with the map and go to KIT, who made the maps; they are not your group’s private notes.',
          ],
        },
        {
          title: 'Limits',
          bullets: [
            'Maps exist for the six CIRCUS pilot regions only.',
            'A suitable area on the map is a starting point for discussion and further checking, not a decision.',
            'Not every layer is explained yet; where a layer is unclear, ask the tool’s authors at KIT.',
          ],
        },
      ],
      quiz: [
        {
          question: 'What does the GIS Tool help a community find?',
          options: ['The cheapest electricity supplier', 'Locations that could suit ground-mounted solar and agrivoltaics', 'The energy use of each household'],
          answer: 1,
          explain: 'It shows suitability for ground-mounted PV and agri-PV on a map.',
        },
        {
          question: 'How do you turn a map layer on or off?',
          options: ['By ticking or unticking its box in the legend', 'By reloading the page', 'By asking KIT'],
          answer: 0,
          explain: 'The legend has a box for each layer.',
        },
        {
          question: 'Where does a comment go that you leave on the map’s feedback layer?',
          options: ['It stays private in your browser', 'It is stored with the map and goes to KIT', 'It is emailed to your local council'],
          answer: 1,
          explain: 'The feedback layers belong to the map. For your own notes, use the candidate sites list on this site.',
        },
      ],
      tryLabel: 'Open the GIS Tool',
    },
    'business-model': {
      title: 'The Business Model Tool',
      minutes: 15,
      intro:
        'An idea becomes a project when the group can say who it is for, how it is organised and how it pays for itself. The Business Model Tool walks you there in five steps.',
      sections: [
        {
          title: 'What it is for',
          paragraphs: [
            'The tool is a hands-on guide to help your energy community build a solid business model. Use it when your group has a concrete idea or project. It covers the legal structure, costs, income models and risks.',
            'It belongs to phase 3: the first green card asks you to apply it, and the cards that follow take the group through who benefits, goals, group structure, partners and resources.',
          ],
        },
        {
          title: 'The five steps',
          steps: [
            'Explore and choose: discover feedback from energy community projects and select your main activity — saving and flexibility, producing electricity, producing heat, or storing energy.',
            'Draw: describe, design and challenge your project with the business model canvas.',
            'Collect: gather the data you need to refine the model and prepare a business plan.',
            'Build up: set up your own business plan in a spreadsheet to test whether the project is economically viable.',
            'Go further: work on risk analysis, the legal entity and the additional benefits for the neighbourhood.',
          ],
        },
        {
          title: 'The canvas',
          paragraphs: [
            'The business model canvas puts the whole project on one page in nine blocks: key partners, key activities, key resources, value propositions, customer relationships, channels, customer segments, cost structure and revenue streams. Each block has a question to answer.',
            'You do not need every answer at once. Fill in what you know and return to it; if information is not available, start from the figures of projects like yours.',
          ],
        },
        {
          title: 'The data',
          bullets: [
            'Development and installation: all investments to put the facilities in place — studies, materials, grid connection.',
            'Operating cost: running the facilities and the company, including loan costs, taxes and stakeholder revenue.',
            'Energy revenues: these depend on the support mechanisms — feed-in tariff, call for tender, power purchase agreement, self-consumption.',
            'Other incomes: other services your company provides, such as project development services or buying groups.',
          ],
        },
        {
          title: 'Why there is no ready-made business plan',
          paragraphs: [
            'The tool is clear about this: each company has its own template, and no universal calculation can be made, because regulations and tariffs keep changing. Its best advice is to create your own business plan. Starting from a table you do not understand will lead you to mistakes.',
            'So this site gives you the steps, the checklist and the partners’ guides and examples, and leaves the spreadsheet to you. A business plan is also never finished: update it as the project develops.',
          ],
        },
      ],
      quiz: [
        {
          question: 'In which step do you put your whole project on one page?',
          options: ['Explore and choose', 'Draw', 'Go further'],
          answer: 1,
          explain: 'Step 2, Draw, uses the business model canvas.',
        },
        {
          question: 'Why does the tool not provide a universal business plan calculation?',
          options: ['Because energy communities do not need a business plan', 'Because regulations and tariffs keep changing and each company has its own template', 'Because the partners did not have time'],
          answer: 1,
          explain: 'The tool advises building your own plan, so that you understand every figure in it.',
        },
        {
          question: 'Which of these is one of the four kinds of data to collect?',
          options: ['Operating cost', 'Number of card sessions', 'Map layers'],
          answer: 0,
          explain: 'The four are development and installation, operating cost, energy revenues and other incomes.',
        },
      ],
      tryLabel: 'Open the Business Model Tool',
    },
  } satisfies Record<string, Lesson>,
};
