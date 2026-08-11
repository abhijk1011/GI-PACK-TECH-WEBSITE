'use strict';

/*
 * Industries, buyer roles, materials and the enquiry checklist.
 *
 * `priority` on an industry reflects how quickly that segment recognises the
 * value argument. It orders the industry listing; it is not shown as a number.
 */

const industries = [
  {
    slug: 'machine-tools-and-heavy-engineering',
    name: 'Machine Tools and Heavy Engineering',
    applications: 'Covers for CNC machines, power presses, turbines, compressors',
    intro:
      'A machine tool is sold on its accuracy, and the surface that decides that accuracy is a few microns thick. From the moment a machine leaves the assembly floor to the moment it is commissioned, it is exposed to moisture, salt air and dust — often for several weeks, across a sea voyage and an inland journey.',
    problem_lead:
      'A corroded slideway cannot be polished out. It is found at commissioning, when your engineer is already on site.',
    priority: 1,
    products: [
      'aluminium-vacuum-laminate-cover',
      'cnc-machine-and-large-machinery-cover',
      'vci-machine-cover',
      'battery-charger-and-component-cover',
      'shrink-wrap-cover',
    ],
    seo_title: 'Packaging for Machine Tools and Heavy Engineering | GI PackTech',
    seo_description:
      'Protective covers for CNC machines, power presses, turbines and compressors. Aluminium vacuum laminate and VCI constructions built from your machine drawing.',
  },
  {
    slug: 'power-and-electrical-equipment',
    name: 'Power and Electrical Equipment',
    applications: 'Covers for generators, transformers, panels, battery chargers',
    intro:
      'Generators, transformers and panels combine machined metal, electrical terminations and painted enclosures. Each of those fails differently under moisture and salt air, and the damage is usually invisible until the unit is energised.',
    problem_lead:
      'Panel damage is invisible until power is applied. By then the site is live and the panel is installed.',
    priority: 2,
    products: [
      'generator-protective-cover',
      'transformer-protective-cover',
      'electrical-panel-packaging-cover',
      'battery-charger-and-component-cover',
      'aluminium-vacuum-laminate-cover',
    ],
    seo_title: 'Packaging for Generators, Transformers and Panels | GI PackTech',
    seo_description:
      'Protective covers for generator sets, distribution and power transformers, switchgear and control panels, with VCI, desiccant and humidity indicator options.',
  },
  {
    slug: 'lubricants-and-base-oils',
    name: 'Lubricants and Base Oils',
    applications: 'Round drum liners with dispensing spout, reusable drum programmes',
    intro:
      'Drums in a lubricant operation are opened many times before they are empty, and each opening exposes the whole batch to air, moisture and dust. Meanwhile the drum itself is scrapped or reconditioned at cost because the product touched the wall.',
    problem_lead:
      'Product lost as residue, drums scrapped, and a batch that degrades a little every time the drum is opened.',
    priority: 3,
    products: [
      'drum-liner-with-integrated-dispensing-spout',
      'round-drum-liner-any-diameter',
      'aluminium-barrier-drum-liner',
      'liquid-flexi-bag',
    ],
    seo_title: 'Drum Liners for Lubricants and Base Oils | GI PackTech',
    seo_description:
      'Drum liners with integrated dispensing spouts for lubricant and base oil blenders. Controlled dispensing, clean drums and reusable drum programmes.',
  },
  {
    slug: 'chemicals-and-specialty-chemicals',
    name: 'Chemicals and Specialty Chemicals',
    applications: 'Drum liners, jumbo liners, barrier liners, flexi bags, spill bunds',
    intro:
      'Chemical packaging is a compatibility question before it is a price question. The wrong film is attacked, softened or discoloured by the product inside it, and the loss is the batch, not the liner.',
    problem_lead:
      'If the film is wrong, the liner degrades and the product is contaminated or lost.',
    priority: 4,
    products: [
      'pvc-round-drum-liner',
      'pvc-bulk-bag-liner',
      'conductive-liner',
      'aluminium-5-and-6-layer-liner',
      'liquid-flexi-bag',
      'spill-containment-bund-and-drip-tray',
    ],
    seo_title: 'Packaging for Chemicals and Specialty Chemicals | GI PackTech',
    seo_description:
      'Drum liners, FIBC liners, barrier and conductive constructions, flexi bags and spill bunds for chemical plants. Material specified against your product data sheet.',
  },
  {
    slug: 'pharmaceutical-and-intermediates',
    name: 'Pharmaceutical and Intermediates',
    applications: 'Aluminium barrier liners, conductive liners, drum liners',
    intro:
      'Intermediates that are both moisture-sensitive and flammable usually end up double lined, which doubles the material, the labour and the chance of a fitting error. One correctly specified liner removes all three.',
    problem_lead:
      'A batch that picks up moisture in transit can be worth many times the value of the whole packaging order.',
    priority: 5,
    products: [
      'aluminium-barrier-drum-liner',
      'conductive-aluminium-liner',
      'aluminium-5-and-6-layer-liner',
      'conductive-round-drum-liner',
      'conductive-liner',
    ],
    seo_title: 'Packaging for Pharmaceutical Intermediates | GI PackTech',
    seo_description:
      'Aluminium barrier and conductive liners for pharmaceutical intermediates and fine chemicals. Combined static and moisture protection in a single liner.',
  },
  {
    slug: 'food-and-food-ingredients',
    name: 'Food and Food Ingredients',
    applications: 'EVOH liners, box type liners, food-grade constructions',
    intro:
      'Oxygen is the controlling problem for most food ingredients. Colour drifts, aroma fades, a batch is downgraded — and the complaint arrives at the quality desk, not at the packaging desk.',
    problem_lead:
      'The loss shows up as a quality complaint, and very few people connect it back to the liner.',
    priority: 6,
    products: [
      'evoh-barrier-liner',
      'pe-box-type-liner',
      'multilayer-plastic-liner',
      'baffle-and-gambo-liner',
      'pallet-top-sheet-and-liner',
    ],
    seo_title: 'Food Grade Liners and EVOH Barrier Packaging | GI PackTech',
    seo_description:
      'EVOH oxygen barrier liners, box type liners and food-grade constructions protecting aroma, colour and shelf life for food ingredient producers.',
  },
  {
    slug: 'fertilisers-and-agrochemicals',
    name: 'Fertilisers and Agrochemicals',
    applications: 'Aluminium liners for water-based fertilisers, FIBC and liners',
    intro:
      'Fertiliser is a seasonal business, so stock sits through the worst of the humidity. Caked product is either reprocessed at a cost or sold at a discount, and the packaging is a small fraction of what that loss is worth.',
    problem_lead: 'Caking is not a fact of life. It is moisture coming through the packaging.',
    priority: 7,
    products: [
      'aluminium-multilayer-liner-for-water-based-fertilisers',
      'fibc-bag-with-air-releasing-vent',
      'net-baffle-jumbo-bag',
      'multilayer-aluminium-laminated-liner-for-powders',
    ],
    seo_title: 'Fertiliser and Agrochemical Packaging | GI PackTech',
    seo_description:
      'Aluminium multilayer liners developed for water-based fertilisers, plus vented and baffle FIBCs. Stops caking and moisture pickup through seasonal storage.',
  },
  {
    slug: 'warehousing-exports-and-logistics',
    name: 'Warehousing, Exports and Logistics',
    applications: 'Pallet covers, shrink hoods, top sheets, dunnage air bags',
    intro:
      'A pallet is where a shipment is most exposed. The goods have left their cartons, they are stacked in the open, and they will be handled by people who did not pack them.',
    problem_lead:
      'Damage on the pallet is the most common damage in the supply chain, and the cheapest to prevent.',
    priority: 8,
    products: [
      'ldpe-pallet-cover-and-hood',
      'pallet-shrink-hood',
      'pallet-top-sheet-and-liner',
      'dunnage-air-bag',
      'woven-laminated-pallet-cover',
    ],
    seo_title: 'Pallet and Export Packaging for Warehousing and Logistics | GI PackTech',
    seo_description:
      'Pallet hoods, shrink hoods, top sheets, reusable covers and dunnage air bags for warehouses, exporters and freight operations.',
  },
  {
    slug: 'oil-petrochemical-and-refinery',
    name: 'Oil, Petrochemical and Refinery',
    applications: 'Drum liners, bulk liners, conductive liners',
    intro:
      'Refinery and petrochemical operations combine high-value product with classified hazardous zones, which means barrier performance and static control are usually needed in the same package.',
    problem_lead: 'One static ignition event costs more than a lifetime of liner supply.',
    priority: 9,
    products: [
      'conductive-round-drum-liner',
      'conductive-liner',
      'round-drum-liner-any-diameter',
      'conductive-aluminium-liner',
    ],
    seo_title: 'Oil, Petrochemical and Refinery Packaging | GI PackTech',
    seo_description:
      'Conductive drum and bulk liners for refinery and petrochemical operations in classified hazardous zones, with defined grounding arrangements.',
  },
  {
    slug: 'alcohol-and-breweries',
    name: 'Alcohol and Breweries',
    applications: 'Conductive drum liners',
    intro:
      'Alcohol handling means flammable vapour in the headspace, and the movement of liquid against a liner wall builds the charge that can ignite it.',
    problem_lead: 'A spark inside a headspace full of vapour is the risk this product exists to remove.',
    priority: 10,
    products: ['conductive-round-drum-liner', 'conductive-liner', 'round-drum-liner-any-diameter'],
    seo_title: 'Conductive Liners for Alcohol and Breweries | GI PackTech',
    seo_description:
      'Static-dissipative drum and bulk liners for alcohol, brewery and solvent operations, supplied with a defined grounding arrangement.',
  },
  {
    slug: 'automotive-and-component-manufacturing',
    name: 'Automotive and Component Manufacturing',
    applications: 'VCI covers, VCI pallet covers, component covers',
    intro:
      'Machined and unpainted metal surfaces corrode in storage, and the usual answer is oil or grease that has to be degreased before assembly. That step costs labour, solvent and time on every part.',
    problem_lead: 'You are paying twice: once to protect the part, and again to clean the protection off.',
    priority: 11,
    products: ['vci-pallet-cover', 'vci-machine-cover', 'battery-charger-and-component-cover'],
    seo_title: 'VCI Packaging for Automotive and Component Manufacturing | GI PackTech',
    seo_description:
      'VCI pallet covers and component covers for machined parts, castings, forgings and fasteners. No oil to apply and nothing to degrease.',
  },
  {
    slug: 'metals-alloys-and-scrap',
    name: 'Metals, Alloys and Scrap',
    applications: 'Heavy duty drum liners, VCI covers',
    intro:
      'Metal stock and scrap are heavy, abrasive and usually stored where the weather can reach them. The packaging has to survive the handling as well as the exposure.',
    problem_lead: 'Rust on stock is a discount you take at the point of sale, months after the packaging decision.',
    priority: 12,
    products: ['round-drum-liner-any-diameter', 'vci-pallet-cover', 'shrink-wrap-cover', 'vci-machine-cover'],
    seo_title: 'Packaging for Metals, Alloys and Scrap | GI PackTech',
    seo_description:
      'Heavy duty drum liners, VCI covers and shrink wrap for metal stock, alloys, coils and scrap in storage and transit.',
  },
  {
    slug: 'construction-and-infrastructure',
    name: 'Construction and Infrastructure',
    applications: 'Bladder tanks, spill bunds, woven pallet covers',
    intro:
      'A construction site is temporary by nature, so anything permanent is the wrong answer. Storage, containment and cover all have to arrive fast, work outdoors, and move with the project.',
    problem_lead: 'When the project moves, a fixed tank cannot move with it.',
    priority: 13,
    products: [
      'collapsible-bladder-tank',
      'spill-containment-bund-and-drip-tray',
      'woven-laminated-pallet-cover',
      'pvc-pallet-cover-and-reusable-equipment-cover',
    ],
    seo_title: 'Site Storage, Containment and Covers for Construction | GI PackTech',
    seo_description:
      'Collapsible bladder tanks, flexible spill bunds and reusable woven and PVC covers for construction, infrastructure and remote project sites.',
  },
  {
    slug: 'demolition-and-remediation',
    name: 'Demolition and Remediation',
    applications: 'Asbestos and hazardous waste containment chambers',
    intro:
      'On a licensed site, the enclosure is not a packaging decision. It is the thing that lets the work start at all, and it has to satisfy the method statement and the governing regulation.',
    problem_lead: 'Compliance decides this purchase, not price.',
    priority: 14,
    products: [
      'asbestos-demolition-containment-chamber',
      'nuclear-and-hazardous-waste-site-enclosure',
      'spill-containment-bund-and-drip-tray',
    ],
    seo_title: 'Asbestos and Hazardous Waste Containment | GI PackTech',
    seo_description:
      'Sealed containment chambers for asbestos removal, demolition and licensed remediation work, fabricated to your method statement and governing regulation.',
  },
];

/*
 * The four people a packaging decision passes through. Each gets its own
 * entry point, because each of them is measured on something different.
 */
const roles = [
  {
    slug: 'plant-and-operations',
    name: 'Plant Head and Operations',
    short_name: 'Operations',
    cares_about: 'Output, downtime, line speed, product loss',
    headline: 'Your filling line is slower than it needs to be, and product is leaving in the liner.',
    intro:
      'Most of what limits a filling line is not the machine. Air that cannot escape during filling slows the cycle and pushes bags out of shape. Tube liners have to be worked into shape as they fill. Creases hold product you have already paid for.',
    points:
      'Vent panels cut the fill cycle without touching the filling equipment\nBox type liners fill square from the first load and crease far less\nBaffle constructions hold shape so the warehouse stacks properly\nLiners made to the measured drum leave less residue behind\nDunnage bags stop the load movement that damages goods in transit',
    icon: 'gauge',
    products: [
      'fibc-bag-with-air-releasing-vent',
      'pe-box-type-liner',
      'round-drum-liner-any-diameter',
      'net-baffle-jumbo-bag',
      'dunnage-air-bag',
    ],
    seo_title: 'Packaging for Plant and Operations Heads | GI PackTech',
    seo_description:
      'Faster filling, less residue, fewer transit failures and a smoother line. Packaging specified around throughput rather than around unit price.',
  },
  {
    slug: 'quality',
    name: 'Quality Head',
    short_name: 'Quality',
    cares_about: 'Rejections, complaints, shelf life, consistency',
    headline: 'The complaint arrives at your desk, but the cause is usually the packaging.',
    intro:
      'Colour drifts. Aroma fades. A powder cakes. A consignment is rejected at the destination. These arrive as quality complaints, and very few of them are traced back to oxygen or moisture coming through the liner.',
    points:
      'EVOH barrier stops the oxygen ingress behind colour and aroma complaints\nAluminium 5 and 6 layer constructions hold a product stable across a long sea route\nCaking in storage is moisture through the packaging, not an inherent property of the powder\nSeal integrity, not film thickness, is where most barrier failures actually happen\nSide-by-side trials at the same interval settle the question with your own product',
    icon: 'check',
    products: [
      'evoh-barrier-liner',
      'aluminium-5-and-6-layer-liner',
      'aluminium-barrier-drum-liner',
      'multilayer-aluminium-laminated-liner-for-powders',
      'electrical-panel-packaging-cover',
    ],
    seo_title: 'Packaging for Quality Heads — Barrier and Shelf Life | GI PackTech',
    seo_description:
      'Barrier performance, no moisture pickup, no caking and a stable product on arrival. Liners specified against your product data and your transport route.',
  },
  {
    slug: 'safety-and-ehs',
    name: 'Safety and EHS Head',
    short_name: 'Safety & EHS',
    cares_about: 'Static, ignition risk, spills, audit findings, compliance',
    headline: 'A conductive bag with a plain liner inside it is not a safe system.',
    intro:
      'Static control fails at the joins: a liner that holds charge inside a Type C bag, an earthing step that depends on an operator downstream, a secondary containment requirement satisfied on paper but not on the floor.',
    points:
      'Type C works only where grounding is guaranteed at every transfer. Type D does not depend on the operator\nThe liner sits between the product and the bag, so a plain liner defeats a conductive bag\nConductive and aluminium barrier can be combined in one construction instead of double lining\nFlexible spill bunds satisfy secondary containment without civil work and move with the equipment\nContainment chambers are fabricated to your method statement and the governing regulation',
    icon: 'shield',
    products: [
      'conductive-type-d-jumbo-bag',
      'conductive-liner',
      'conductive-aluminium-liner',
      'spill-containment-bund-and-drip-tray',
      'asbestos-demolition-containment-chamber',
    ],
    seo_title: 'Packaging for Safety and EHS Heads — Static and Containment | GI PackTech',
    seo_description:
      'Conductive and Type D systems, static-dissipative liners, spill containment bunds and containment chambers built to your method statement.',
  },
  {
    slug: 'procurement-and-supply-chain',
    name: 'Purchase and Supply Chain',
    short_name: 'Procurement',
    cares_about: 'Price, lead time, reliability, total delivered cost',
    headline: 'The lowest price per piece is often the highest cost per delivered tonne.',
    intro:
      'A packaging line item is easy to compare. What sits behind it is not: freight paid on wasted container volume, drums scrapped instead of reused, claims that are never recovered, and reusable covers bought again every quarter.',
    points:
      'Baffle constructions cost more per piece and less per tonne delivered\nReusable drum programmes turn a disposal cost into a returnable asset\nOne conductive aluminium liner replaces two liners and the labour of fitting both\nReusable woven and PVC covers replace a repeating film purchase\nFlexi bags remove IBC cleaning, tracking, repair and empty return freight',
    icon: 'calculator',
    products: [
      'net-baffle-jumbo-bag',
      'drum-liner-with-integrated-dispensing-spout',
      'conductive-aluminium-liner',
      'woven-laminated-pallet-cover',
      'liquid-flexi-bag',
    ],
    seo_title: 'Packaging for Purchase and Supply Chain | GI PackTech',
    seo_description:
      'Total cost per delivered tonne, reusable drum programmes, container efficiency and fewer claims. The arithmetic behind the packaging line item.',
  },
];

const materials = [
  {
    slug: 'polyethylene-multilayer',
    name: 'Polyethylene, multilayer',
    main_property: 'Strength, non-bulging, general purpose',
    specified_for: 'Non-hazardous liquids, powders, granules',
    detail:
      'A well-designed multilayer film can be thinner than the single-layer film it replaces and still be stronger, which brings the cost per liner down rather than up.',
  },
  {
    slug: 'evoh-barrier-film',
    name: 'EVOH barrier film',
    main_property: 'High oxygen barrier',
    specified_for: 'Food ingredients, oxygen-sensitive chemicals, oils and fats',
    detail:
      'Co-extruded between polymer layers, so it gives an oxygen barrier while keeping the sealing behaviour and flexibility of an ordinary PE liner.',
  },
  {
    slug: 'aluminium-laminate',
    name: 'Aluminium laminate, 5 & 6 layer',
    main_property: 'Almost total moisture and gas barrier',
    specified_for: 'Hygroscopic powders, catalysts, pharma intermediates',
    detail:
      'Each layer is specified for a job: mechanical strength, barrier, seal integrity and puncture resistance. Most barrier failures happen at the seal rather than through the film.',
  },
  {
    slug: 'conductive-film',
    name: 'Conductive film',
    main_property: 'Static dissipation',
    specified_for: 'Flammable powders, solvents, alcohol',
    detail:
      'Gives static charge a controlled path away instead of letting it collect on the film surface. Supplied with a defined grounding arrangement where one is needed.',
  },
  {
    slug: 'conductive-aluminium-laminate',
    name: 'Conductive aluminium laminate',
    main_property: 'Static dissipation plus barrier',
    specified_for: 'Flammable hygroscopic powders',
    detail:
      'Combines both jobs in one construction, so a plant that would otherwise double-line can use a single liner.',
  },
  {
    slug: 'pvc-film',
    name: 'PVC film',
    main_property: 'Flexibility, clarity, chemical resistance',
    specified_for: 'Aggressive chemicals, containers needing content visibility',
    detail:
      'Holds product groups that attack polyethylene. Stays soft across a wide temperature range and can be supplied clear so contents stay visible.',
  },
  {
    slug: 'pvc-coated-fabric',
    name: 'PVC-coated fabric',
    main_property: 'Heavy duty, reusable, waterproof',
    specified_for: 'Reusable covers, bladder tanks, spill bunds',
    detail:
      'Built for years of repeated daily use rather than a single journey. Wipe clean, so it stays presentable in a working environment.',
  },
  {
    slug: 'woven-laminated-fabric',
    name: 'Woven laminated fabric',
    main_property: 'High tear strength, reusable, weatherproof',
    specified_for: 'Pallet covers, outdoor and long-term storage',
    detail:
      'The woven base gives tear strength plain film cannot reach, and the lamination makes it weatherproof. UV stabilised grades available.',
  },
  {
    slug: 'aluminium-vacuum-laminate',
    name: 'Aluminium vacuum laminate',
    main_property: 'Total barrier, vacuumable, VCI compatible',
    specified_for: 'Capital goods, glass, panels, precision machines',
    detail:
      'The vacuum process lowers oxygen inside the cover, holding back aerobic growth and stopping volatile components evaporating. Up to 6-layer with nylon and polyester.',
  },
  {
    slug: 'vci-film',
    name: 'VCI film',
    main_property: 'Vapour corrosion inhibition',
    specified_for: 'Machined and unpainted metal surfaces',
    detail:
      'Releases a vapour that settles on every metal surface inside the sealed cover, including internal bores the film never touches. Nothing to degrease afterwards.',
  },
  {
    slug: 'heat-shrinkable-film',
    name: 'Heat-shrinkable film',
    main_property: 'Shrinks tight to shape, holds load as one unit',
    specified_for: 'Pallet hoods, coils, reels, round components',
    detail:
      'Follows the shape closely instead of hanging loose, so there are no folds where water collects. Shrink ratio is matched to the load shape.',
  },
];

/*
 * The enquiry checklist from the catalogue, turned into the guided
 * "Specify your requirement" form. Every field explains why it is asked,
 * which is what makes the form read as technical rather than as a lead capture.
 */
const checklist = [
  {
    field_key: 'product_packed',
    question: 'What product will be packed?',
    why: 'Decides material compatibility and the barrier needed',
    input_type: 'text',
    required: 1,
    step: 1,
  },
  {
    field_key: 'container_dimensions',
    question: 'Container internal diameter and height, or machine dimensions',
    why: 'The liner or cover is built to these dimensions',
    input_type: 'text',
    required: 1,
    step: 1,
  },
  {
    field_key: 'container_type',
    question: 'Container type',
    why: 'Decides fitment, gusset and closure arrangement',
    input_type: 'select',
    options: 'Steel drum\nPlastic drum\nFibre drum\nFIBC / jumbo bag\nPallet\nCrate\nMachine or equipment\nOther',
    required: 0,
    step: 1,
  },
  {
    field_key: 'fill_discharge',
    question: 'Fill and discharge method',
    why: 'Decides spout, valve and bottom construction',
    input_type: 'text',
    required: 0,
    step: 2,
  },
  {
    field_key: 'temperature_range',
    question: 'Temperature range during filling, transport and storage',
    why: 'Decides film selection and seal specification',
    input_type: 'text',
    required: 0,
    step: 2,
  },
  {
    field_key: 'flammable',
    question: 'Is the product flammable or static-sensitive?',
    why: 'Decides whether a conductive construction is required',
    input_type: 'select',
    options: 'Yes\nNo\nNot sure',
    required: 0,
    step: 2,
  },
  {
    field_key: 'regulated_grade',
    question: 'Is a food, pharma or regulated grade required?',
    why: 'Decides material certification',
    input_type: 'select',
    options: 'No\nFood grade\nPharma grade\nOther regulated grade',
    required: 0,
    step: 2,
  },
  {
    field_key: 'storage_route',
    question: 'Storage duration and transport route',
    why: 'Decides barrier level and layer count',
    input_type: 'text',
    required: 0,
    step: 3,
  },
  {
    field_key: 'storage_location',
    question: 'Indoor or outdoor storage, and for how long?',
    why: 'Decides UV grade and fabric weight',
    input_type: 'text',
    required: 0,
    step: 3,
  },
  {
    field_key: 'reusable',
    question: 'Single use or reusable?',
    why: 'Decides between film and coated fabric construction',
    input_type: 'select',
    options: 'Single use\nReusable\nNot sure',
    required: 0,
    step: 3,
  },
  {
    field_key: 'annual_quantity',
    question: 'Estimated annual quantity and call-off pattern',
    why: 'Decides tooling, pricing and lead time',
    input_type: 'text',
    required: 0,
    step: 3,
  },
  {
    field_key: 'printing',
    question: 'Printing, coding or identification required?',
    why: 'Decides print setup',
    input_type: 'text',
    required: 0,
    step: 3,
  },
];

module.exports = { industries, roles, materials, checklist };
