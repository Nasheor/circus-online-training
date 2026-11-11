/** Text for the About, Privacy, Accessibility and Feedback pages. */
export const about = {
  title: 'About this training',
  lead: 'This site is the online training in the CIRCUS method. It introduces the three tools and the participatory practice so that communities and future advisors can start using them on their own.',
  sections: [
    {
      title: 'The CIRCUS project',
      paragraphs: [
        'CIRCUS stands for Connecting Initiatives for Rural Communities, Upscaling their Sustainable energy. It is an Interreg North-West Europe project (NWE0200304) in which eleven partners from Belgium, France, Germany, Ireland and the Netherlands develop and test a method for emerging groups to set up an energy community.',
        'The method follows three steps: awareness and energy saving, exploring local renewable production, and working together as an energy community. It is being tested with rural communities in the five countries.',
      ],
    },
    {
      title: 'What this training is',
      paragraphs: [
        'It is a light, self-paced introduction: what each tool is for, how to use it, and a way to try it straight away. It complements the multi-day training given by the project partners, and it does not lead to a certificate.',
        'This is an early version, still being developed and tested. It is in English; French, Dutch and German are planned.',
      ],
    },
    {
      title: 'Who made what',
      paragraphs: [
        'The WattWorks cards and the participatory practice are led by Landelijke Gilden. The Energy Profile Tool is led by LochemEnergie, the GIS Tool by the Karlsruhe Institute of Technology (KIT), and the Business Model Tool by Énergies citoyennes en Pays de Vilaine (EPV) with RECIT. This online training is developed by Munster Technological University (MTU).',
        'The Energy Profile calculator on this site follows the Excel tool by LochemEnergie; the differences are listed on its own page.',
      ],
    },
  ],
  partnersTitle: 'Project partners',
  partners: [
    'Landelijke Gilden (BE) – lead partner',
    'Innovatiesteunpunt / Boerenbond (BE)',
    'Énergies citoyennes en Pays de Vilaine (FR)',
    'Munster Technological University (IE)',
    'University of Twente (NL)',
    'Karlsruhe Institute of Technology (DE)',
    'Rurant (BE)',
    'ZLTO (NL)',
    'South Kerry Development Partnership (IE)',
    'LochemEnergie (NL)',
    'RECIT (FR)',
  ],
  fundingTitle: 'Funding',
  licenceTitle: 'Reuse',
  licence:
    'The CIRCUS results are public and free to use. The exact licence terms for this site and for the partner materials are being agreed by the project partners and will be stated here.',
  differences: 'How the Energy Profile calculator differs from the Excel tool',
  projectSite: 'Visit the CIRCUS project website',
  links: { privacy: 'Privacy', accessibility: 'Accessibility statement', feedback: 'Feedback' },
};

export const privacy = {
  title: 'Privacy',
  lead: 'This site does not collect personal data. There is no account, no cookies and no tracking.',
  sections: [
    {
      title: 'What stays on your device',
      paragraphs: [
        'Everything you type into the tools — your community’s details, energy profile, card notes, candidate sites and business model — is stored in your own browser (in its local storage) and nowhere else. It is not sent to us or to anyone.',
        'You can save your work as a file, open it again, or erase it, on the My community page. Clearing your browser’s site data also erases it. If several people use the same browser profile, they will see the same work. Your choice of the light or dark theme is kept in the same place.',
      ],
    },
    {
      title: 'What the web server sees',
      paragraphs: [
        'As with any website, the server that delivers these pages receives technical information such as your IP address and browser type in order to send you the page. This site adds no analytics, advertising or social media scripts, and loads its fonts and images from its own address.',
      ],
    },
    {
      title: 'Links to other services',
      paragraphs: [
        'Some materials are hosted by the project partners: the GIS Tool maps on QGIS Cloud (KIT), documents on a Nextcloud server (RECIT) and folders on Google Drive. These open in a new tab and are subject to the privacy terms of those services.',
        'On a region page of the GIS Tool you can choose to load the map inside this site. Only if you press that button does your browser connect to qgiscloud.com, which sets a cookie and uses its own analytics.',
        'Comments you add to a map’s feedback layer are stored by that map service and are visible to its operators.',
      ],
    },
  ],
};

export const accessibility = {
  title: 'Accessibility statement',
  lead: 'We want everyone to be able to use this training, including people who use a keyboard, a screen reader, magnification or their own colours.',
  status:
    'This is an early version. It has been built to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA, but it has not yet been independently audited, so we do not claim full conformance.',
  sections: [
    {
      title: 'What we have done',
      bullets: [
        'Every tool can be used with the keyboard alone; nothing requires dragging.',
        'Form fields have visible labels and say what is wrong when a value cannot be used.',
        'Text and controls meet contrast requirements, and a phase is never identified by colour alone.',
        'Every chart has the same figures available as a table.',
        'Pages reflow on small screens and at high zoom without sideways scrolling of the page.',
        'The site respects your browser’s “reduce motion” setting.',
      ],
    },
    {
      title: 'Known limitations',
      bullets: [
        'The original PDF files (card print files, manuals, the Business Model Tool PDF) and the Excel workbook were not made for assistive technology. The cards, the manuals’ instructions and the calculator are available on this site as accessible pages instead.',
        'The GIS Tool maps are an external service and have not been assessed. Each region page describes the map’s layers in text.',
        'Documents hosted by partners may not be accessible.',
        'The site is in English only for now.',
      ],
    },
    {
      title: 'Tell us about a problem',
      paragraphs: [
        'If you cannot use part of this site, or need the content in another form, please tell us through the Feedback page. Say which page it concerns and what you were trying to do.',
      ],
    },
  ],
  prepared: 'This statement was prepared on 6 October 2026 and will be reviewed when the site is published.',
};

export const feedback = {
  title: 'Feedback',
  lead: 'This training is being tested alongside the CIRCUS multi-day trainings. What you tell us decides what gets improved.',
  howTitle: 'How to send feedback',
  how: 'For now, feedback reaches the team through the contact page of the CIRCUS project website. Mention “online training” so that it is passed on to MTU.',
  contact: 'Open the contact page of the project website',
  questionsTitle: 'What helps us most',
  questions: [
    'Which tool or page were you using, and what were you trying to do?',
    'What was unclear, missing or wrong?',
    'Did the tool work on your device and with your group (for example on a projector)?',
    'Which language would you need it in?',
    'Would you use it again with a community? What would make that easier?',
  ],
};
