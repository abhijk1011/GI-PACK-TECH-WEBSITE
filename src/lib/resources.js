'use strict';

/*
 * Declarative definitions for the simpler admin sections.
 * Each one gets a list view and an edit form generated from `fields`,
 * so adding a column to a table only means adding it here.
 *
 * field.type: text | textarea | lines | number | bool | image | select
 *   'lines'  -- newline-separated list, rendered as a textarea with a hint
 */
const resources = {
  categories: {
    label: 'Categories',
    singular: 'Category',
    table: 'categories',
    order: 'sort, id',
    listColumns: ['number', 'name', 'sort', 'published'],
    publicPath: (row) => `/products/${row.slug}`,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true, hint: 'Appears in the address: /products/your-slug' },
      { key: 'number', label: 'Number', type: 'text', hint: 'Shown as 01, 02 … on cards' },
      { key: 'short_name', label: 'Short name', type: 'text', hint: 'Used in menus and the footer' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'problem_lead', label: 'Problem lead', type: 'textarea', hint: 'The loss this category prevents. Shown in orange at the top of the category page.' },
      { key: 'intro', label: 'Introduction', type: 'textarea', hint: 'Leave a blank line between paragraphs' },
      { key: 'seo_title', label: 'SEO title', type: 'text', group: 'SEO' },
      { key: 'seo_description', label: 'Meta description', type: 'textarea', group: 'SEO', hint: 'Aim for 150–160 characters' },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
  },

  industries: {
    label: 'Industries',
    singular: 'Industry',
    table: 'industries',
    order: 'priority, id',
    listColumns: ['name', 'priority', 'published'],
    publicPath: (row) => `/industries/${row.slug}`,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'applications', label: 'Applications', type: 'text', hint: 'One line summary shown on cards' },
      { key: 'problem_lead', label: 'Problem lead', type: 'textarea', hint: 'What this sector loses. Opens the industry page.' },
      { key: 'intro', label: 'Introduction', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'number', hint: 'Lower numbers appear first' },
      { key: 'seo_title', label: 'SEO title', type: 'text', group: 'SEO' },
      { key: 'seo_description', label: 'Meta description', type: 'textarea', group: 'SEO' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
    links: { table: 'industry_products', selfKey: 'industry_id', label: 'Products shown on this page' },
  },

  roles: {
    label: 'Buyer roles',
    singular: 'Role',
    table: 'roles',
    order: 'sort, id',
    listColumns: ['name', 'cares_about', 'sort', 'published'],
    publicPath: (row) => `/for/${row.slug}`,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'short_name', label: 'Short name', type: 'text' },
      { key: 'cares_about', label: 'What they care about', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'textarea', hint: 'The problem this person already recognises' },
      { key: 'intro', label: 'Introduction', type: 'textarea' },
      { key: 'points', label: 'What changes', type: 'lines', hint: 'One point per line' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['gauge', 'check', 'shield', 'calculator', 'users', 'factory', 'ruler'] },
      { key: 'seo_title', label: 'SEO title', type: 'text', group: 'SEO' },
      { key: 'seo_description', label: 'Meta description', type: 'textarea', group: 'SEO' },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
    links: { table: 'role_products', selfKey: 'role_id', label: 'Products shown on this page' },
  },

  materials: {
    label: 'Materials',
    singular: 'Material',
    table: 'materials',
    order: 'sort, id',
    listColumns: ['name', 'main_property', 'sort', 'published'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'main_property', label: 'Main property', type: 'text' },
      { key: 'specified_for', label: 'Usually specified for', type: 'text' },
      { key: 'detail', label: 'Detail', type: 'textarea', hint: 'Shown in the card below the table' },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
  },

  faqs: {
    label: 'FAQ',
    singular: 'Question',
    table: 'faqs',
    order: 'sort, id',
    listColumns: ['question', 'category', 'sort', 'published'],
    publicPath: (row) => `/faq#${row.slug}`,
    fields: [
      { key: 'question', label: 'Question', type: 'text', required: true, hint: 'Phrase it the way a customer would type or say it' },
      {
        key: 'answer',
        label: 'Answer',
        type: 'textarea',
        required: true,
        hint: 'Open with the answer itself, and keep it under about 70 words. Search results and AI assistants quote the first sentence, so it has to make sense on its own.',
      },
      { key: 'slug', label: 'URL slug', type: 'text', required: true, hint: 'Used as the link anchor: /faq#your-slug' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['ordering', 'drum-liners', 'fibc', 'machine-covers', 'materials', 'specifying', 'company'],
      },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
  },

  value_rows: {
    label: 'Value equation',
    singular: 'Row',
    table: 'value_rows',
    order: 'sort, id',
    listColumns: ['seen', 'unseen', 'sort', 'published'],
    fields: [
      { key: 'seen', label: 'What the buyer sees', type: 'text', required: true },
      { key: 'unseen', label: 'What the buyer does not see', type: 'text', required: true },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
  },

  checklist_items: {
    label: 'Enquiry checklist',
    singular: 'Question',
    table: 'checklist_items',
    order: 'step, sort, id',
    listColumns: ['question', 'step', 'input_type', 'published'],
    fields: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'field_key', label: 'Field key', type: 'text', required: true, hint: 'Internal name. Letters, numbers and underscores only.' },
      { key: 'why', label: 'Why it is asked', type: 'text', hint: 'Shown under the field. This is what makes the form read as technical.' },
      { key: 'input_type', label: 'Input type', type: 'select', options: ['text', 'textarea', 'select'] },
      { key: 'options', label: 'Options', type: 'lines', hint: 'One per line. Only used when the input type is Select.' },
      { key: 'step', label: 'Step', type: 'number', hint: '1, 2 or 3' },
      { key: 'required', label: 'Required', type: 'bool' },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
  },

  case_studies: {
    label: 'Case examples',
    singular: 'Case example',
    table: 'case_studies',
    order: 'sort, id',
    listColumns: ['title', 'sector', 'sort', 'published'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'sector', label: 'Sector', type: 'text' },
      { key: 'problem', label: 'The problem', type: 'textarea' },
      { key: 'solution', label: 'What was supplied', type: 'textarea' },
      { key: 'result', label: 'The result', type: 'textarea', hint: 'Keep the numbers, remove the customer name' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'seo_title', label: 'SEO title', type: 'text', group: 'SEO' },
      { key: 'seo_description', label: 'Meta description', type: 'textarea', group: 'SEO' },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool' },
    ],
  },

  redirects: {
    label: 'Redirects',
    singular: 'Redirect',
    table: 'redirects',
    order: 'id',
    listColumns: ['from_path', 'to_path', 'code'],
    fields: [
      { key: 'from_path', label: 'From path', type: 'text', required: true, hint: 'e.g. /old-page' },
      { key: 'to_path', label: 'To path', type: 'text', required: true, hint: 'e.g. /products/round-drum-liners' },
      { key: 'code', label: 'Status code', type: 'select', options: ['301', '302'] },
    ],
  },
};

/* Fields on a product, grouped for the bespoke product editor. */
const productFields = [
  { key: 'name', label: 'Name', type: 'text', required: true, group: 'Basics' },
  { key: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Basics' },
  { key: 'code', label: 'Catalogue code', type: 'text', group: 'Basics', hint: 'e.g. 1.1' },
  { key: 'tagline', label: 'Tagline', type: 'text', group: 'Basics', hint: 'One line under the product name' },
  { key: 'badge', label: 'Badge', type: 'text', group: 'Basics', hint: 'Small label on the image, e.g. Flagship. Leave empty for none.' },

  { key: 'problem_headline', label: 'Problem headline', type: 'textarea', group: 'The problem', hint: 'The loss the buyer is already carrying. This opens the page.' },
  { key: 'problem_body', label: 'Problem body', type: 'textarea', group: 'The problem', hint: 'Leave a blank line between paragraphs' },

  { key: 'description', label: 'What it is', type: 'textarea', group: 'The product' },
  { key: 'features', label: 'Key features', type: 'lines', group: 'The product', hint: 'One feature per line' },
  { key: 'difference_body', label: 'How we build it', type: 'textarea', group: 'The product' },
  { key: 'customise', label: 'What can be customised', type: 'lines', group: 'The product', hint: 'One option per line. These appear as chips and are the upsell surface.' },

  { key: 'materials', label: 'Materials', type: 'textarea', group: 'Specification' },
  { key: 'sizes', label: 'Sizes', type: 'textarea', group: 'Specification' },
  { key: 'applications', label: 'Applications', type: 'textarea', group: 'Specification' },
  { key: 'where_used', label: 'Where it is used', type: 'textarea', group: 'Specification' },

  { key: 'seo_title', label: 'SEO title', type: 'text', group: 'SEO' },
  { key: 'seo_description', label: 'Meta description', type: 'textarea', group: 'SEO', hint: 'Aim for 150–160 characters' },

  { key: 'image_brief', label: 'Photograph brief', type: 'textarea', group: 'Admin notes', hint: 'Not shown on the site. Give this to a photographer, or use it as an AI image prompt.' },
  { key: 'sort', label: 'Sort order', type: 'number', group: 'Admin notes' },
  { key: 'featured', label: 'Featured on the home page', type: 'bool', group: 'Admin notes' },
  { key: 'published', label: 'Published', type: 'bool', group: 'Admin notes' },
];

module.exports = { resources, productFields };
