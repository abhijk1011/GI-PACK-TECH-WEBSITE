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
 * answers to sharpen once the commercial team confirms the numbers; they are
 * marked `needsFigures` so they are easy to find. The same flag marks the
 * export answers that state a commercial arrangement (port, Incoterm,
 * documents) the commercial team should confirm.
 *
 * `link` points at the guide on /blog that goes further. It is shown under
 * the answer on /faq and kept out of the FAQPage markup, so the answer an
 * assistant quotes still stands on its own.
 */

const categories = [
  { slug: 'ordering', name: 'Ordering, samples and lead time' },
  { slug: 'export', name: 'Export and overseas buyers' },
  { slug: 'drum-liners', name: 'Drum, reactor and vessel liners' },
  { slug: 'fibc', name: 'FIBC and jumbo bags' },
  { slug: 'chemicals', name: 'Chemical, petroleum and refinery buyers' },
  { slug: 'container-liners', name: 'Container liners and heavy duty sacks' },
  { slug: 'logistics', name: 'Shipping and logistics' },
  { slug: 'machine-covers', name: 'Machine covers and export packing' },
  { slug: 'materials', name: 'Materials and compliance' },
  { slug: 'sustainability', name: 'Reuse and sustainability' },
  { slug: 'specifying', name: 'Specifying and customisation' },
  { slug: 'company', name: 'The company' },
];

const faqs = [
  // ---------------------------------------------------- ordering
  {
    slug: 'are-you-a-manufacturer',
    link: '/blog/sourcing-industrial-packaging-from-india',
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
    link: '/blog/sourcing-industrial-packaging-from-india',
    category: 'ordering',
    question: 'Do you export, and do you supply across India?',
    answer:
      'Yes to both. We supply customers throughout India and export from the Valsad plant, which sits close to the Gujarat port belt. Export packing, VCI protection and container load efficiency are routine parts of what we specify, because a large share of what we make is protecting goods that are about to travel.',
  },

  // ---------------------------------------------------- drum liners
  {
    slug: 'what-is-a-drum-liner',
    link: '/blog/drum-liner-materials-guide',
    category: 'drum-liners',
    question: 'What is a drum liner and why use one?',
    answer:
      'A drum liner is a flexible bag fitted inside a steel, plastic or fibre drum so the product never touches the drum wall. It does three things: it keeps the product clean, it lets the drum be reused instead of scrapped or sent for expensive cleaning, and it stops residue clinging to the wall being lost as waste on every discharge.',
  },
  {
    slug: 'drum-liner-sizes',
    link: '/blog/how-to-measure-a-drum-for-a-liner',
    category: 'drum-liners',
    question: 'What sizes and diameters of drum liner do you make?',
    answer:
      'Any internal diameter from 6 inches to 100 inches, at any height. That range is unusual — most manufacturers quote either the small diameters or the very large ones, not both — and it comes from running our own lamination, extrusion, cutting and heat-sealing lines, plus tooling built up over years of one-off jobs.',
  },
  {
    slug: 'measure-a-drum-for-a-liner',
    link: '/blog/how-to-measure-a-drum-for-a-liner',
    category: 'drum-liners',
    question: 'How do I measure my drum for a liner?',
    answer:
      'Measure the internal diameter across the top opening and the internal height from the base to the rim, and say whether the drum is open-top or has a fixed head with a bung. Those three facts specify most liners. If measuring is awkward, send one sample drum instead and we measure it here.',
  },
  {
    slug: 'liner-for-200-litre-drum',
    link: '/blog/how-to-measure-a-drum-for-a-liner',
    category: 'drum-liners',
    question: 'What liner fits a 200 litre or 210 litre drum?',
    answer:
      'A standard 200–210 litre steel drum has an internal diameter of roughly 23 inches, which sits comfortably inside our range. The liner is still made to your drum\'s measured dimensions rather than to a nominal drum size, because internal diameters vary between manufacturers and a liner that is close but not right will crease, fold or tear on filling.',
  },
  {
    slug: 'antistatic-conductive-liners',
    link: '/blog/conductive-liners-and-static-safety',
    category: 'drum-liners',
    question: 'What is a conductive or antistatic drum liner, and do I need one?',
    answer:
      'A conductive liner is made from film that dissipates static instead of holding it, and it carries a grounding tab that clips to an earth point. You need one when the product is a flammable powder, a solvent or an alcohol, where a static discharge during filling or discharge is an ignition source. Where a process cannot guarantee grounding at every transfer, we recommend a Type D construction instead.',
  },
  {
    slug: 'aluminium-barrier-liner',
    link: '/blog/evoh-vs-aluminium-barrier-liners',
    category: 'drum-liners',
    question: 'When is an aluminium foil laminate liner needed?',
    answer:
      'When moisture or oxygen is the thing that spoils the product. An aluminium laminate, built in 5 or 6 layers with nylon or polyester, is close to a total moisture and gas barrier, which is why it is specified for hygroscopic powders, catalysts and pharmaceutical intermediates. A plain polyethylene liner keeps a product clean but does not stop it picking up moisture.',
  },
  {
    slug: 'liner-with-spout',
    link: '/blog/drum-liners-for-lubricants-and-reusable-drums',
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
    link: '/blog/fibc-types-a-b-c-d-explained',
    category: 'fibc',
    question: 'What is an FIBC, and is it the same as a jumbo bag?',
    answer:
      'They are the same thing. FIBC stands for Flexible Intermediate Bulk Container — a woven polypropylene bag with lifting loops, used to move powders, granules and other dry bulk by forklift or crane. "Jumbo bag" and "bulk bag" are the common names for it in India.',
  },
  {
    slug: 'fibc-types-a-b-c-d',
    link: '/blog/fibc-types-a-b-c-d-explained',
    category: 'fibc',
    question: 'What is the difference between Type A, B, C and D FIBCs?',
    answer:
      'It is about static. Type A is plain woven fabric with no static protection. Type B has a low breakdown voltage to prevent propagating brush discharges. Type C is conductive and must be grounded during filling and discharge. Type D dissipates static safely without being grounded, which makes it the safer choice where earthing cannot be guaranteed at every transfer.',
  },
  {
    slug: 'baffle-bag',
    link: '/blog/baffle-bags-vs-round-fibc',
    category: 'fibc',
    question: 'What is a baffle bag, and why use one?',
    answer:
      'A baffle bag has internal fabric panels across its corners that hold it square when filled, instead of bulging into a drum shape. Square bags stand better on a pallet, stack without leaning and fit more units into the same container or warehouse bay, so the reason to use one is usually freight and storage efficiency rather than product protection.',
  },
  {
    slug: 'fibc-liner-types',
    link: '/blog/fibc-liner-types-guide',
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

  // ------------------------------------- container liners and sacks
  {
    slug: 'what-is-a-container-liner',
    link: '/blog/container-liners-for-dry-bulk',
    category: 'container-liners',
    question: 'What is a container liner, and when is it better than shipping in bags?',
    answer:
      'A container liner is one large bag fabricated to the inside of a standard 20 or 40 foot shipping container, so dry bulk travels loose rather than in sacks. It is better whenever a full container of a single dry product is being moved: the sacks and pallets go, the filling and emptying labour largely goes with them, and around 20 per cent more product fits in the same box.',
  },
  {
    slug: 'laminated-or-unlaminated-container-liner',
    link: '/blog/container-liners-for-dry-bulk',
    category: 'container-liners',
    question: 'Does a container liner need to be breathable?',
    answer:
      'If the cargo respires or is loaded warm, yes. An unlaminated woven liner lets air through the weave, which is what grain, rice, coffee and seed need. A laminated liner is effectively airtight and is right for petrochemicals, malt and moisture-sensitive chemicals. Welded PE film is the tightest of the three. The cargo decides it, and we make all three.',
  },
  {
    slug: 'heavy-duty-sack-vs-ordinary-bag',
    link: '/blog/heavy-duty-sacks-25kg-and-50kg',
    category: 'container-liners',
    question: 'What makes a 25 kg heavy duty sack different from an ordinary woven bag?',
    answer:
      'It is specified against the drop rather than the fill weight. An ordinary sack holds 25 kilograms in a warehouse and fails at the third rough handling. A heavy duty sack is built in co-extruded PE or heavy woven polypropylene, sealed rather than stitched where the product must stay dry, and UV stabilised where it will sit outdoors.',
  },

  // ---------------------------------------------------- machine covers
  {
    slug: 'what-is-a-machine-cover',
    link: '/blog/seaworthy-export-packing-for-machinery',
    category: 'machine-covers',
    question: 'What is a machine cover, and why not use a standard bag?',
    answer:
      'A machine cover is a fabricated cover built to a specific machine\'s dimensions, so it fits over the actual profile instead of being stretched around it. Standard bag sizes leave slack that traps water and tears at the corners in handling. We build to the general arrangement drawing, which is why one drawing usually replaces three phone calls.',
  },
  {
    slug: 'vci-packaging',
    link: '/blog/what-is-vci-packaging',
    category: 'machine-covers',
    question: 'What is VCI packaging, and when is it needed?',
    answer:
      'VCI stands for Volatile Corrosion Inhibitor: the film releases a vapour that settles on bare metal and stops it rusting inside a sealed enclosure. It is specified for machined and unpainted metal surfaces going into storage or a long sea voyage. The formulation is matched to the metal and the sealed volume, because a VCI suited to steel is not the right one for copper or aluminium.',
  },
  {
    slug: 'vacuum-packing-machinery',
    link: '/blog/seaworthy-export-packing-for-machinery',
    category: 'machine-covers',
    question: 'Do you vacuum pack machinery for export?',
    answer:
      'Yes. Vacuum drawing, heat sealing and VCI formulation are all in-house, usually as an aluminium barrier bag drawn down over the machine and sealed with desiccant inside. That combination is what keeps a machine tool arriving after weeks at sea ready to run rather than needing to be stripped and cleaned first.',
  },

  // ---------------------------------------------------- materials
  {
    slug: 'which-material-for-my-product',
    link: '/blog/chemical-packaging-guide',
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
    link: '/blog/sustainable-industrial-packaging',
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
  // ---------------------------------------------------- export
  {
    slug: 'supply-buyers-outside-india',
    category: 'export',
    link: '/blog/sourcing-industrial-packaging-from-india',
    question: 'Do you supply buyers outside India?',
    answer:
      'Yes. GI PackTech exports from its plant in Valsad, Gujarat, as well as supplying customers throughout India. Everything is made to the buyer\'s specification, so an overseas order follows the same route as a domestic one: specification, a sample for trial fitment, approval, then bulk production, quoted on the Incoterm and destination port the buyer works to.',
  },
  {
    slug: 'port-of-loading',
    category: 'export',
    question: 'Which port do you ship from?',
    answer:
      'Valsad lies on the Mumbai–Ahmedabad industrial corridor, within road distance of Nhava Sheva (JNPT) and Hazira ports. The port of loading is confirmed with each quotation, along with the Incoterm, so the buyer knows from the start where responsibility for the shipment passes.',
    needsFigures: true,
  },
  {
    slug: 'incoterms',
    category: 'export',
    link: '/blog/sourcing-industrial-packaging-from-india',
    question: 'Can you quote FOB, CIF or another Incoterm?',
    answer:
      'Tell us the Incoterm you buy on — FOB, CFR, CIF, FCA, DAP or another — and the destination port, and the quotation is made on that basis. Agreeing the terms at quotation stage, rather than at shipment, avoids surprises over freight, insurance and the point where risk transfers.',
    needsFigures: true,
  },
  {
    slug: 'export-documents',
    category: 'export',
    question: 'What documents come with an export shipment?',
    answer:
      'An export shipment travels with a commercial invoice, a packing list, the bill of lading or air waybill, and usually a certificate of origin. Where your market needs material documentation — the quality certificate, test reports or a food-contact declaration — ask at enquiry stage, so the right grade is specified and the paperwork is prepared alongside production.',
    needsFigures: true,
  },
  {
    slug: 'hs-codes',
    category: 'export',
    link: '/blog/sourcing-industrial-packaging-from-india',
    question: 'What HS code do drum liners and FIBCs ship under?',
    answer:
      'Polyethylene bags and liners — drum liners, FIBC liners, sacks — usually fall under HS 3923.21, PVC liners under 3923.29, and woven polypropylene FIBCs under 6305.32. Machine covers, container liners and laminated products can fall elsewhere depending on their construction, so confirm every line item with your customs broker before the first shipment.',
  },
  {
    slug: 'samples-overseas',
    category: 'export',
    question: 'Can you send samples overseas before an order?',
    answer:
      'Yes. Samples are supplied for trial fitment before bulk production on every product, including for buyers outside India. The sample is made to your own drum, bag, container or machine dimensions, so the fit, the seal and the material can be confirmed on your own line before a full run is committed.',
  },
  {
    slug: 'own-brand-printing',
    category: 'export',
    question: 'Can importers and distributors have packaging printed with their own brand?',
    answer:
      'Yes. Printing is one of the options specified per order — brand, product identification, grade and batch details — so an importer or distributor can supply under its own name. Print adds a plate and a minimum film run, so raise it at enquiry stage and the quantity and price reflect it from the start.',
    needsFigures: true,
  },
  {
    slug: 'how-overseas-buyers-communicate',
    category: 'export',
    question: 'How do overseas buyers work with your technical team?',
    answer:
      'By email, phone or WhatsApp, in English. Technical questions go straight to the people who specify the job rather than through a call centre, and the first reply is a written specification rather than a price list. Drawings, data sheets and photographs of the drum, bag or machine can all be sent the same way.',
  },

  // ------------------------------------- drum, reactor and vessel liners
  {
    slug: 'reactor-and-vessel-liners',
    category: 'drum-liners',
    link: '/blog/reactor-vessel-and-tank-liners',
    question: 'Do you make reactor, vessel and tank liners?',
    answer:
      'Yes. Round liners are made to the internal diameter and height of open-top reactors, process vessels, mixing tanks and bins, in any diameter from 6 to 100 inches. The batch sits in the liner rather than against the wall, so changeovers need far less cleaning. Flexible liners are for non-pressurised duty within the film\'s temperature range.',
  },
  {
    slug: 'reduce-cleaning-between-batches',
    category: 'drum-liners',
    link: '/blog/reactor-vessel-and-tank-liners',
    question: 'How can we cut cleaning time between batches in a mixing vessel?',
    answer:
      'Line the vessel. A liner made to its internal diameter and height holds the batch and is lifted out with the residue at the end, so the vessel wall is never contaminated. Cleaning, solvent use and changeover time fall, and cross-contamination between products becomes far less likely. The film is chosen for the product and any static risk.',
  },

  // ------------------------------------- chemical, petroleum, refinery
  {
    slug: 'polymer-granule-packaging',
    category: 'chemicals',
    link: '/blog/container-liners-for-dry-bulk',
    question: 'What is the most economical way to export polymer granules and resins?',
    answer:
      'For full containers of one product, a dry bulk container liner: the granules travel loose in a laminated woven or welded PE film liner inside a 20 or 40 foot container, so the sacks, pallets and most of the handling go. For tonne lots moved into a process, FIBCs; for dealer sales, 25 kg PE sacks.',
  },
  {
    slug: 'catalyst-packaging',
    category: 'chemicals',
    link: '/blog/petrochemical-and-refinery-packaging',
    question: 'How should catalysts and moisture-sensitive additives be packed?',
    answer:
      'In a drum or FIBC with an aluminium foil laminate liner, usually 5 or 6 layers, sealed so that permeation at the seal stays minimal. A heavier polyethylene liner only slows moisture. Where the product is also handled near flammable vapour, a conductive aluminium liner gives static control and the barrier in one construction.',
  },
  {
    slug: 'flammable-powder-packaging',
    category: 'chemicals',
    link: '/blog/fibc-types-a-b-c-d-explained',
    question: 'What packaging is safe for solvent-wet or flammable powders?',
    answer:
      'A Type C FIBC earthed at every fill and discharge, or a Type D FIBC that needs no earthing, with a conductive liner specified as part of the same system. Type A and Type B bags must not be used where flammable vapour is present. Your process safety assessment decides the final choice.',
  },
  {
    slug: 'dangerous-goods-liners',
    category: 'chemicals',
    link: '/blog/chemical-packaging-guide',
    question: 'Can your liners be used in UN-approved packaging for dangerous goods?',
    answer:
      'UN approval belongs to the packaging design as a whole — the tested drum or FIBC design type — and a liner is part of that design. Give us the UN number, the packing group and the approved packaging you use, and the liner is specified within that design rather than as a substitute for it.',
  },
  {
    slug: 'spill-bunds-for-drum-stores',
    category: 'chemicals',
    question: 'Do you make spill containment bunds for drum and IBC stores?',
    answer:
      'Yes. Flexible bunds in chemical-resistant PVC-coated fabric are made to any size and holding capacity for drum stores, IBCs, generators, transformers, pumps and refuelling points. The walls stand up on their own when the bund is placed, and it folds flat to move — no civil work and no permanent concrete.',
  },

  // ---------------------------------------------------- logistics
  {
    slug: 'container-rain',
    category: 'logistics',
    link: '/blog/container-rain-and-cargo-sweat',
    question: 'What causes container rain, and how do I stop it damaging the cargo?',
    answer:
      'Moisture inside the container — mostly from the cargo, pallets and dunnage — condenses on the steel roof and walls when the outside cools, then drips onto the load. Seal goods that must stay dry inside their own barrier with desiccant, protect bare metal with VCI, use dry pallets, and keep respiring cargo in breathable packaging.',
  },
  {
    slug: 'dunnage-bag-sizing',
    category: 'logistics',
    link: '/blog/dunnage-air-bags-guide',
    question: 'How do I choose the right size of dunnage air bag?',
    answer:
      'Measure the width of the gap and the height and length of the load face the bag will press against. Inflated, the bag should fill the gap fully and cover enough of the face to spread the pressure. An undersized bag cannot fill the void and an oversized one can burst. Send a load plan to have it sized.',
  },
  {
    slug: 'is-stretch-wrap-enough',
    category: 'logistics',
    link: '/blog/pallet-covers-vs-stretch-wrap-vs-shrink-hoods',
    question: 'Is stretch wrap enough to protect a pallet?',
    answer:
      'For short, dry, indoor moves, usually. Stretch wrap holds the sides together but leaves the top of the pallet open, which is where dust and water land first. Add a top sheet under the wrap, use a pallet hood, or use a shrink hood that seals the whole load for outdoor storage and open transport.',
  },
  {
    slug: 'flexi-bag-or-ibc',
    category: 'logistics',
    link: '/blog/liquid-flexi-bags-vs-ibc-vs-drums',
    question: 'Should I ship liquids in a flexi bag or an IBC?',
    answer:
      'Use a flexi bag where the return journey and cleaning are the larger cost — one-way routes, export, customers who will not store empties. It is filled, emptied and then disposed of or recycled, with nothing to bring back. A rigid IBC suits a short closed loop where empties reliably return and cleaning is cheap.',
  },
  {
    slug: 'baffle-bags-container-fill',
    category: 'logistics',
    link: '/blog/baffle-bags-vs-round-fibc',
    question: 'Do baffle bags really fit more product in a container?',
    answer:
      'Usually, yes. A round-filling bag in a square footprint uses only about 79 per cent of the floor area; a baffle bag holds its square shape and recovers most of the corners, so more product fits per pallet, bay and container. The gain depends on bulk density and the load plan, so it is worked out for your cargo.',
  },

  // ---------------------------------------------------- machine covers (OEM)
  {
    slug: 'covers-for-a-product-range',
    category: 'machine-covers',
    link: '/blog/seaworthy-export-packing-for-machinery',
    question: 'Can you supply covers for our whole machine range on repeat orders?',
    answer:
      'Yes. Each model\'s cover is built once from its general arrangement drawing, proved on a trial unit, then repeated against the same specification on every order, with identification printed or labelled where needed. Machinery and power equipment manufacturers use this to standardise export packing across a product line.',
  },
  {
    slug: 'electrical-panel-humidity',
    category: 'machine-covers',
    link: '/blog/covers-for-generators-transformers-and-panels',
    question: 'How do you stop moisture damaging electrical panels in transit?',
    answer:
      'By sealing the panel in a barrier cover and controlling the humidity inside it: desiccant matched to the enclosed volume and the transit time, and a humidity indicator so the receiving engineer can confirm the air stayed dry before energising. Moisture on terminations and electronics is invisible until power is applied, so it has to be controlled at source.',
  },
  {
    slug: 'how-long-does-vci-last',
    category: 'machine-covers',
    link: '/blog/what-is-vci-packaging',
    question: 'How long does VCI protection last?',
    answer:
      'It depends on how well the enclosure holds the vapour, the amount of VCI for the enclosed volume, humidity, temperature and how long the pack stays closed. Specify VCI against the actual storage or transit period, and for long voyages combine it with an aluminium barrier and desiccant rather than relying on VCI film alone.',
  },

  // ---------------------------------------------------- sustainability
  {
    slug: 'reusable-packaging',
    category: 'sustainability',
    link: '/blog/sustainable-industrial-packaging',
    question: 'Do you make reusable packaging?',
    answer:
      'Yes, in two ways. Reusable products — woven laminated and PVC-coated fabric covers, flexible spill bunds and bladder tanks — are built for many uses. And drum liners let rigid drums be reused: the product never touches the drum wall, so the drum goes back into service instead of being scrapped or reconditioned, and only the liner is discarded.',
  },
  {
    slug: 'reduce-plastic-use',
    category: 'sustainability',
    link: '/blog/sustainable-industrial-packaging',
    question: 'Can you reduce the amount of plastic in our packaging?',
    answer:
      'Often, yes. A co-extruded multilayer film gets more strength from less material than a thicker single-layer film, so an over-specified plain liner can frequently be replaced by a thinner engineered one with no loss of performance. Show us the liner or cover you use now and we will tell you whether a thinner structure would outperform it.',
  },
  {
    slug: 'protect-product-first',
    category: 'sustainability',
    link: '/blog/sustainable-industrial-packaging',
    question: 'Why is preventing product loss part of sustainable packaging?',
    answer:
      'Because a spoiled batch, a corroded machine or a burst sack wastes far more material and energy than the packaging around it. Specifying the right barrier, static control or corrosion protection keeps the product saleable, which is the largest environmental gain available. After that come reuse, less material and recyclability.',
  },

];

module.exports = { categories, faqs };
