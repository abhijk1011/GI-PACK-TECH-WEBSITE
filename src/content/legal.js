'use strict';

/*
 * The privacy policy.
 *
 * Kept as content rather than as markup for the same reason the FAQ is: it is
 * a document somebody will need to edit without touching a template.
 *
 * Three rules govern edits here.
 *
 * The first is that every sentence has to be true of this site as it is built
 * today, not of a generic website. This site sets no cookies, runs no
 * analytics, loads no third-party fonts and has no database behind it, so the
 * policy says so plainly rather than hedging with the boilerplate most
 * policies carry. That plain statement is also the trap: the moment somebody
 * pastes a Google Analytics tag into `head_scripts`, embeds a map, or adds a
 * chat widget, the "what this site does not do" section becomes a false
 * statement in a legal document. Change this file in the same commit.
 *
 * The second is that it is written as a function of settings rather than as a
 * literal. A privacy policy naming an address, a mailbox and a grievance
 * officer is exactly the document that must not disagree with the footer, and
 * the only way to guarantee that is to read both from the same place. Nothing
 * below hard-codes a contact detail that src/content/company.js already holds.
 *
 * The third is that the dates are edit dates, not deploy dates. A policy that
 * silently re-dates itself on every build tells a reader nothing about when
 * the terms last moved, so `updated` is written by hand and moves only when
 * the words move.
 */

// Written by hand. See the note above.
const EFFECTIVE = '19 September 2026';
const UPDATED = '19 September 2026';

/** Builds the policy against the site settings, so no detail is stated twice. */
function privacyPolicy(s) {
  const host = (s.site_url || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');

  return {
    effective: EFFECTIVE,
    updated: UPDATED,

    intro:
      'This site exists to take an engineering enquiry and answer it with a specification. ' +
      'The only personal data it asks for is what a technical reply needs: who you are, where ' +
      'to reach you, and what you are trying to protect. It sets no cookies, runs no analytics, ' +
      'and carries no advertising or tracking of any kind.',

    sections: [
      {
        slug: 'who-we-are',
        name: 'Who we are',
        heading: 'Who we are, and who is responsible for your data',
        body:
          `${s.company_name} is a ${(s.nature_of_business || 'manufacturer and exporter').toLowerCase()} of ` +
          `industrial flexible packaging, working from Gundlav, Valsad, in Gujarat, India, and trading since ` +
          `${s.established_year}. This website${host ? `, ${host},` : ''} is ours.\n\n` +
          `For the purposes of the Digital Personal Data Protection Act, 2023, ${s.company_name} is the Data ` +
          'Fiduciary for the personal data described here: we decide what this site collects and why. Where ' +
          'the General Data Protection Regulation applies, because you are enquiring from the European Union ' +
          'or the United Kingdom, we are the Data Controller for the same data.\n\n' +
          'Anything in this policy can be raised with the person named under Grievance officer below, and it ' +
          'reaches a person rather than a ticket queue.',
        rows: [
          ['Business', s.company_name],
          ['Legal status', s.legal_status],
          ['Works', s.plant_address],
          ['Office', s.office_address],
          ['GST', s.gst_number],
        ],
      },

      {
        slug: 'scope',
        name: 'What this covers',
        heading: 'What this policy covers',
        body:
          'This policy covers the personal data you give us through this website, and what happens to it ' +
          'afterwards, which in practice means the enquiry correspondence that follows: an enquiry sent here ' +
          'is answered by email or telephone like any other.\n\n' +
          'It does not cover the other places our name appears. Our profiles on LinkedIn, Instagram, Facebook, ' +
          'IndiaMART and Google run on somebody else\'s platform under somebody else\'s policy, and WhatsApp is ' +
          'Meta\'s service rather than ours. What you send us through any of them reaches us; what those ' +
          'companies do with it is governed by their own terms.',
      },

      {
        slug: 'what-we-collect',
        name: 'What we collect',
        heading: 'What we collect, and only what we collect',
        body:
          'There are exactly two places on this site where you can give us personal data, and both are forms ' +
          'you choose to fill in. There is no account to create, nothing to log into, and no payment taken ' +
          'anywhere on this site.',
        subsections: [
          {
            title: 'The contact form, at /contact',
            list: [
              'Your name',
              'Your company',
              'Your email address',
              'Your telephone number, if you choose to give one',
              'Whatever you write in the message field',
            ],
          },
          {
            title: 'The specification form, at /specify',
            intro:
              'The same contact details as above, your role if you select one, and the technical answers the ' +
              'form asks for:',
            list: [
              'The product you are enquiring about, and what you intend to pack in it',
              'Container or machine dimensions, container type, and the fill and discharge method',
              'Temperature range, flammability or static sensitivity, and whether a food, pharma or other regulated grade is required',
              'Storage duration and location, transport route, and whether the item is single use or reusable',
              'Estimated annual quantity, call-off pattern, and any printing or coding required',
            ],
          },
          {
            title: 'Technical data, collected automatically',
            intro:
              'Serving a page leaves the record that serving any page leaves. Our host logs the request: the ' +
              'IP address it came from, the time, the page asked for, the browser and operating system that ' +
              'asked, and the page that referred you, if any. We do not join those logs to the forms, and we ' +
              'do not use them to build a profile of you.',
          },
        ],
        after:
          'Both forms carry a hidden field named "website" that you will never see and should never fill in. ' +
          'It is a spam trap: automated scripts fill every field on a page, and a submission with that field ' +
          'completed is discarded. It collects nothing about you.\n\n' +
          'Please do not send us data we have not asked for. A specification is a technical document, and none ' +
          'of it needs a health record, a government identity number, a bank detail or anything else the law ' +
          'treats as sensitive. If you send such data anyway, we will delete it rather than file it.',
      },

      {
        slug: 'what-we-dont',
        name: 'What we do not do',
        heading: 'What this site does not do',
        body:
          'Most privacy policies are long because most websites do a great deal more than they need to. This ' +
          'one is short in the places that matter, and the list below is the reason. As this site is built and ' +
          'deployed today:',
        list: [
          'It sets no cookies of its own, for any purpose.',
          'It runs no analytics. No Google Analytics, no Meta pixel, no heatmaps, no session recording, no A/B testing.',
          'It carries no advertising, and no advertising or retargeting tags.',
          'It loads no fonts, scripts or stylesheets from a third party. The typefaces are served from our own domain precisely so that reading a page tells nobody else you read it.',
          'It embeds nothing. No maps, no video players, no chat widget, no social feed.',
          'It has no database and no public login, so there is no store of visitors to breach.',
          'We never sell personal data, rent it, trade it, or hand it to a data broker or an advertising network. There is no circumstance in which we would.',
        ],
        after:
          'Because there is no tracking to consent to, this site shows no cookie banner. That is not an ' +
          'omission; there is nothing to ask you about.\n\n' +
          'If any of that changes, if a measurement tool or an embedded map is ever added, this policy will be ' +
          'updated with the change and the date at the top of the page will move.',
      },

      {
        slug: 'why',
        name: 'Why we use it',
        heading: 'Why we use it, and on what basis',
        body: 'Your enquiry is used to answer your enquiry. Specifically, we use what you send us to:',
        list: [
          'Work out whether the material is compatible with your product, and specify a construction against it',
          'Prepare a quotation, and arrange a sample for trial fitment',
          'Reply to you, and carry on the technical conversation that follows',
          'Keep a record of what was specified and quoted, so that a repeat order matches the first one',
          'Meet the tax, accounting and record-keeping obligations that apply once an order is placed',
        ],
        after:
          'Under the Digital Personal Data Protection Act, 2023 we rely on the consent you give by sending the ' +
          'form, and on the legitimate use of responding to an approach you made to us. Under the GDPR, where ' +
          'it applies, the basis is Article 6(1)(b), steps taken at your request before entering a contract and ' +
          'performance of it afterwards, with Article 6(1)(c) covering records we are required by law to keep ' +
          'and Article 6(1)(f) covering our interest in holding a usable record of past specifications.\n\n' +
          'We do not use your enquiry for automated decision-making or profiling, and we do not add you to a ' +
          'marketing list on the strength of it. If we ever want to send you something you did not ask for, we ' +
          'will ask you first.',
      },

      {
        slug: 'sharing',
        name: 'Who else sees it',
        heading: 'Who else sees it',
        body:
          'Inside the business, an enquiry is seen by the technical and commercial people who need it to ' +
          'answer you, and no wider. Outside it, the list is short, and every name on it is a supplier doing a ' +
          'defined job for us under its own terms:',
        list: [
          'Netlify, Inc. (United States) hosts this website and receives the form submissions. A submission is stored in our account there so it can be read and answered, and Netlify processes it on our instructions.',
          'Our email and telephone providers carry the reply, in the ordinary way email and calls are carried.',
          'Our accountant and auditor see order records where the law requires them to.',
        ],
        after:
          'Beyond that we disclose personal data only where a court, a tax authority or another body with the ' +
          'legal power to compel it requires us to, and only as far as that requirement reaches. If this ' +
          'business is ever sold or transferred, customer records may transfer with it, and the buyer would be ' +
          'bound by this policy until it told you otherwise.',
      },

      {
        slug: 'transfers',
        name: 'Where it is held',
        heading: 'Where it is held, and transfers out of India',
        body:
          'Your enquiry is read and worked on in India, at Valsad and Mumbai. Before it reaches us it passes ' +
          'through and is stored on infrastructure our host operates outside India, principally in the United ' +
          'States, and our email is likewise carried by servers that may sit outside India.\n\n' +
          'The Digital Personal Data Protection Act, 2023 permits transfer outside India except to a country ' +
          'the Central Government restricts, and we transfer personal data to no restricted country. Where the ' +
          'GDPR applies, transfers out of the European Economic Area rest on the European Commission\'s ' +
          'Standard Contractual Clauses as incorporated in our host\'s terms.',
      },

      {
        slug: 'retention',
        name: 'How long we keep it',
        heading: 'How long we keep it',
        body: 'Long enough to be useful to you, and no longer than we can justify.',
        list: [
          'An enquiry that does not lead to an order is kept for up to 24 months and then deleted. Packaging enquiries have a long tail, and a project deferred for a year is a common thing: a specification we still hold is one you do not have to write out again.',
          'An enquiry that becomes an order joins the order record, and is kept as long as tax, accounting and contract law require. In India that is generally at least eight years from the end of the financial year concerned.',
          'Request logs held by our host are kept for the short period its service retains them, and are not archived by us.',
        ],
        after:
          'You can ask us to delete your enquiry sooner than any of this, and unless we are legally required ' +
          'to keep the record, we will.',
      },

      {
        slug: 'your-rights',
        name: 'Your rights',
        heading: 'Your rights over your data',
        body:
          'Whether you are writing from India or from anywhere else, you may ask us to do any of the ' +
          'following, and we will not charge you for it:',
        list: [
          'Tell you what personal data of yours we hold, and what we have done with it',
          'Correct anything wrong, incomplete or out of date',
          'Delete it, where we are not required by law to keep it',
          'Send you a copy in a portable form, or send it to someone else you name',
          'Stop using it for a particular purpose, or withdraw a consent you gave. Withdrawing consent does not undo what was lawfully done before you withdrew it',
          'Nominate someone to exercise these rights for you if you die or become incapable of exercising them yourself, as the Digital Personal Data Protection Act, 2023 allows',
        ],
        after:
          'Write to the grievance officer named below. We acknowledge promptly and answer within 30 days. We ' +
          'may need to confirm who you are before we act, not as an obstacle, but because handing your data to ' +
          'somebody who merely claims to be you is the failure this whole policy exists to prevent.\n\n' +
          'If we get it wrong you may complain to the Data Protection Board of India, and if the GDPR applies ' +
          'to you, to your national supervisory authority instead. We would rather you came to us first, and ' +
          'we will tell you either way.',
      },

      {
        slug: 'grievance',
        name: 'Grievance officer',
        heading: 'Grievance officer',
        body:
          'The Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 each ' +
          `require a named person to answer for this. For ${s.company_name} that is:`,
        rows: [
          ['Name', s.contact_person],
          ['Position', s.contact_title],
          ['Email', s.email],
          ['Telephone', s.phone],
          ['Post', s.plant_address],
        ],
        after:
          'Please write "Privacy" in the subject line so it is routed correctly. Complaints are acknowledged ' +
          'promptly and resolved within 30 days.',
      },

      {
        slug: 'security',
        name: 'Security',
        heading: 'How it is kept safe',
        body:
          'Every page and every form submission on this site travels over HTTPS, so what you type reaches us ' +
          'encrypted in transit. The site itself is a set of static files with no database behind it and no ' +
          'public administrative login, which removes the most commonly exploited way into a website ' +
          'altogether.\n\n' +
          'Form submissions sit in an access-controlled account with our host and in our mailbox, reachable ' +
          'only by the people who need them. We ask for no payment details anywhere on this site, so there are ' +
          'none to protect.\n\n' +
          'No transmission over the internet is ever perfectly secure, and we will not pretend otherwise. What ' +
          'we can say is that we hold as little as the job requires, for as short a time as we can, in as few ' +
          'places as possible, which is the only security measure that never fails.',
      },

      {
        slug: 'children',
        name: 'Children',
        heading: 'Children',
        body:
          'This is a business-to-business site about industrial packaging, and it is neither directed at nor ' +
          'of any interest to children. We do not knowingly collect personal data from anyone under 18. If you ' +
          'believe a child has sent us something through this site, write to the grievance officer and we will ' +
          'delete it.',
      },

      {
        slug: 'links',
        name: 'Links out',
        heading: 'Links to other sites',
        body:
          'This site links out to our profiles on LinkedIn, Instagram, Facebook, IndiaMART and Google, to ' +
          'WhatsApp, and to the studio that designed and built the site. Following any of them takes you ' +
          'somewhere we neither control nor can speak for. Their own privacy policies govern what happens once ' +
          'you arrive, and they are worth reading.',
      },

      {
        slug: 'changes',
        name: 'Changes',
        heading: 'Changes to this policy',
        body:
          'When this policy changes, the revised version is published on this page and the date at the top ' +
          'changes with it. Where a change materially affects how we handle data you have already sent us, we ' +
          'will say so here plainly rather than leave you to compare versions.\n\n' +
          'The version on this page is always the one in force. There is no separate archive; the date is the ' +
          'record.',
      },
    ],
  };
}

module.exports = { privacyPolicy };
