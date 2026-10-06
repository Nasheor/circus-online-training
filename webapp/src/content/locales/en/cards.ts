/**
 * English text of the 69 WattWorks cards, transcribed from the card PDFs
 * (watt_works/CARDS, September 2025). Each entry in `lines` is one question or
 * sentence as printed. Keep the wording identical to the printed cards.
 */
export interface CardText {
  title?: string;
  lines: string[];
}

export const categories = {
  introduction: 'Introduction',
  packUp: 'Pack up',
  theEnd: 'The end',
  boost: 'Boost for the future',
  me: 'Me',
  neighbourhood: 'Neighbourhood',
  we: 'We',
  collectively: 'Collectively',
  experts: 'Experts',
  inspiration: 'Inspiration trips',
  keyGroup: 'Key group',
  goal: 'Goal',
  groupStructure: 'Group structure',
  partners: 'Partners',
  conclusion: 'Conclusion',
  longTerm: 'Long-term',
  resources: 'Resources',
  tool: 'Tool',
};

export const methodologies = {
  persona: 'Persona',
  smart: 'SMART',
  'peer-to-peer': 'Peer to Peer',
  'stakeholder-mapping': 'Stakeholder Mapping',
  'action-planner': 'Action Planner',
};

export const cards: Record<string, CardText> = {
  'io-intro': {
    title: 'Building a Strong Energy Community Together',
    lines: [
      'The transition to sustainable energy requires local engagement and collaboration. Energy communities play a crucial role in this by bringing the neighborhood together around the generation and management of renewable energy. But how do you get started as a new energy community? What steps should you take in each phase of your formation and growth?',
      'WATTWORKS is a practical, interactive tool that supports you in this process. These cards provide a range of reflective and strategic questions, specifically tailored to the different stages of your energy community. Whether you are still in the start-up phase or already have a group of enthusiasts, this tool helps you get started by: thinking critically about key matters; discovering and applying the right CIRCUS tools at the right moment; engaging in dialogue with your team and laying strong foundations for a successful energy community.',
      'This tool is specifically designed for group use: around the meeting table, during workshops, or simply in an informal conversation. The cards can be used to provide guidance and stimulate growth. By asking the right questions at the right time, you increase your community’s impact and build a sustainable future.',
      'Whether you are a start-up energy community or a CIRCUS trainer offering support, WATTWORKS helps you reflect together, make decisions, and take action. Make this tool a permanent part of your journey and build a strong, supported, and successful energy community step by step.',
    ],
  },
  'io-packup': {
    title: 'Packing instructions – Keep WattWorks in order',
    lines: [
      'To make sure the next group can get started smoothly, please follow these steps when putting the WattWorks cards back in the box.',
      'Start of the deck: place the WattWorks introduction cards and the general manual on top of the stack. Then add this instruction card.',
      'Phase 1 – Awareness (red cards): begin with the “Me” cards, numbered 1 to 7, in order. Then add the “Neighbourhood” cards, numbered 8 to 11. Insert the Energy Profiling Manual here. Follow with card 12, linked to the tool. Complete the red set with the “We” cards, numbered 13 to 16.',
      'Phase 2 – Exploring Renewable Energy Opportunities (orange cards): start with the “Collectively” cards, numbered 1 to 5. Insert the GIS Tool Manual here. Then add card 6, which introduces the tool, followed by card 7. Next, place the “Experts” cards, 8 and 9. End this phase with the “Inspiration Trips” cards, 10 and 11.',
      'Phase 3 – Collaboration (green cards): first, place the Business Tool Manual at the beginning of this phase. Then add the “Group” card 1. Continue with the “Key Group” cards, 2 and 3. Follow with the “Goals” cards, 4 to 8. Then the “Group Structure” cards, 9 to 12. Next, the “Partners” cards, 13 to 18. After that, add the “Conclusion” cards, 19 to 22. Follow with the “Long Term” cards, 23 to 29. Close this phase with the “Resources” cards, 30 to 34.',
      'End of the deck: finish by placing the white cards “THE END” and “Boost for the Future”. These should also be placed in chronological order.',
    ],
  },

  // Phase 1 - Awareness
  'p1-1': { lines: ['What motivates you to contribute to this group/this topic?'] },
  'p1-2': {
    lines: [
      'Where do you find your information about energy?',
      'What are some interesting websites or podcasts?',
      'Where can you get help with questions about saving energy?',
      'Where can you find the latest trends and new developments in the field of energy?',
    ],
  },
  'p1-3': {
    lines: ['Do you have a clear view of your energy consumption?', 'Do you know how much you use? How do you know this?'],
  },
  'p1-4': { lines: ['How do you personally engage in energy generation (production) and savings?'] },
  'p1-5': {
    lines: [
      'What energy-related accomplishments are you proud of?',
      'What steps have you taken to save or produce energy that you’re proud of?',
    ],
  },
  'p1-6': {
    lines: [
      'What would you like to do differently or be able to do in terms of energy?',
      'What is holding you back from doing that',
    ],
  },
  'p1-7': { lines: ['If money were no object, what changes would you make to your home/life in terms of energy?'] },
  'p1-8': {
    lines: [
      'Do you already talk to neighbours or friends about energy?',
      'What is the reason for these conversations and what has been the result?',
    ],
  },
  'p1-9': {
    lines: [
      'Do you see much happening with energy in your neighbourhood?',
      'Have you noticed any energy-related efforts in community buildings or spaces?',
    ],
  },
  'p1-10': {
    lines: [
      'Are there inspiring people or groups in your neighbourhood taking action on climate or energy?',
      'Who brings others together or makes things happen locally?',
      'Who would you trust to start a conversation about the future of your community?',
    ],
  },
  'p1-11': { lines: ['What climate measures are already being taken by residents in your neighbourhood?'] },
  'p1-12': {
    lines: [
      'Apply the Energy Profile Tool and discuss the results.',
      'Were the results surprising?',
      'What new insights do you gain from this?',
    ],
  },
  'p1-13': { lines: ['Is energy a topic you would like to think about collectively in the future? Why or why not?'] },
  'p1-14': { lines: ['Can working together on energy bring benefits for everyone?', 'How do you see that happening?'] },
  'p1-15': {
    lines: [
      'How can we engage more people in the neighbourhood to reflect on this theme and move towards collective action?',
    ],
  },
  'p1-16': {
    lines: ['Is there a group of neighbourhood residents and organizations that we can involve in this project? Why?'],
  },

  // Phase 2 - Exploring Renewable Energy Opportunities
  'p2-1': {
    lines: ['Are there any community-level initiatives in your neighbourhood, rather than just individual efforts?'],
  },
  'p2-2': { lines: ['Can you think of any initiatives in the neighbourhood where people are working together?'] },
  'p2-3': { lines: ['What do you think could be a good solution for producing energy together?'] },
  'p2-4': { lines: ['How can we encourage people to take part in shared initiatives and investments?'] },
  'p2-5': {
    lines: [
      'Do you know of any other maps or resources that could help identify opportunities for new energy actions or initiatives?',
    ],
  },
  'p2-6': {
    lines: [
      'Apply the GIS Tool and discuss the results.',
      'What stood out to you?',
      'What new insights have emerged, and where do you see opportunities to work together on energy?',
    ],
  },
  'p2-7': { lines: ['With these new insights in mind, which options do we want to examine more closely as a group?'] },
  'p2-8': { lines: ['Who can enrich this group and why? (People and organizations)'] },
  'p2-9': { lines: ['How can we enrich our knowledge about energy?'] },
  'p2-10': { lines: ['What qualities do you see in other projects that you could use in your own project?'] },
  'p2-11': { lines: ['Which experts can we still invite?', 'Where can we look for further inspiration or ideas?'] },

  // Phase 3 - Collaboration
  'p3-1': { lines: ['Apply the BUSINESS TOOL and discuss the results using the following cards.'] },
  'p3-2': {
    lines: [
      'Who could benefit most from our efforts around energy in the neighbourhood and how can we make a real difference?',
    ],
  },
  'p3-3': { lines: ['Is there a group of local residents and organisations we could involve in this project?'] },
  'p3-4': { lines: ['What does an energy community mean to you?'] },
  'p3-5': { lines: ['Is the ‘why’ of an energy community clear to everyone around the table?'] },
  'p3-6': {
    lines: [
      'Discuss the general CIRCUS definition of an energy community:',
      '“A group of rural residents and organisations ready to test the CIRCUS method, work together on the energy transition, and take action to build a more resilient community.”',
    ],
  },
  'p3-7': {
    lines: [
      'How will you translate your definition of an energy community into your group?',
      'How will you move forward with this definition?',
    ],
  },
  'p3-8': {
    lines: [
      'How can you formulate your objectives in a SMART way?',
      '(Specific, Measurable, Achievable, Relevant, Time-bound)',
    ],
  },
  'p3-9': {
    lines: [
      'Does this group reflect the diversity of people and organisations who live, work, provide services, or are active in the neighbourhood?',
      'Which groups or voices are still missing from the conversation?',
    ],
  },
  'p3-10': {
    lines: ['What skills are needed to drive this energy community forward?', 'Are these skills present within the group?'],
  },
  'p3-11': {
    lines: [
      'Who (person or team) will take on the role of leader, and what does that entail?',
      'What mandate and autonomy will the leader have?',
    ],
  },
  'p3-12': {
    lines: [
      'How can the leader be supported?',
      '(Operationally, communicatively, in terms of leadership, team support, etc.)',
    ],
  },
  'p3-13': {
    lines: ['Which partners/organizations can you collaborate with, both within and outside your own organization?'],
  },
  'p3-14': { lines: ['What is the individual motivation of each partner, and how can you turn it into a shared one?'] },
  'p3-15': { lines: ['How do you encourage open dialogue where different opinions are welcome?'] },
  'p3-16': {
    lines: ['At what point, and with which stakeholders, will the distribution of roles be discussed and revised if needed?'],
  },
  'p3-17': { lines: ['Clearly define the roles of the core group and the stakeholders.'] },
  'p3-18': { lines: ['What actions could strengthen collaboration between the different stakeholders?'] },
  'p3-19': {
    lines: [
      'How will you make decisions together about the direction of this project?',
      'What framework is already in place?',
    ],
  },
  'p3-20': {
    lines: [
      'How will you give a voice in the design, decision-making, and implementation to everyone who wants to be involved?',
    ],
  },
  'p3-21': {
    lines: [
      'How will you ensure that your structures are flexible enough to respond to opportunities and newly identified needs?',
    ],
  },
  'p3-22': { lines: ['When will you feel confident that the collaboration is working as it should?'] },
  'p3-23': {
    lines: [
      'What change (in terms of energy) would you like to see happen in the neighbourhood?',
      'Where do you want to be in ten (or twenty) years?',
    ],
  },
  'p3-24': { lines: ['What change(s) would you like to work on in the upcoming year?'] },
  'p3-25': { lines: ['What are the first steps you can take right now?'] },
  'p3-26': { lines: ['What will be the first signs that things are moving in the right direction?'] },
  'p3-27': {
    lines: [
      'Are there any actions or initiatives within this group that already have a clear long-term vision?',
      'What are they, and where are they taking place?',
    ],
  },
  'p3-28': {
    lines: [
      'Where and how do conversations about the long-term future take place with residents, partners, and the local council?',
    ],
  },
  'p3-29': { lines: ['How are residents and organizations encouraged to remain actively involved in this project?'] },
  'p3-30': {
    lines: [
      'Are there resources available or that can be tapped into to start, expand, and sustain achievements in the long term?',
    ],
  },
  'p3-31': { lines: ['Has fundraising been done?'] },
  'p3-32': { lines: ['Are there other funding streams available?'] },
  'p3-33': { lines: ['What steps will you take to link the project with other ongoing activities and structures?'] },
  'p3-34': {
    lines: [
      'Which available resources, including funding, meeting space, or communication tools, can help move the energy community forward?',
    ],
  },

  // Outro
  'io-end': {
    title: 'Your Energy Community, Your Future!',
    lines: [
      'The path to a successful energy community is a process of learning, collaborating, and growing step by step. With these WattWorks cards, you have a tool at your disposal to consciously make choices as a group, listen to everyone’s voice, and collectively set a direction.',
      'Keep the conversation going: use the questions to regularly reflect on where you stand and where you want to go.',
      'Make it a working tool: WattWorks is your conversation starter and thinking framework, so don’t leave it on a shelf, but use it actively during meetings and collaborative sessions.',
      'Take action: reflection is valuable, but real impact happens by taking concrete steps.',
      'An energy community grows with and through the people who are part of it. By continuing to learn, decide, and act together, you are building a future where local, sustainable energy is accessible to everyone.',
      'Good luck with your journey – and remember: the power of change lies in collaboration!',
    ],
  },
  'io-boost-1': { lines: ['Do you make time for reflection and evaluation?', 'How, where, and with whom?'] },
  'io-boost-2': { lines: ['Is there regular feedback among members about how the collaboration is progressing?'] },
  'io-boost-3': { lines: ['When and with whom is it decided what you want to achieve with specific actions?'] },
  'io-boost-4': { lines: ['How do you discuss things that are not going in the right direction?'] },
  'io-boost-5': { lines: ['How does everyone keep track of what’s going on and in progress?'] },
};
