'use strict';

/*
 * The FAQ.
 *
 * Written for two audiences at once. A buyer skims it, and an answer engine
 * quotes it — so each answer opens with the answer itself, stands on its own
 * without the question or the surrounding page, and stays inside 40–70 words.
 * That is the shape a search snippet or an AI assistant can lift whole.
 *
 * Every claim here is one the rest of the site already makes: the 6"–100"
 * diameter range, the in-house lamination, extrusion, cutting and sealing
 * lines, ISO 9001:2015, the Valsad plant, built to order with a sample first.
 * Where a genuine number is not established anywhere — a minimum quantity in
 * pieces, a lead time in days, payment terms — the answer says what governs it
 * and asks for the specification rather than inventing a figure. Those are the
 * answers to sharpen from the admin panel once the commercial team confirms
 * them; they are marked `needsFigures` so they are easy to find.
 */

const categories = [
  { slug: 'ordering', name: 'Ordering, samples and lead time' },
  { slug: 'drum-liners', name: 'Drum liners' },
  { slug: 'fibc', name: 'FIBC and jumbo bags' },
  { slug: 'machine-covers', name: 'Machine covers and export packing' },
  { slug: 'materials', name: 'Materials and compliance' },
  { slug: 'specifying', name: 'Specifying and customisation' },
  { slug: 'company', name: 'The company' },
];

const faqs = [
  // ---------------------------------------------------- ordering
  {
    slug: 'are-you-a-manufacturer',
    category: 'ordering',
    question: 'Are you a manufacturer or a trading company?',
    answer:
      'GI PackTech is a manufacturer. Lamination, extrusion, cutting, fabrication and heat sealing all happen on our own lines at Gundlav, Valsad, in Gujarat, India, and the plant has been running since 2006. Nothing is bought in and relabelled, which is why a non-standard size or an unusual film structure is a production question rather than a sourcing one.',
  },
  {
    slug: 'minimum-order-quantity',
    category: 'ordering',
    question: 'What is the minimum order quantity?',
    answer:
      'It depends on the construction rather than the product. A liner in a film we already run has a low minimum; one needing a purpose-made laminate, an unusual width or a custom print carries a higher one, because the minimum is set by the film run rather than by the bag. Send the size and the material and we confirm the exact quantity with the quotation.',
    needsFigures: true,
  },
  {
    slug: 'do-you-supply-samples',
    category: 'ordering',
    question: 'Do you supply samples before a bulk order?',
    answer:
      'Yes. Sample liners and trial covers are supplied for fitment before bulk production on every product we make. Everything is built to order, so a sample is the only reliable way to confirm the diameter, the gusset, the seal and the fit against your actual drum or machine before a full run is committed.',
  },
  {
    slug: 'lead-time',
    category: 'ordering',
    question: 'What is the lead time?',
    answer:
      'Three things govern it: whether the film is one we already run or has to be laminated or extruded for you, the quantity, and whether tooling is needed for a non-standard profile. A repeat order in a stocked structure is quickest; a new laminate takes longest, because the film has to be made first. We confirm a date with the quotation.',
    needsFigures: true,
  },
  {
    slug: 'how-to-get-a-quote',
    category: 'ordering',
    question: 'How do I get a price?',
    answer:
      'Send the specification rather than ask for a price list. There is no fixed range to quote from — everything is made to order, so a price needs the product being packed, the container\'s measured internal diameter and height or the machine drawing, and the approximate annual quantity. With those, a firm specification and quotation come back without a second round of questions.',
  },
  {
    slug: 'do-you-export',
    category: 'ordering',
    question: 'Do you export, and do you supply across India?',
    answer:
      'Yes to both. We supply customers throughout India and export from the Valsad plant, which sits close to the Gujarat port belt. Export packing, VCI protection and container load efficiency are routine parts of what we specify, because a large share of what we make is protecting goods that are about to travel.',
  },

  // ---------------------------------------------------- drum liners
  {
    slug: 'what-is-a-drum-liner',
    category: 'drum-liners',
    question: 'What is a drum liner and why use one?',
    answer:
      'A drum liner is a flexible bag fitted inside a steel, plastic or fibre drum so the product never touches the drum wall. It does three things: it keeps the product clean, it lets the drum be reused instead of scrapped or sent for expensive cleaning, and it stops residue clinging to the wall being lost as waste on every discharge.',
  },
  {
    slug: 'drum-liner-sizes',
    category: 'drum-liners',
    question: 'What sizes and diameters of drum liner do you make?',
    answer:
      'Any internal diameter from 6 inches to 100 inches, at any height. That range is unusual — most manufacturers quote either the small diameters or the very large ones, not both — and it comes from running our own lamination, extrusion, cutting and heat-sealing lines, plus tooling built up over years of one-off jobs.',
  },
  {
    slug: 'measure-a-drum-for-a-liner',
    category: 'drum-liners',
    question: 'How do I measure my drum for a liner?',
    answer:
      'Measure the internal diameter across the top opening and the internal height from the base to the rim, and say whether the drum is open-top or has a fixed head with a bung. Those three facts specify most liners. If measuring is awkward, send one sample drum instead and we measure it here.',
  },
  {
    slug: 'liner-for-200-litre-drum',
    category: 'drum-liners',
    question: 'What liner fits a 200 litre or 210 litre drum?',
    answer:
      'A standard 200–210 litre steel drum has an internal diameter of roughly 23 inches, which sits comfortably inside our range. The liner is still made to your drum\'s measured dimensions rather than to a nominal drum size, because internal diameters vary between manufacturers and a liner that is close but not right will crease, fold or tear on filling.',
  },
  {
    slug: 'antistatic-conductive-liners',
    category: 'drum-liners',
    question: 'What is a conductive or antistatic drum liner, and do I need one?',
    answer:
      'A conductive liner is made from film that dissipates static instead of holding it, and it carries a grounding tab that clips to an earth point. You need one when the product is a flammable powder, a solvent or an alcohol, where a static discharge during filling or discharge is an ignition source. Where a process cannot guarantee grounding at every transfer, we recommend a Type D construction instead.',
  },
  {
    slug: 'aluminium-barrier-liner',
    category: 'drum-liners',
    question: 'When is an aluminium foil laminate liner needed?',
    answer:
      'When moisture or oxygen is the thing that spoils the product. An aluminium laminate, built in 5 or 6 layers with nylon or polyester, is close to a total moisture and gas barrier, which is why it is specified for hygroscopic powders, catalysts and pharmaceutical intermediates. A plain polyethylene liner keeps a product clean but does not stop it picking up moisture.',
  },
  {
    slug: 'liner-with-spout',
    category: 'drum-liners',
    question: 'Can a drum liner have a dispensing spout?',
    answer:
      'Yes. A liner with an integrated spout lets the drum be discharged without opening the top, which keeps the remaining product sealed against moisture and dust between draws. It also means the drum comes back clean enough to reuse, so a drum that was previously scrapped or cleaned after one trip becomes a returnable asset.',
  },
  {
    slug: 'food-grade-liners',
    category: 'drum-liners',
    question: 'Are your liners food grade?',
    answer:
      'Food-grade constructions are part of what we make — food ingredients, oils and fats are among the sectors we supply, usually in polyethylene or an EVOH barrier structure. Because compliance depends on the exact resin and the contact conditions rather than on the product name, tell us what is being packed and we confirm the grade and the documentation for that specific application.',
    needsFigures: true,
  },
  {
    slug: 'liner-temperature-limits',
    category: 'drum-liners',
    question: 'What temperature can a liner handle?',
    answer:
      'The film sets the limit, not the liner. Polyethylene, PVC, aluminium laminates and coated fabrics each have a different working range, and hot filling is a different question again from storage temperature. Send the fill temperature and the storage range with your enquiry and the material is specified against them, rather than assumed.',
  },

  // ---------------------------------------------------- FIBC
  {
    slug: 'what-is-an-fibc',
    category: 'fibc',
    question: 'What is an FIBC, and is it the same as a jumbo bag?',
    answer:
      'They are the same thing. FIBC stands for Flexible Intermediate Bulk Container — a woven polypropylene bag with lifting loops, used to move powders, granules and other dry bulk by forklift or crane. "Jumbo bag" and "bulk bag" are the common names for it in India.',
  },
  {
    slug: 'fibc-types-a-b-c-d',
    category: 'fibc',
    question: 'What is the difference between Type A, B, C and D FIBCs?',
    answer:
      'It is about static. Type A is plain woven fabric with no static protection. Type B has a low breakdown voltage to prevent propagating brush discharges. Type C is conductive and must be grounded during filling and discharge. Type D dissipates static safely without being grounded, which makes it the safer choice where earthing cannot be guaranteed at every transfer.',
  },
  {
    slug: 'baffle-bag',
    category: 'fibc',
    question: 'What is a baffle bag, and why use one?',
    answer:
      'A baffle bag has internal fabric panels across its corners that hold it square when filled, instead of bulging into a drum shape. Square bags stand better on a pallet, stack without leaning and fit more units into the same container or warehouse bay, so the reason to use one is usually freight and storage efficiency rather than product protection.',
  },
  {
    slug: 'fibc-liner-types',
    category: 'fibc',
    question: 'Do FIBCs need a liner, and which type?',
    answer:
      'A liner goes in when the woven fabric alone will not hold or protect the product — fine powders that would sift through the weave, or anything needing a moisture or oxygen barrier. Loose, glued and form-fit liners all suit different filling methods. As we put it: the liner decides the barrier, not the bag.',
  },
  {
    slug: 'fibc-safe-working-load',
    category: 'fibc',
    question: 'What does safe working load and 5:1 safety factor mean?',
    answer:
      'Safe working load is the maximum weight the bag is built to carry. The safety factor is how much more it is tested to withstand: a 5:1 bag holds five times its rated load before failure, and is intended for single-trip use, while 6:1 is specified for multi-trip service. Tell us the load and the number of trips and the construction follows from that.',
  },

  // ---------------------------------------------------- machine covers
  {
    slug: 'what-is-a-machine-cover',
    category: 'machine-covers',
    question: 'What is a machine cover, and why not use a standard bag?',
    answer:
      'A machine cover is a fabricated cover built to a specific machine\'s dimensions, so it fits over the actual profile instead of being stretched around it. Standard bag sizes leave slack that traps water and tears at the corners in handling. We build to the general arrangement drawing, which is why one drawing usually replaces three phone calls.',
  },
  {
    slug: 'vci-packaging',
    category: 'machine-covers',
    question: 'What is VCI packaging, and when is it needed?',
    answer:
      'VCI stands for Volatile Corrosion Inhibitor: the film releases a vapour that settles on bare metal and stops it rusting inside a sealed enclosure. It is specified for machined and unpainted metal surfaces going into storage or a long sea voyage. The formulation is matched to the metal and the sealed volume, because a VCI suited to steel is not the right one for copper or aluminium.',
  },
  {
    slug: 'vacuum-packing-machinery',
    category: 'machine-covers',
    question: 'Do you vacuum pack machinery for export?',
    answer:
      'Yes. Vacuum drawing, heat sealing and VCI formulation are all in-house, usually as an aluminium barrier bag drawn down over the machine and sealed with desiccant inside. That combination is what keeps a machine tool arriving after weeks at sea ready to run rather than needing to be stripped and cleaned first.',
  },

  // ---------------------------------------------------- materials
  {
    slug: 'which-material-for-my-product',
    category: 'materials',
    question: 'How do I know which material my product needs?',
    answer:
      'Send the product data sheet and we work it out. Material compatibility is decided case by case against your product data, temperature range and handling method before anything is quoted. Where a material is not the right answer for a product, we say so — including when it costs us the order.',
  },
  {
    slug: 'materials-you-work-in',
    category: 'materials',
    question: 'Which materials do you work in?',
    answer:
      'Multilayer polyethylene, EVOH barrier film, aluminium laminates in 5 and 6 layers, conductive film and conductive aluminium laminate, PVC film and PVC-coated fabric, woven laminated fabric, aluminium vacuum laminate, VCI film and heat-shrinkable film. The material reference page sets out what each one is specified for.',
  },
  {
    slug: 'iso-certification',
    category: 'materials',
    question: 'Are you ISO certified?',
    answer:
      'Yes — GI PackTech is ISO 9001:2015 certified for quality management. If your compliance team needs the certificate itself or documentation against a specific standard for your market, ask and it will be sent with the quotation.',
  },
  {
    slug: 'recyclable-packaging',
    category: 'materials',
    question: 'Is your packaging recyclable?',
    answer:
      'Single-material polyethylene liners and covers are the most straightforwardly recyclable of what we make, and a co-extruded film that delivers the same strength from less material reduces waste before recycling is even considered. Multilayer aluminium laminates trade recyclability for a barrier no single material can give, so the honest answer depends on which construction your product actually needs.',
  },

  // ---------------------------------------------------- specifying
  {
    slug: 'what-you-need-to-quote',
    category: 'specifying',
    question: 'What information do you need to quote?',
    answer:
      'For a container: the measured internal diameter and height, and what is being packed. For a machine: the general arrangement drawing. Add the product data sheet so material compatibility can be confirmed, the handling method, and the approximate annual quantity. A method statement is needed where the work is on a licensed site, and a container load plan where the question is freight efficiency.',
  },
  {
    slug: 'make-to-my-drawing',
    category: 'specifying',
    question: 'Can you make to my drawing or a non-standard size?',
    answer:
      'Yes — that is the normal case rather than the exception. Nothing is sold from a fixed standard range, and the products listed on this site are what has been built to date, not the limit of what the plant can produce. If a requirement is not listed, it can almost certainly still be made.',
  },
  {
    slug: 'printing-and-branding',
    category: 'specifying',
    question: 'Can you print our logo or batch details on the packaging?',
    answer:
      'Printing is one of the options that can be changed for your application, alongside dimensions, film structure, thickness, gusset and closure. Because print adds a plate and a minimum film run, tell us at enquiry stage rather than after the first order, so the quantity and price reflect it from the start.',
    needsFigures: true,
  },
  {
    slug: 'thickness-and-gauge',
    category: 'specifying',
    question: 'What thickness should I specify?',
    answer:
      'Thickness is an outcome, not a starting point. It follows from the load, the drop and handling risk, the fill temperature and whether the film is co-extruded — a co-extruded structure gets more strength from less material, so a thinner engineered film often outperforms a thicker plain one. Give us the conditions and the thickness is specified against them.',
  },

  // ---------------------------------------------------- company
  {
    slug: 'where-are-you-based',
    category: 'company',
    question: 'Where are you based?',
    answer:
      'The manufacturing plant is at Plot No. 608, New GIDC, Gundlav, Valsad, Gujarat 396035, India, with an office in Mumbai. Valsad sits on the Mumbai–Ahmedabad industrial corridor and close to the Gujarat ports, which is convenient for both domestic despatch and export.',
  },
  {
    slug: 'how-long-in-business',
    category: 'company',
    question: 'How long have you been in business?',
    answer:
      'GI PackTech has been manufacturing industrial flexible packaging since 2006, and employs between 51 and 100 people. The plant supplies chemicals, pharmaceuticals, lubricants, food ingredients, machine tools, fertilisers and metals, among other sectors.',
  },
  {
    slug: 'which-industries',
    category: 'company',
    question: 'Which industries do you supply?',
    answer:
      'Chemicals and specialty chemicals, pharmaceuticals and intermediates, lubricants and base oils, food and food ingredients, machine tools and heavy engineering, power and electrical equipment, fertilisers and agrochemicals, metals and alloys, alcohol and breweries, automotive components, construction, demolition and remediation, and warehousing and logistics.',
  },
  {
    slug: 'who-do-i-talk-to',
    category: 'company',
    question: 'Who do I talk to about a technical requirement?',
    answer:
      'Technical enquiries go straight to the people who specify the job rather than through a call centre. Send the drawing, the drum dimensions or the product data sheet through the enquiry form, or call the number in the footer. The first reply is a specification, not a price list.',
  },
];

module.exports = { categories, faqs };
