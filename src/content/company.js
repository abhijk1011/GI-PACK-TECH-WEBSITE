'use strict';

/*
 * Global settings, page blocks and the value-equation rows.
 *
 * `group_name` and `label` are carried on each setting because they read as
 * documentation: they say where a value belongs and what it is for, which is
 * what makes this file navigable at 500 lines.
 */

const settings = [
  // --- Identity -----------------------------------------------------------
  { key: 'company_name', value: 'GI PackTech', label: 'Company name', group_name: 'Identity', sort: 1 },
  {
    key: 'company_descriptor',
    value: 'Industrial Flexible Innovative Packaging Solutions',
    label: 'Descriptor',
    hint: 'Sits under the logo and in the footer',
    group_name: 'Identity',
    sort: 2,
  },
  {
    key: 'positioning_line',
    value: 'We do not sell packaging. We protect the value of what is inside it.',
    label: 'Positioning line',
    hint: 'The single line the whole site is built around. Change with care.',
    input_type: 'textarea',
    group_name: 'Identity',
    sort: 3,
  },
  { key: 'established_year', value: '2006', label: 'Established year', group_name: 'Identity', sort: 4 },
  {
    key: 'nature_of_business',
    value: 'Manufacturer and Exporter',
    label: 'Nature of business',
    group_name: 'Identity',
    sort: 5,
  },
  // --- Contact ------------------------------------------------------------
  { key: 'contact_person', value: 'Mr. Alpesh Desai', label: 'Contact person', group_name: 'Contact', sort: 1 },
  { key: 'contact_title', value: 'Chief Executive Officer', label: 'Contact title', group_name: 'Contact', sort: 2 },
  { key: 'phone', value: '+91 98210 18387', label: 'Phone', group_name: 'Contact', sort: 3 },
  {
    key: 'whatsapp',
    value: '919821018387',
    label: 'WhatsApp number',
    hint: 'Digits only, with country code. Used to build the WhatsApp link.',
    group_name: 'Contact',
    sort: 4,
  },
  {
    key: 'email',
    value: 'alpesh@gibags.net',
    label: 'Email',
    hint: 'Update this when the GI PackTech domain mailbox is live',
    group_name: 'Contact',
    sort: 5,
  },
  {
    key: 'plant_address',
    value: 'Plot No. 608, New GIDC, Gundlav, Valsad, Gujarat 396035, India',
    label: 'Manufacturing plant address',
    input_type: 'textarea',
    group_name: 'Contact',
    sort: 6,
  },
  {
    key: 'office_address',
    value: 'Rajneel Bunglow, North Avenue Corner, Linking Road, Santacruz (West), Mumbai 400054, India',
    label: 'Mumbai office address',
    input_type: 'textarea',
    group_name: 'Contact',
    sort: 7,
  },
  { key: 'gst_number', value: '24AELPD7472E1ZL', label: 'GST number', group_name: 'Contact', sort: 8 },

  // --- Credentials --------------------------------------------------------
  {
    key: 'show_iso',
    value: '1',
    label: 'Show ISO certification',
    hint: 'Turn off if the certificate ever lapses',
    input_type: 'bool',
    group_name: 'Credentials',
    sort: 1,
  },
  {
    key: 'iso_text',
    value: 'ISO 9001:2015 Certified',
    label: 'ISO certification text',
    hint: 'ISOQAR / UKAS registered',
    group_name: 'Credentials',
    sort: 2,
  },
  { key: 'employees', value: '51 to 100', label: 'Total employees', group_name: 'Credentials', sort: 3 },
  { key: 'legal_status', value: 'Individual — Proprietor', label: 'Legal status', group_name: 'Credentials', sort: 4 },
  {
    key: 'stat_products',
    value: '41',
    label: 'Number of products',
    hint: 'Shown in the headline statistics',
    group_name: 'Credentials',
    sort: 5,
  },
  {
    key: 'stat_categories',
    value: '7',
    label: 'Number of categories',
    group_name: 'Credentials',
    sort: 6,
  },
  {
    key: 'stat_diameter',
    value: '6" – 100"',
    label: 'Drum liner diameter range',
    group_name: 'Credentials',
    sort: 7,
  },

  // --- Social -------------------------------------------------------------
  { key: 'linkedin_url', value: '', label: 'LinkedIn URL', group_name: 'Social', sort: 1 },
  { key: 'facebook_url', value: '', label: 'Facebook URL', group_name: 'Social', sort: 2 },
  { key: 'instagram_url', value: '', label: 'Instagram URL', group_name: 'Social', sort: 3 },
  { key: 'youtube_url', value: '', label: 'YouTube URL', group_name: 'Social', sort: 4 },
  { key: 'indiamart_url', value: '', label: 'IndiaMART URL', group_name: 'Social', sort: 5 },

  // --- SEO ----------------------------------------------------------------
  {
    key: 'site_url',
    value: 'https://www.gipacktech.com',
    label: 'Site URL',
    hint: 'Set this to your real domain once it is bought. Used for canonical URLs, sitemap and social tags.',
    group_name: 'SEO',
    sort: 1,
  },
  {
    key: 'default_seo_title',
    value: 'GI PackTech — Industrial Flexible Packaging Manufacturer, Valsad',
    label: 'Default page title',
    group_name: 'SEO',
    sort: 2,
  },
  {
    key: 'default_seo_description',
    value:
      'Custom made drum liners, FIBC liners, machine covers, pallet covers and hazardous containment. Manufacturer and exporter since 2006, Valsad, Gujarat. Every product built to your drawing.',
    label: 'Default meta description',
    input_type: 'textarea',
    group_name: 'SEO',
    sort: 3,
  },
  {
    key: 'seo_title_suffix',
    value: ' | GI PackTech',
    label: 'Title suffix',
    hint: 'Appended to page titles that do not set their own',
    group_name: 'SEO',
    sort: 4,
  },
  {
    key: 'robots_allow',
    value: '1',
    label: 'Allow search engines to index the site',
    hint: 'Turn this off while the site is still being reviewed before launch',
    input_type: 'bool',
    group_name: 'SEO',
    sort: 5,
  },
  {
    key: 'head_scripts',
    value: '',
    label: 'Custom head code',
    hint: 'Google Analytics, Search Console verification, Meta pixel. Pasted into every page <head>.',
    input_type: 'textarea',
    group_name: 'SEO',
    sort: 6,
  },
  {
    key: 'body_scripts',
    value: '',
    label: 'Custom body code',
    hint: 'Pasted just before the closing </body> tag on every page.',
    input_type: 'textarea',
    group_name: 'SEO',
    sort: 7,
  },

  // --- Enquiries ----------------------------------------------------------
  {
    key: 'enquiry_thanks',
    value:
      'Thank you. Your requirement has reached our technical team and we will come back to you with a specification, not just a price.',
    label: 'Enquiry thank-you message',
    input_type: 'textarea',
    group_name: 'Enquiries',
    sort: 1,
  },
  {
    key: 'cta_primary',
    value: 'Specify your requirement',
    label: 'Primary call to action',
    group_name: 'Enquiries',
    sort: 2,
  },
  {
    key: 'cta_secondary',
    value: 'Request a sample',
    label: 'Secondary call to action',
    group_name: 'Enquiries',
    sort: 3,
  },
];

/*
 * Page blocks: every heading and paragraph on the pages that are written
 * rather than generated from the catalogue.
 */
const pages = [
  {
    slug: 'home',
    title: 'Home',
    seo_title: 'GI PackTech — We Protect the Value of What Is Inside',
    seo_description:
      'Custom industrial packaging: drum liners from 6 to 100 inches, FIBC liners, machine covers and pallet covers. Manufacturer and exporter since 2006.',
    blocks: [
      { block_key: 'hero_eyebrow', label: 'Hero eyebrow', value: 'Manufacturer & exporter · Since 2006' },
      {
        block_key: 'hero_heading',
        label: 'Hero heading',
        input_type: 'textarea',
        value: 'We do not sell packaging.\nWe protect the value of what is inside it.',
        hint: 'A line break here becomes a line break on the page',
      },
      {
        block_key: 'hero_sub',
        label: 'Hero sub-heading',
        input_type: 'textarea',
        value:
          'A liner decides whether a lubricant arrives clean. A cover decides whether a machine tool arrives ready to run. Either way, the packaging costs a fraction of what it protects.',
      },
      { block_key: 'value_eyebrow', label: 'Value section eyebrow', value: 'The arithmetic' },
      {
        block_key: 'value_heading',
        label: 'Value section heading',
        input_type: 'textarea',
        value: 'When you save ten rupees on a liner and lose a lakh on a rejected batch, that is not a saving.',
      },
      {
        block_key: 'value_sub',
        label: 'Value section sub-heading',
        input_type: 'textarea',
        value:
          'The loss has only moved to a line nobody is watching. Two questions come before any specification.',
      },
      { block_key: 'value_q1', label: 'Question 1', value: 'What is the value of the product this packaging is protecting?' },
      { block_key: 'value_q2', label: 'Question 2', value: 'What does one failure cost you?' },

      { block_key: 'range_eyebrow', label: 'Range section eyebrow', value: 'Built to your drawing' },
      {
        block_key: 'range_heading',
        label: 'Range section heading',
        input_type: 'textarea',
        value: 'Nothing here is sold from a fixed standard range.',
      },
      {
        block_key: 'range_sub',
        label: 'Range section sub-heading',
        input_type: 'textarea',
        value:
          'Built to your drawing, your drum, your machine. Forty-one products so far — and not the limit of what the plant can make.',
      },

      { block_key: 'diameter_eyebrow', label: 'Diameter section eyebrow', value: 'A capability, not a claim' },
      {
        block_key: 'diameter_heading',
        label: 'Diameter section heading',
        input_type: 'textarea',
        value: 'Any drum internal diameter from 6 inches to 100 inches.',
      },
      {
        block_key: 'diameter_sub',
        label: 'Diameter section sub-heading',
        input_type: 'textarea',
        value:
          'Few manufacturers quote both ends of that range from one shop floor. Ours comes from our own lamination, extrusion, cutting and sealing lines.',
      },

      { block_key: 'roles_eyebrow', label: 'Roles section eyebrow', value: 'Start where the problem is' },
      {
        block_key: 'roles_heading',
        label: 'Roles section heading',
        input_type: 'textarea',
        value: 'A packaging decision passes through four people. Each is measured on something different.',
      },

      { block_key: 'proof_eyebrow', label: 'Proof section eyebrow', value: 'Real work' },
      {
        block_key: 'proof_heading',
        label: 'Proof section heading',
        input_type: 'textarea',
        value: 'Photographs of what we actually make.',
      },

      { block_key: 'plant_eyebrow', label: 'Plant section eyebrow', value: 'The plant' },
      {
        block_key: 'plant_heading',
        label: 'Plant section heading',
        input_type: 'textarea',
        value: 'One organisation, from enquiry to sample to production.',
      },
      {
        block_key: 'plant_body',
        label: 'Plant section body',
        input_type: 'textarea',
        value:
          'Lamination, extrusion, cutting, heat sealing, R&D and quality all sit in one building at Gundlav, Valsad. A specification moves from enquiry to sample to production without waiting on anyone outside.',
      },

      { block_key: 'cta_eyebrow', label: 'Closing CTA eyebrow', value: 'Send us the problem' },
      {
        block_key: 'cta_heading',
        label: 'Closing CTA heading',
        input_type: 'textarea',
        value: 'Send the drawing, the drum, or the data sheet.',
      },
      {
        block_key: 'cta_body',
        label: 'Closing CTA body',
        input_type: 'textarea',
        value:
          'Every product we make is built to order, so the conversation starts with your specification rather than with our price list. Sample liners and trial covers are supplied for fitment before bulk production begins.',
      },
    ],
  },
  {
    slug: 'about',
    title: 'About',
    seo_title: 'About GI PackTech — Manufacturer and Exporter Since 2006',
    seo_description:
      'GI PackTech is a Gujarat-based manufacturer and exporter of custom made industrial packaging. In-house lamination, extrusion, cutting, heat-sealing, R&D and quality.',
    blocks: [
      { block_key: 'hero_eyebrow', label: 'Hero eyebrow', value: 'Since 2006' },
      {
        block_key: 'hero_heading',
        label: 'Hero heading',
        input_type: 'textarea',
        value: 'A packaging company that specifies the material against the product.',
      },
      {
        block_key: 'intro',
        label: 'Introduction',
        input_type: 'textarea',
        value:
          'A Gujarat manufacturer and exporter of custom industrial packaging since 2006. Every product is built to a drawing, a drum, a machine or an application. Nothing is sold from a fixed standard range.\n\nLamination, extrusion, cutting, heat sealing, R&D and quality all run in one building at Gundlav, Valsad — so a specification moves from enquiry to sample to production without waiting on anyone outside.',
      },
      {
        block_key: 'belief_heading',
        label: 'Belief heading',
        input_type: 'textarea',
        value: 'Packaging is the last thing standing between a finished product and everything that can happen to it.',
      },
      {
        block_key: 'belief_body',
        label: 'Belief body',
        input_type: 'textarea',
        value:
          'Almost every buyer treats packaging as a cost to be reduced. It sits in the purchase department as a line item, and nobody is promoted for choosing better packaging.\n\nWe think that is the wrong way round. A drum liner is what decides whether a lubricant reaches its customer clean or contaminated. A machine cover is what decides whether a machine tool arrives ready to run or arrives with a corroded slideway. A pallet cover is what decides whether a full pallet is sold or written off. In every one of those cases the packaging is a tiny fraction of the value it is protecting.',
      },
      {
        block_key: 'refuse_heading',
        label: 'Standards heading',
        input_type: 'textarea',
        value: 'We would rather refuse a job than supply a film that will fail.',
      },
      {
        block_key: 'refuse_body',
        label: 'Standards body',
        input_type: 'textarea',
        value:
          'Material compatibility is worked out case by case against your product data sheet before anything is quoted. Where a customer\'s process cannot guarantee grounding at every transfer, we recommend Type D even though it changes the order. Where PVC is not the right answer, we say so.\n\nThat approach is slower than quoting a rate, and it is the reason chemical and pharmaceutical customers come back to us.',
      },
    ],
  },
  {
    slug: 'faq',
    title: 'FAQ',
    seo_title: 'Industrial Packaging FAQ — Drum Liners & FIBC | GI PackTech',
    seo_description:
      'Straight answers on drum liner sizes, materials, minimum quantities, lead times, samples and antistatic grades — from the manufacturer, not a reseller.',
    blocks: [
      { block_key: 'hero_eyebrow', label: 'Hero eyebrow', value: 'Answers' },
      {
        block_key: 'hero_heading',
        label: 'Hero heading',
        input_type: 'textarea',
        value: 'Questions we are asked every week.',
      },
      {
        block_key: 'intro',
        label: 'Introduction',
        input_type: 'textarea',
        value:
          'Sizes, materials, minimum quantities, lead times and samples. Answered by the people who run the line.',
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    seo_title: 'Contact GI PackTech — Valsad, Gujarat',
    seo_description:
      'Contact GI PackTech. Manufacturing plant at Gundlav, Valsad, Gujarat and office in Santacruz West, Mumbai. Send your drawing, drum dimensions or product data sheet.',
    blocks: [
      { block_key: 'hero_eyebrow', label: 'Hero eyebrow', value: 'Talk to the technical team' },
      {
        block_key: 'hero_heading',
        label: 'Hero heading',
        input_type: 'textarea',
        value: 'Start with the problem, not the price list.',
      },
      {
        block_key: 'intro',
        label: 'Introduction',
        input_type: 'textarea',
        value:
          'Send the drawing, the drum dimensions or the product data sheet. What comes back is a specification, and a sample for trial fitment.',
      },
    ],
  },
  {
    slug: 'specify',
    title: 'Specify Your Requirement',
    seo_title: 'Specify Your Packaging Requirement | GI PackTech',
    seo_description:
      'Give us the product, the container dimensions and the handling conditions, and we will issue a firm specification and quotation without a second round of questions.',
    blocks: [
      { block_key: 'hero_eyebrow', label: 'Hero eyebrow', value: 'Enquiry checklist' },
      {
        block_key: 'hero_heading',
        label: 'Hero heading',
        input_type: 'textarea',
        value: 'Every product we make is made to order.',
      },
      {
        block_key: 'intro',
        label: 'Introduction',
        input_type: 'textarea',
        value:
          'These answers let us issue a firm specification and quotation without a second round of questions. Answer what you know — the rest can follow.',
      },
    ],
  },
];

/*
 * The value equation. Left column is what a buyer sees on the quotation,
 * right column is what sits behind it.
 */
const valueRows = [
  { seen: 'The price of the packaging', unseen: 'The value of the product inside it' },
  { seen: 'A saving of a few rupees per piece', unseen: 'A rejected batch, a warranty claim, a lost customer' },
  { seen: 'Packaging as a purchase line', unseen: 'Packaging as insurance on a much larger asset' },
  { seen: 'A cost this quarter', unseen: 'A drum, a cover or a bund that is reused for years' },
  { seen: 'One supplier the same as another', unseen: 'A supplier who specifies the material against the product' },
];

module.exports = { settings, pages, valueRows };
