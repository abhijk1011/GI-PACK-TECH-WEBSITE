'use strict';

/*
 * Product catalogue content.
 *
 * Every product follows the same narrative order on the page:
 *   problem_headline / problem_body   -> the loss the buyer is already carrying
 *   description                       -> what the product is and how it works
 *   features / materials / sizes      -> the specification
 *   difference_body                   -> why ours is built the way it is
 *   customise                         -> what can be changed for the buyer
 *
 * Copy is customer-facing throughout. Internal sales guidance from the
 * catalogue's Marketing Points boxes is deliberately not reproduced here.
 */

const categories = [
  {
    slug: 'round-drum-liners',
    number: '01',
    name: 'Round Drum Liners',
    short_name: 'Drum Liners',
    tagline: 'Any internal diameter from 6 inches to 100 inches',
    intro:
      'A round drum liner sits inside a steel, plastic or fibre drum and holds the product, so the product never touches the drum wall. This is the base of a reusable packaging system. The liner is the only part that is thrown away. The drum comes back through the distribution chain and is used again, instead of being scrapped, cleaned at high cost, or sold off as low-grade steel.\n\nWe make round drum liners in any internal diameter from 6 inches to 100 inches. Very few manufacturers anywhere offer this full range. Every liner is made in a material chosen for your product, temperature and handling conditions.',
    problem_lead:
      'A drum that has held product against its own wall is a drum you can only use once.',
    icon: 'drum',
    seo_title: 'Round Drum Liners — 6" to 100" Any Diameter | GI PackTech',
    seo_description:
      'Custom round drum liners made to your drum, from 6 to 100 inch internal diameter. PE, EVOH, aluminium barrier, conductive and PVC constructions. Manufacturer and exporter since 2006.',
    sort: 1,
  },
  {
    slug: 'fibc-and-jumbo-bags',
    number: '02',
    name: 'FIBC and Jumbo Bags',
    short_name: 'FIBC & Jumbo Bags',
    tagline: 'Woven polypropylene bulk containers built to your load',
    intro:
      'Flexible Intermediate Bulk Containers are made from woven polypropylene fabric under strict process control, using good grade fabric and materials. Loop arrangement, fabric grade, safe working load, discharge arrangement and printing are all built to your specification.',
    problem_lead:
      'A bag that fills slowly, bulges round and will not stack square is costing you space on every pallet and in every container.',
    icon: 'bag',
    seo_title: 'FIBC and Jumbo Bags — Type C, Type D, Baffle, Vented | GI PackTech',
    seo_description:
      'Custom FIBC and jumbo bags: vented, net baffle, conductive Type C and antistatic Type D. Fabric grade, safe working load and discharge built to your specification.',
    sort: 2,
  },
  {
    slug: 'bulk-bag-and-fibc-liners',
    number: '03',
    name: 'Bulk Bag and FIBC Liners',
    short_name: 'Bulk Bag Liners',
    tagline: 'The liner decides the barrier, not the bag',
    intro:
      'Liners are fitted inside an FIBC or a bulk container to keep the product away from the woven fabric. The liner decides the barrier performance, the static behaviour, the hygiene and how much residue is left behind. This is why the liner is specified against the product, not against the bag.\n\nAcross the world these jumbo liner bags are chosen for their non-bulging strength, their sturdiness, and the way they make full use of the available volume.',
    problem_lead:
      'The bag is chosen on price. The liner inside it is what actually decides whether your product survives.',
    icon: 'layers',
    seo_title: 'Bulk Bag and FIBC Liners — EVOH, Aluminium, Conductive | GI PackTech',
    seo_description:
      'Multilayer, EVOH barrier, aluminium 5 and 6 layer, conductive and box type FIBC liners. Specified against your product data, not against the bag.',
    sort: 3,
  },
  {
    slug: 'liquid-flexi-bags-and-bladder-tanks',
    number: '04',
    name: 'Liquid Flexi Bags and Bladder Tanks',
    short_name: 'Flexi Bags & Tanks',
    tagline: 'Bulk liquid without a container to clean, track or return',
    intro:
      'Flexible containers for bulk liquid. They remove the cost, the cleaning and the return journey that come with rigid IBCs and drums. Shapes, materials and the outer holding arrangement are all built to your product, vehicle and handling method.',
    problem_lead:
      'An IBC fleet is an asset you buy once and then pay for forever, in cleaning, tracking, repair and empty return journeys.',
    icon: 'droplet',
    seo_title: 'Liquid Flexi Bags and Collapsible Bladder Tanks | GI PackTech',
    seo_description:
      '1000 to 1500 litre liquid flexi bags with inlet and discharge valves, and collapsible PVC bladder tanks with knock-down support frames for site storage.',
    sort: 4,
  },
  {
    slug: 'machine-covers-and-protective-packaging',
    number: '05',
    name: 'Machine Covers and Protective Packaging',
    short_name: 'Machine Covers',
    tagline: 'Built to the machine drawing, not to a standard bag size',
    intro:
      'Capital equipment is exposed to moisture, salt air, dust and knocks from the moment it leaves the assembly floor until it is commissioned at site. That is often several weeks later, after a sea voyage and an inland journey. We make protective covers in a range of materials and shapes for machinery of any size, built to the equipment\'s own dimensions rather than to a standard bag size.\n\nThe value of the machine inside is usually thousands of times the value of the cover.',
    problem_lead:
      'Transit corrosion is found at commissioning, when your engineer is already on site and your customer is already waiting.',
    icon: 'shield',
    seo_title: 'Machine Covers — VCI, Aluminium Vacuum Laminate, CNC | GI PackTech',
    seo_description:
      'Protective covers for CNC machines, generators, transformers, panels, turbines and compressors. Aluminium vacuum laminate, VCI and shrink constructions made to your drawing.',
    sort: 5,
  },
  {
    slug: 'pallet-covers-and-pallet-wraps',
    number: '06',
    name: 'Pallet Covers and Pallet Wraps',
    short_name: 'Pallet Covers',
    tagline: 'The most common damage in the supply chain, and the cheapest to prevent',
    intro:
      'A pallet is where a shipment is most exposed. The goods have left their individual cartons behind, they are stacked in the open, and they will be handled several times by people who did not pack them. Damage on the pallet is the most common damage in the whole supply chain, and it is also the cheapest to prevent.\n\nWe make pallet covers and pallet wraps in film, woven laminate and PVC, in single-use and reusable formats, sized to your own pallet and stack height rather than to a standard size.',
    problem_lead:
      'Stretch wrap leaves the top face of every pallet open. That is exactly where dust settles and water lands first.',
    icon: 'pallet',
    seo_title: 'Pallet Covers, Shrink Hoods, Top Sheets and Dunnage Bags | GI PackTech',
    seo_description:
      'LDPE pallet hoods, shrink hoods, woven laminated and PVC reusable covers, VCI pallet covers, top sheets and dunnage air bags. Made to your pallet size and stack height.',
    sort: 6,
  },
  {
    slug: 'hazardous-waste-containment',
    number: '07',
    name: 'Hazardous Waste Containment and Spill Control',
    short_name: 'Hazardous Containment',
    tagline: 'Built to your method statement, not from a catalogue',
    intro:
      'Containment chambers made in any material for hazardous waste sites, built to the specification and requirements of each individual site. This is specialised work with a high technical and regulatory barrier to entry, and it is carried out to the site\'s own engineering and safety requirements.',
    problem_lead:
      'On a licensed site, the enclosure is not a packaging decision. It is the thing that lets the work start at all.',
    icon: 'hazard',
    seo_title: 'Asbestos, Nuclear and Hazardous Waste Containment | GI PackTech',
    seo_description:
      'Sealed containment chambers for asbestos removal and demolition, nuclear and hazardous waste site enclosures, and flexible PVC spill containment bunds built to your method statement.',
    sort: 7,
  },
];

const products = [
  // ---------------------------------------------------------------- 1. Drum liners
  {
    category: 'round-drum-liners',
    code: '1.1',
    slug: 'drum-liner-with-integrated-dispensing-spout',
    name: 'Round Drum Liner with Integrated Dispensing Spout',
    tagline: 'Turns a throwaway drum into a returnable asset',
    badge: 'Flagship',
    featured: 1,
    problem_headline: 'You are losing money in three places, and you can only see one of them.',
    problem_body:
      'Product is lost as residue clinging to a dirty drum. Drums are scrapped or sent for expensive cleaning because the product touched the wall. And every time the drum is opened, the batch inside picks up moisture and dust, which shortens its usable life.\n\nThe spout closes all three gaps at the same time.',
    description:
      'A dispensing spout is fitted to the liner in the factory, and it changes the way a drum is opened and emptied. With a normal liner, the whole drum has to be opened every time material is taken out. The full contents are exposed to air, moisture and dust on every single occasion. With the integrated spout, the operator draws only the quantity needed and the rest of the material stays sealed inside the liner.\n\nBecause the product never touches the drum wall, the drum stays clean for its whole working life. It can go back to the manufacturer through the distributor and be used again, instead of being scrapped or sent for costly reconditioning. For operations with sustainability targets or extended producer responsibility duties, this turns a throwaway drum into a returnable asset.',
    features:
      'Spout fitted in the factory. No modification needed at your site\nControlled, measured dispensing without opening the full drum\nDrum interior stays clean and can be reused many times\nLess product loss and less residue at the bottom of the drum\nCleaner, faster and safer handling for the operator\nSupports returnable and reusable drum programmes\nLower disposal, cleaning and reconditioning cost over the life of the drum',
    materials:
      'Multilayer PE, EVOH barrier film, aluminium laminate, conductive or antistatic film, or PVC. The material is chosen for your product.',
    sizes: 'Any drum internal diameter from 6 inches to 100 inches. Height and gusset made to the drum.',
    applications:
      'Lubricants and base oils, specialty chemicals, food-grade liquids, inks, adhesives, and any application where the drum is opened again and again.',
    where_used:
      'Lubricant and base oil blenders, ink and adhesive makers, specialty chemical plants, and any operation whose drums are opened many times before they are empty. It is strongest where the same drum travels between a plant and a distributor on a regular route.',
    difference_body:
      'We developed the spout fitment as a factory-sealed joint, not a field-fitted add-on. The seal around the spout is the weak point in this kind of product, so it is welded under controlled conditions on our own line and tested before dispatch. We have run this fitment across PE, EVOH, aluminium laminate and conductive films, which means you do not have to give up barrier or static protection to get a spout.',
    customise:
      'Spout size and type\nSpout position\nLiner diameter and height\nGusset shape\nBottom shape\nFilm structure and layer count\nPrinting and batch coding',
    related: ['round-drum-liner-any-diameter', 'aluminium-barrier-drum-liner', 'conductive-round-drum-liner'],
    seo_title: 'Drum Liner with Integrated Dispensing Spout | GI PackTech',
    seo_description:
      'Factory-fitted dispensing spout drum liners in PE, EVOH, aluminium laminate and conductive film. Controlled dispensing, clean drums, reusable drum programmes. 6" to 100" diameter.',
  },
  {
    category: 'round-drum-liners',
    code: '1.2',
    slug: 'round-drum-liner-any-diameter',
    name: 'Round Drum Liner — Any Diameter from 6 to 100 Inches',
    tagline: 'Made to your drum, not to whatever size the supplier already makes',
    badge: '6" – 100"',
    featured: 1,
    problem_headline: 'A liner that does not fit your drum is quietly costing you product on every batch.',
    problem_body:
      'Most buyers have accepted a liner that does not fit, because that is all their current supplier makes. They live with creasing, trapped product and the occasional seam failure and treat it as normal.\n\nA liner that is too small is stressed at the seams under the weight of the product and can burst in transit. A liner that is too large folds and creases, and product gets trapped in those folds and cannot be recovered. The difference in residue and in transit failures is obvious within one batch.',
    description:
      'Standard drum liners force you to accept whatever size the supplier already makes. We make the liner to the drum instead. Getting the diameter right is not a cosmetic matter.\n\nThe 6 inch to 100 inch range covers everything from small laboratory and pharmaceutical containers, through 200 litre process drums, up to large open-top bulk containers. All of them are built to the same construction standard.',
    features:
      'Made to your measured drum internal diameter and height\nFlat, gusseted, conical or shaped bottom to suit the discharge method\nSingle layer or multi-layer construction depending on the barrier needed\nOptional printed identification, batch coding and grade marking\nSample liners supplied for trial fitment before bulk production',
    materials: 'PE, multilayer co-extruded film, EVOH, aluminium laminate, conductive film, PVC.',
    sizes: '6 inches to 100 inches internal diameter. Any height.',
    applications:
      'Lubricants, alcohol and breweries, chemicals, pharmaceutical intermediates, inks, paints, pigments, adhesives, metal scrap and alloys, catalysts, and nuclear waste.',
    where_used:
      'Any plant that fills drums. It is most valuable where you have non-standard drums, imported drums, or a mixed drum fleet that no single standard liner size fits properly.',
    difference_body:
      'The 6 to 100 inch capability is a plant investment, not a claim. It comes from our own lamination, extrusion, cutting and heat-sealing lines and from tooling built up over years of one-off jobs. Very few manufacturers can quote the small diameters and the very large diameters from the same shop floor.\n\nSend us the drum drawing, or one sample drum, and we will make a trial liner to it.',
    customise:
      'Diameter and height\nBottom shape\nGusset arrangement\nLayer structure and thickness\nPrinting and identification\nPacking format for your filling line',
    related: ['drum-liner-with-integrated-dispensing-spout', 'pvc-round-drum-liner', 'aluminium-barrier-drum-liner'],
    seo_title: 'Round Drum Liners 6 to 100 Inch Diameter, Made to Your Drum | GI PackTech',
    seo_description:
      'Custom round drum liners in any internal diameter from 6 to 100 inches, any height. Flat, gusseted or conical bottoms. Sample liners supplied for trial fitment.',
  },
  {
    category: 'round-drum-liners',
    code: '1.3',
    slug: 'conductive-round-drum-liner',
    name: 'Conductive Round Drum Liner',
    tagline: 'Static control that fits your existing earthing procedure',
    problem_headline: 'One static ignition event costs more than a lifetime of liner supply.',
    problem_body:
      'When flammable solvents, alcohols or fine powders are filled or discharged, the movement of the material against the liner wall builds up static charge. If that charge is allowed to collect, it can jump as a spark inside a headspace full of vapour.\n\nThis is a safety decision, not a purchase decision. Where a plant has had a near-miss, or where an insurer or auditor has raised static as a finding, the case is already made.',
    description:
      'A conductive drum liner carries the charge safely away to earth through the drum. The liner is made from conductive or static-dissipative film and is supplied with a defined grounding arrangement, so it fits into your existing earthing procedure without any change.',
    features:
      'Static-dissipative construction for flammable and explosive atmospheres\nStops charge from building up during high-speed filling and discharge\nDefined grounding point for connection to the plant earth\nCan be combined with aluminium barrier layers',
    materials: 'Conductive film. Conductive aluminium laminate where both static and barrier protection are needed.',
    sizes: '6 inches to 100 inches internal diameter.',
    applications:
      'Solvents, alcohol and brewery products, flammable chemicals, fine powders, pharmaceutical intermediates.',
    where_used:
      'Solvent plants, alcohol and brewery operations, agrochemical and fine chemical sites, and any area classified as a hazardous zone.',
    difference_body:
      'Our work has focused on combining static control with barrier performance in one liner. A plant that needs both usually double-lines, which is slow and expensive. We can supply a single conductive aluminium construction that does both jobs.\n\nWe will bring the grounding arrangement drawing to the first technical discussion.',
    customise:
      'Film type and resistivity class\nGrounding tab position and type\nDiameter and height\nCombination with aluminium barrier layers',
    related: ['conductive-aluminium-liner', 'aluminium-barrier-drum-liner', 'conductive-type-d-jumbo-bag'],
    seo_title: 'Conductive Static-Dissipative Round Drum Liner | GI PackTech',
    seo_description:
      'Conductive drum liners for flammable solvents, alcohols and fine powders. Static-dissipative film with a defined grounding arrangement. 6" to 100" diameter.',
  },
  {
    category: 'round-drum-liners',
    code: '1.4',
    slug: 'aluminium-barrier-drum-liner',
    name: 'Aluminium Barrier Drum Liner',
    tagline: 'Almost total barrier against moisture, oxygen and gas',
    featured: 1,
    problem_headline: 'Your real cost is not the liner. It is the rejected batch.',
    problem_body:
      'A catalyst or intermediate that picks up moisture in transit can be worth many times the value of the whole packaging order. The rejection happens at the destination, thousands of kilometres away, where nobody can inspect anything until it is too late.\n\nFor products that spoil on contact with moisture, oxygen or light, a plain polyethylene liner is not enough.',
    description:
      'The aluminium barrier drum liner uses a layer of aluminium foil laminated between polymer layers. This gives an almost total barrier against gas and moisture, with very little passing through even at the heat-seal.\n\nThis construction is used where the product has to stay in exactly the same condition over a long storage or shipping period, and keep both its original physical form and its chemical properties.',
    features:
      'High barrier against moisture, oxygen and atmospheric gases\nProtects hygroscopic and temperature-sensitive products\nExtends usable shelf life in transit and in storage\nAvailable in 5-layer and 6-layer constructions\nCan be combined with conductive layers where static control is also needed',
    materials:
      'Aluminium foil laminated with polyester, nylon and polyethylene layers. 5-layer and 6-layer constructions.',
    sizes: '6 inches to 100 inches internal diameter.',
    applications:
      'Catalysts, pharmaceutical intermediates, hygroscopic powders, specialty chemicals, moisture-sensitive additives.',
    where_used:
      'Catalyst makers, pharmaceutical intermediate plants, specialty chemical exporters, and anyone shipping a moisture-sensitive product on a long sea route.',
    difference_body:
      'Our development work has been on the seal. A barrier film is only as good as its weakest seal, and most barrier failures happen there rather than through the film. Our 5-layer and 6-layer structures are built and sealed so that permeation at the seal stays minimal, which is what makes the barrier claim real over a long voyage.',
    customise:
      'Layer count\nFoil thickness\nSeal structure\nDiameter and height\nConductive variant\nDesiccant pocket\nPrinting',
    related: ['aluminium-5-and-6-layer-liner', 'conductive-round-drum-liner', 'drum-liner-with-integrated-dispensing-spout'],
    seo_title: 'Aluminium Barrier Drum Liner, 5 and 6 Layer | GI PackTech',
    seo_description:
      'Aluminium foil laminated drum liners with almost total moisture and gas barrier. For catalysts, pharma intermediates and hygroscopic powders on long export routes.',
  },
  {
    category: 'round-drum-liners',
    code: '1.5',
    slug: 'pvc-round-drum-liner',
    name: 'PVC Round Drum Liner',
    tagline: 'For product groups that polyethylene cannot hold',
    problem_headline: 'If the film is wrong, the liner degrades and the product is contaminated or lost.',
    problem_body:
      'This is a compatibility problem, not a price problem. Certain aggressive and hazardous chemical groups attack standard films.\n\nIf your current liner is being attacked, softened or discoloured by the product inside it, the answer is not a thicker version of the same material. It is the right material.',
    description:
      'PVC round drum liners are specified where the product will not sit safely against polyethylene, and where PVC is the only material that is compatible with what is being packed.\n\nPVC also stays soft and flexible over a wide temperature range, and can be supplied clear so the contents stay visible. It shapes itself to drums with an irregular profile, which makes it useful where the drum is not a clean cylinder.',
    features:
      'Compatible with product groups that standard polyethylene cannot hold\nStays flexible across a wide temperature range\nAvailable clear so the contents can be seen, or pigmented\nShapes itself to drums with an irregular internal profile\nMade to any drum diameter and height',
    materials: 'PVC film in the thickness you specify.',
    sizes: '6 inches to 100 inches internal diameter. Any height.',
    applications:
      'Hazardous and aggressive chemicals, specialty liquids, and industrial products where the contents need to be visible.',
    where_used:
      'Chemical plants handling aggressive product groups, specialty liquid makers, and any operation whose current liner is being attacked by the product inside it.',
    difference_body:
      'Material compatibility work is done case by case against your product data sheet before anything is quoted. We would rather refuse a job than supply a film that will fail. Send the data sheet first and we will tell you whether PVC is the right answer for your product, including when it is not.',
    customise:
      'Film thickness\nClear or pigmented\nDiameter and height\nBottom shape\nFitment arrangement',
    related: ['pvc-bulk-bag-liner', 'round-drum-liner-any-diameter', 'spill-containment-bund-and-drip-tray'],
    seo_title: 'PVC Round Drum Liner for Aggressive Chemicals | GI PackTech',
    seo_description:
      'Clear or pigmented PVC drum liners for chemical groups that attack polyethylene. Flexible across a wide temperature range, made to any drum diameter and height.',
  },

  // ---------------------------------------------------------------- 2. FIBC
  {
    category: 'fibc-and-jumbo-bags',
    code: '2.1',
    slug: 'fibc-bag-with-air-releasing-vent',
    name: 'Single and Double Loop FIBC Bag with Air Releasing Vent',
    tagline: 'Faster filling without touching the filling machine',
    problem_headline: 'Your filling line is the bottleneck, and most people blame the machine.',
    problem_body:
      'During fast filling, the air pushed out by the incoming product has to escape somewhere. Without venting it blows the bag up, slows the filling rate, and pushes the bag out of shape so it will not stack square.\n\nFilling is slow, bags come out fat and round, and the warehouse cannot stack them properly. The vent panel fixes it at a fraction of the cost of new filling equipment.',
    description:
      'A single or double loop FIBC fitted with air releasing vent panels. With venting, the fill cycle is faster, the bag holds the shape it is meant to hold on the pallet, and the stack is more stable in the warehouse and in the container.',
    features:
      'Single loop or double loop lifting arrangement\nAir releasing vent panels for faster filling and discharge\nBetter shape retention and a more stable stack\nFabric grade and safe working load made to your requirement\nFilling spout, discharge spout, flat top or flat bottom options\nCustom printing available',
    materials: 'Woven polypropylene fabric, coated or uncoated.',
    sizes: 'Made to your safe working load and fill volume.',
    applications:
      'Fertilisers, chemicals, minerals, food ingredients, plastic granules, cement and building materials.',
    where_used:
      'High-volume filling operations in fertiliser, minerals, cement and plastics. Anywhere the filling line is the bottleneck.',
    difference_body:
      'Our development work has been on where the vents are placed and how many are needed for a given fill rate and product density. Vents in the wrong place do very little. We work this out from your fill rate rather than copying a standard pattern.',
    customise:
      'Loop type\nFabric grade and safe working load\nVent panel size and position\nCoated or uncoated fabric\nSpout arrangement\nLiner fitment\nPrinting',
    related: ['net-baffle-jumbo-bag', 'multilayer-plastic-liner', 'pe-box-type-liner'],
    seo_title: 'Vented FIBC Bulk Bags, Single and Double Loop | GI PackTech',
    seo_description:
      'FIBC bags with air releasing vent panels for faster filling and better shape retention. Fabric grade, safe working load and spout arrangement to your specification.',
  },
  {
    category: 'fibc-and-jumbo-bags',
    code: '2.2',
    slug: 'conductive-type-c-jumbo-bag',
    name: 'Conductive Type C Jumbo Bag',
    tagline: 'Groundable FIBC for a controlled filling station',
    problem_headline: 'Type C or Type D? Getting that answer wrong is a safety gap, not a purchase error.',
    problem_body:
      'Type C bags only work if they are grounded. Where a reliable grounding connection cannot be guaranteed at every point in your process, a Type D bag is the safer choice.\n\nIf you already know you need static control, the real question is which type suits your site. We will answer that honestly, including telling you when Type C is the wrong choice.',
    description:
      'A Type C, or groundable, FIBC is woven with conductive threads running through the fabric and joined to each other. When the bag is properly connected to earth during filling and discharge, the static charge created by the flow of product is carried away safely.',
    features:
      'Conductive threads joined together throughout the fabric\nSafe handling of flammable powders and combustible dusts\nSuitable for flammable vapour and dust atmospheres when grounded\nGrounding tab clearly marked',
    materials: 'Woven polypropylene with a conductive thread grid.',
    sizes: 'Made to your safe working load and fill volume.',
    applications:
      'Flammable powders, combustible dusts, and chemicals handled where solvent vapour or dust is present.',
    where_used:
      'Chemical and pharmaceutical plants with a fixed, well-managed filling station where the earthing procedure is followed every time.',
    difference_body:
      'We advise on the choice rather than pushing whichever bag we would rather sell. Where a process cannot guarantee grounding at every transfer, we recommend Type D even though it changes the order. That advice is why customers come back to us.',
    customise:
      'Fabric grade and safe working load\nLoop arrangement\nGrounding tab position and type\nLiner fitment\nPrinting',
    related: ['conductive-type-d-jumbo-bag', 'conductive-liner', 'conductive-aluminium-liner'],
    seo_title: 'Conductive Type C Groundable Jumbo Bag FIBC | GI PackTech',
    seo_description:
      'Type C groundable FIBC woven with a conductive thread grid for flammable powders and combustible dusts. Advice on Type C versus Type D for your site.',
  },
  {
    category: 'fibc-and-jumbo-bags',
    code: '2.3',
    slug: 'conductive-type-d-jumbo-bag',
    name: 'Conductive Type D Jumbo Bag',
    tagline: 'Antistatic protection with no earthing step to forget',
    problem_headline: 'Can you guarantee every person who handles this bag, anywhere, will earth it correctly every time?',
    problem_body:
      'Your risk is not in your own plant. It is downstream. Once the bag leaves, nobody can promise the earthing step will be followed.\n\nFor exporters this is the difference between a controlled risk and an uncontrolled one. Type D removes the dependence on the operator completely, because there is no earthing step that can be forgotten.',
    description:
      'A Type D antistatic FIBC carries static charge away without any grounding connection at all. The fabric is engineered to stop the kind of sparking that causes ignition.\n\nType D is the better choice where bags are handled by more than one party, at sites you do not control, or in processes where a grounding point cannot be guaranteed at every transfer.',
    features:
      'No grounding connection needed in use\nRemoves operator dependence and the risk of a missed earthing step\nSuitable for flammable and combustible atmospheres\nMade from antistatic fabric to specification',
    materials: 'Antistatic woven polypropylene fabric.',
    sizes: 'Made to your safe working load and fill volume.',
    applications: 'Flammable powders, solvent-rich environments, and multi-site or export handling chains.',
    where_used:
      'Exporters, contract manufacturers, and any operation whose bags will be opened at a site they do not control.',
    difference_body:
      'Our position is that operator-independent safety is worth paying for. We would rather quote Type D and explain the reason than supply a Type C bag whose protection depends on a step nobody can supervise once the bag has left your gate.',
    customise:
      'Fabric grade and safe working load\nLoop arrangement\nLiner fitment\nDischarge arrangement\nPrinting',
    related: ['conductive-type-c-jumbo-bag', 'conductive-liner', 'conductive-round-drum-liner'],
    seo_title: 'Conductive Type D Antistatic Jumbo Bag FIBC | GI PackTech',
    seo_description:
      'Type D antistatic FIBC needing no grounding connection. Removes operator dependence for flammable powders and export handling chains where earthing cannot be guaranteed.',
  },
  {
    category: 'fibc-and-jumbo-bags',
    code: '2.4',
    slug: 'net-baffle-jumbo-bag',
    name: 'Net Baffle Jumbo Bag',
    tagline: 'Costs more per piece and less per tonne delivered',
    problem_headline: 'A round bag wastes the corners of every container. You are paying to ship air.',
    problem_body:
      'A standard FIBC swells into a round shape when it is filled, which wastes pallet space and container volume.\n\nThe baffle bag costs more per piece and less per tonne delivered, and the second number is the one that matters. If freight is a large part of your delivered cost, this is the easiest saving in the catalogue to prove with numbers.',
    description:
      'A net baffle jumbo bag has net baffles stitched into all four corners inside, and these hold the bag in a square shape as it fills.\n\nThe bag stands upright, stacks square, and uses the available pallet and container space properly. In practice this means more product in every container and a real drop in freight cost per tonne.',
    features:
      'Internal net baffles hold a square shape with no bulging\nBetter use of the pallet footprint and the container\nMore stable stacking and a safer warehouse\nNet construction lets product flow between the compartments\nAvailable with vented fabric',
    materials: 'Woven polypropylene with net baffle inserts.',
    sizes: 'Made to your pallet footprint and container plan.',
    applications:
      'Fertilisers, chemicals, minerals, food ingredients, and any export shipment where container fill matters.',
    where_used:
      'Exporters shipping in containers, and warehouses that are short of floor space. It is strongest where freight is a large part of your delivered cost.',
    difference_body:
      'We work out the baffle arrangement from your container plan and product density, so the shape gain is real for your load. A baffle bag designed for the wrong density does not hold its shape when filled.\n\nSend us your load plan and we will work out bags per container before and after.',
    customise:
      'Baffle type and position\nFabric grade and safe working load\nVented fabric\nLiner fitment\nLoop arrangement\nPrinting',
    related: ['baffle-and-gambo-liner', 'fibc-bag-with-air-releasing-vent', 'dunnage-air-bag'],
    seo_title: 'Net Baffle Jumbo Bag for Container Efficiency | GI PackTech',
    seo_description:
      'Net baffle FIBC bags that hold a square shape when filled, improving pallet footprint and container fill. Baffle arrangement worked out from your load plan.',
  },

  // ---------------------------------------------------------------- 3. Bulk bag liners
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.1',
    slug: 'multilayer-plastic-liner',
    name: 'Multilayer Plastic Liner for Non-Hazardous Products',
    tagline: 'More strength from less material',
    problem_headline: 'You are living with bulging, wasted volume and the odd split, and calling it normal.',
    problem_body:
      'Most operations are using a single-layer liner because nobody offered them anything else. A multilayer liner removes all three problems.\n\nA well-designed multilayer film can be thinner than the single-layer film it replaces and still be stronger, which brings the cost per liner down rather than up.',
    description:
      'A multilayer co-extruded liner for non-hazardous products carried in bulk containers. The multilayer construction gives strength under the weight of the load without the bulging and distortion that a single-layer film shows when it is filled.\n\nThe liner holds the shape it is meant to hold, so the container behind it stacks and travels predictably and the full rated volume can actually be used.',
    features:
      'Non-bulging strength under load\nSturdy in transit and during handling\nMakes full use of the container volume\nMade to the container\'s internal dimensions\nFitting and discharge arrangements to specification',
    materials: 'Multilayer co-extruded polyethylene film.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications: 'Non-hazardous products, food-grade products, water-based products, powder chemicals.',
    where_used:
      'The everyday workhorse across food ingredients, plastics, minerals and general chemicals. This is the highest volume product in the section.',
    difference_body:
      'Our co-extrusion work is aimed at getting more strength from less material. Show us the liner you are using now and we will tell you whether a thinner multilayer structure would outperform it.',
    customise:
      'Layer structure\nFilm thickness\nDimensions\nFitment type\nDischarge arrangement\nPrinting',
    related: ['pe-box-type-liner', 'evoh-barrier-liner', 'baffle-and-gambo-liner'],
    seo_title: 'Multilayer Co-Extruded FIBC Liner for Bulk Bags | GI PackTech',
    seo_description:
      'Multilayer co-extruded polyethylene liners with non-bulging strength for non-hazardous, food-grade and powder products. Made to your container dimensions.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.2',
    slug: 'pvc-bulk-bag-liner',
    name: 'PVC Bulk Bag Liner',
    tagline: 'Specified on compatibility, not on price',
    problem_headline: 'If the film is wrong, the liner fails and the product is lost or contaminated.',
    problem_body:
      'Some product groups attack polyethylene. If that is what you are handling, you need a supplier who will read the data sheet rather than one who will quote in five minutes.',
    description:
      'PVC liners are specified where flexibility, clarity and resistance to particular chemical groups are needed. They are used for hazardous products where the material inside is only compatible with PVC and nothing else will hold it safely.\n\nThe material stays soft across a wide temperature range and suits applications where the contents need to be seen, or where the liner has to shape itself to an irregular container.',
    features:
      'Flexible across a wide temperature range\nClear or pigmented as required\nGood chemical resistance for the specified product groups\nShapes itself to irregular container profiles\nMade to any bag or container dimension',
    materials: 'PVC film in the thickness you specify.',
    sizes: 'Made to any bag or container dimension.',
    applications:
      'Hazardous chemicals, specialty liquids, and industrial products where the contents need to be visible.',
    where_used:
      'Chemical plants with product groups that attack polyethylene, and operations that need to see the contents without opening the bag.',
    difference_body:
      'Compatibility is checked against your product data before anything is quoted. We turn down work where PVC is not the right answer, and we say so. That is why chemical customers come back.',
    customise: 'Thickness\nClear or pigmented\nDimensions\nFitment\nDischarge arrangement',
    related: ['pvc-round-drum-liner', 'multilayer-plastic-liner', 'conductive-liner'],
    seo_title: 'PVC Bulk Bag Liner for FIBC | GI PackTech',
    seo_description:
      'Clear or pigmented PVC FIBC liners for chemical groups that attack polyethylene. Compatibility checked against your product data sheet before quotation.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.3',
    slug: 'evoh-barrier-liner',
    name: 'EVOH Barrier Liner',
    tagline: 'Oxygen barrier with the handling behaviour of PE',
    featured: 1,
    problem_headline: 'Colour drifts. Aroma fades. A batch is downgraded. Very few people connect that back to the liner.',
    problem_body:
      'The loss shows up as a quality complaint, not as a packaging complaint. Products that oxidise, lose their aroma, change colour or break down in the presence of oxygen need a barrier that polyethylene on its own cannot give.\n\nIf your quality team is seeing shelf life complaints they cannot explain, oxygen coming through the liner is worth ruling out first.',
    description:
      'EVOH has an excellent barrier property against oxygen and the outside atmosphere. It is used as the barrier layer where oxygen getting in is the controlling problem.\n\nThe EVOH layer is co-extruded between polymer layers, so it gives an oxygen barrier while keeping the sealing behaviour and flexibility of an ordinary PE liner.',
    features:
      'High oxygen barrier performance\nProtects aroma, colour and product stability\nExtends usable shelf life in bulk storage\nKeeps the sealing and handling behaviour of PE\nAvailable in bulk bag, box type and baffle constructions',
    materials: 'Co-extruded EVOH barrier film with polyethylene layers.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications:
      'Food ingredients, oxygen-sensitive chemicals, resins, oils and fats, flavour and fragrance products.',
    where_used:
      'Food ingredient makers, flavour and fragrance houses, resin producers, and edible oil and fat processors.',
    difference_body:
      'We have built EVOH into box type and baffle constructions, not just plain tube liners. This means you can have oxygen protection and shape control together instead of choosing between them, which is where most suppliers stop.\n\nWe will run a side-by-side trial with you: one batch in your current liner, one in EVOH, checked at the same interval.',
    customise:
      'EVOH layer thickness\nTotal layer count\nBox type or baffle construction\nDimensions and fitment\nFood-grade material declaration',
    related: ['pe-box-type-liner', 'baffle-and-gambo-liner', 'aluminium-5-and-6-layer-liner'],
    seo_title: 'EVOH Oxygen Barrier Liner for Bulk Bags | GI PackTech',
    seo_description:
      'Co-extruded EVOH barrier liners protecting aroma, colour and shelf life for food ingredients, oils, fats and oxygen-sensitive chemicals. Box type and baffle constructions available.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.4',
    slug: 'pe-box-type-liner',
    name: 'PE Box Type Liner',
    tagline: 'Two problems solved by one change',
    featured: 1,
    problem_headline: 'Filling is slow, and expensive product is left stuck in the creases.',
    problem_body:
      'A tube liner has to be worked into shape as it fills, which is why filling is slow. And creases are exactly where product residue collects, so material you have already paid for never leaves the liner.\n\nMost operations treat both as unavoidable. They are not.',
    description:
      'A pre-formed box shaped liner that opens into a square profile inside the FIBC, instead of being a simple tube. Because the liner already holds the shape of the container, filling is faster, the bag fills square from the first load, and the full volume of the container is used.\n\nBox type liners also crease far less.',
    features:
      'Pre-formed square profile that matches the container\nFaster and more even filling\nFull volume used with no wasted corners\nLess creasing, so less product residue left behind\nAvailable in plain PE, EVOH and conductive constructions',
    materials: 'Polyethylene, multilayer film, EVOH or conductive film.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications: 'Powders, granules, food ingredients, chemicals, plastic compounds.',
    where_used:
      'High-volume powder and granule fillers, and any operation that has complained about slow filling or product left in the liner.',
    difference_body:
      'Our box type liners are made across the full material range, including EVOH and conductive films. Most suppliers offer box type only in plain PE, which forces you to give up barrier or static protection to get the shape. We do not make you choose.',
    customise:
      'Box dimensions\nFilm structure\nSpout type and position\nTop and bottom arrangement\nFitment loops\nPrinting',
    related: ['evoh-barrier-liner', 'baffle-and-gambo-liner', 'multilayer-plastic-liner'],
    seo_title: 'PE Box Type Liner for FIBC and Bulk Bags | GI PackTech',
    seo_description:
      'Pre-formed box type liners that fill square and crease less, cutting fill time and residue. Available in plain PE, EVOH and conductive constructions.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.5',
    slug: 'baffle-and-gambo-liner',
    name: 'Baffle and Gambo Liner',
    tagline: 'Shape control and barrier performance in the same liner',
    problem_headline: 'You have been told to pick one: a baffle bag for shape, or a barrier liner for protection.',
    problem_body:
      'That trade-off is not necessary. If you are already buying baffle bags, it is worth asking what liner goes inside them today, and whether it gives you any barrier at all. Usually it does not.',
    description:
      'A baffle or gambo liner has internal baffles that stop the liner bulging as it fills, and hold the whole assembly in a square, stackable shape. It does the same job as a net baffle bag, but at liner level. This means the shape control comes together with whatever barrier or static properties the liner material provides.\n\nIt is available in EVOH, multilayer film and conductive materials.',
    features:
      'Internal baffles hold a square shape with no bulging\nAvailable in EVOH, multilayer and conductive materials\nBetter use of the pallet and the container\nMore stable stacking\nCombines shape control with barrier or static performance',
    materials: 'EVOH, multilayer co-extruded films, conductive film.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications: 'Powders, granules, chemicals, food ingredients, export bulk shipments.',
    where_used:
      'Exporters who need both container efficiency and product protection, especially in food ingredients and specialty chemicals.',
    difference_body:
      'Building baffles into barrier and conductive films is difficult, because every baffle joint is a potential weak point in the barrier. Solving that is what makes this product ours rather than a commodity.',
    customise:
      'Baffle arrangement\nFilm structure\nDimensions\nFitment\nSpout arrangement\nDischarge type',
    related: ['net-baffle-jumbo-bag', 'evoh-barrier-liner', 'pe-box-type-liner'],
    seo_title: 'Baffle and Gambo Liner for FIBC | GI PackTech',
    seo_description:
      'Baffle liners in EVOH, multilayer and conductive films that hold a square shape while keeping barrier and static performance. No trade-off between shape and protection.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.6',
    slug: 'conductive-liner',
    name: 'Conductive Liner',
    tagline: 'The liner sits between the product and the bag',
    problem_headline: 'A conductive bag with a plain liner inside it is not a safe system.',
    problem_body:
      'Many plants do not realise this. The liner sits between the product and the bag, so if it holds charge, the bag\'s protection is defeated.\n\nIf you are running conductive bags today, it is worth checking what liner is inside them. A plain PE liner is a live gap.',
    description:
      'A static-dissipative liner for use inside FIBCs and bulk containers that handle flammable powders or solvent-wetted products. Filling and discharging bulk material creates a large amount of static charge. The conductive liner gives that charge a controlled path away, instead of letting it collect on the film surface.',
    features:
      'Static-dissipative film construction\nReduces the risk of ignition in flammable atmospheres\nWorks with both Type C and Type D bag systems\nDefined grounding arrangement where it is needed',
    materials: 'Conductive polyethylene film.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications:
      'Flammable powders, solvents, combustible dusts, pharmaceutical and fine chemical processing.',
    where_used:
      'Fine chemical and pharmaceutical plants, solvent handling areas, and any classified hazardous zone.',
    difference_body:
      'We look at the bag and the liner together as one system rather than selling the liner in isolation. Where your existing bag is Type C, we check that the liner and the grounding path actually work with it.',
    customise:
      'Film resistivity\nThickness\nGrounding arrangement\nDimensions\nCombination with barrier layers',
    related: ['conductive-aluminium-liner', 'conductive-type-c-jumbo-bag', 'conductive-type-d-jumbo-bag'],
    seo_title: 'Conductive Static-Dissipative FIBC Liner | GI PackTech',
    seo_description:
      'Conductive liners for flammable powders and solvent-wetted products inside FIBCs. Works with Type C and Type D bag systems, with a defined grounding arrangement.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.7',
    slug: 'conductive-aluminium-liner',
    name: 'Conductive Aluminium Liner',
    tagline: 'One liner replaces a double-lining arrangement',
    problem_headline: 'Double lining means twice the material, twice the labour, and a fitting step that can be done wrong.',
    problem_body:
      'If your product is both flammable and moisture-sensitive, you are probably double lining today. Count the second liner, the fitting labour and the time it takes.\n\nOne liner removes all of it.',
    description:
      'Where a product needs both static protection and a high moisture or gas barrier, the two jobs are combined in a single liner. The conductive aluminium liner gives charge dissipation and aluminium barrier performance in one construction, so you avoid the cost and the handling problems of double lining.',
    features:
      'Static dissipation and aluminium barrier combined\nOne liner replaces a double-lining arrangement\nProtects moisture-sensitive flammable powders\nAvailable with a grounding arrangement',
    materials: 'Conductive film laminated with aluminium foil and polymer layers.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications:
      'Flammable hygroscopic powders, moisture-sensitive fine chemicals, pharmaceutical intermediates.',
    where_used: 'Pharmaceutical intermediates and fine chemicals that are both flammable and moisture-sensitive.',
    difference_body:
      'Combining a conductive layer with an aluminium barrier in one working structure is genuinely difficult, and it is one of the clearest examples of our development work. Very few suppliers in India can offer it.',
    customise:
      'Layer structure\nFoil thickness\nResistivity class\nGrounding arrangement\nDimensions',
    related: ['conductive-liner', 'aluminium-5-and-6-layer-liner', 'conductive-round-drum-liner'],
    seo_title: 'Conductive Aluminium Barrier Liner | GI PackTech',
    seo_description:
      'One liner combining static dissipation and aluminium barrier, replacing double lining for flammable hygroscopic powders and pharmaceutical intermediates.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.8',
    slug: 'aluminium-5-and-6-layer-liner',
    name: 'Aluminium 5-Layer and 6-Layer Liner',
    tagline: 'Every layer specified for a job we can explain',
    featured: 1,
    problem_headline: 'One rejected container can wipe out the margin on a year of shipments.',
    problem_body:
      'The risk sits at the destination, thousands of kilometres away, where you cannot inspect anything. By the time the problem is visible, the consignment has already been refused.\n\nRoute, transit time and destination climate decide how much barrier you actually need.',
    description:
      'High barrier liners built in five or six laminated layers. Each layer does a different job, covering mechanical strength, barrier, seal integrity and puncture resistance. Together they give protection that no single film can match.\n\nThe six-layer construction is used where the product is high value, the storage period is long, or the transport route exposes the shipment to long spells of heat and humidity.',
    features:
      '5-layer and 6-layer laminated constructions\nAlmost total barrier against moisture and atmospheric gases\nHigh puncture and tear resistance\nReliable heat-seal integrity with very little permeation at the seal\nSuited to long storage and long-haul export',
    materials: 'Aluminium foil laminated with polyester, nylon and polyethylene layers.',
    sizes: 'Made to your container\'s internal dimensions.',
    applications:
      'High value chemicals, catalysts, pharmaceutical intermediates, hygroscopic powders, long-haul export cargo.',
    where_used: 'Exporters of high value product on long sea routes, particularly to hot and humid destinations.',
    difference_body:
      'Layer counts are not a marketing number for us. Each layer is specified for a job, and we can explain what every layer does. We will walk your technical team through the structure, layer by layer, before you sample.',
    customise:
      '5 or 6 layers\nFoil thickness\nNylon and polyester layer choice\nSeal structure\nDimensions\nDesiccant pockets',
    related: ['aluminium-barrier-drum-liner', 'multilayer-aluminium-laminated-liner-for-powders', 'conductive-aluminium-liner'],
    seo_title: 'Aluminium 5 and 6 Layer Barrier Liner for Export | GI PackTech',
    seo_description:
      'Five and six layer aluminium laminated liners with almost total moisture and gas barrier for high value chemicals, catalysts and long-haul export cargo.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.9',
    slug: 'multilayer-aluminium-laminated-liner-for-powders',
    name: 'Multilayer Aluminium Laminated Liner for Powders',
    tagline: 'Caking is not a fact of life. It is moisture coming through the packaging.',
    problem_headline: 'Your powder cakes in storage, and everyone treats it as unavoidable.',
    problem_body:
      'It is not unavoidable. Caking is moisture coming through the packaging.\n\nWhen the same powder comes out of a barrier liner free-flowing after six months, the argument is over. We will run that six-month side-by-side trial with you.',
    description:
      'These multilayer liners are used mainly for storing extremely hygroscopic and temperature-sensitive products over long periods. They keep the product in the same condition throughout, holding both its original physical form and its chemical properties.\n\nThey are supplied for both liquid and powder duty, with the fitment, filling and discharge arrangements built to your own container and process.',
    features:
      'For extremely hygroscopic products\nFor temperature-sensitive products\nLong storage without the product breaking down\nKeeps the original physical form and chemical properties\nAvailable for both liquid and powder duty',
    materials: 'Multilayer aluminium laminate with polymer layers.',
    sizes: 'Made to your container and process.',
    applications:
      'Hygroscopic powders, temperature-sensitive chemicals, specialty liquids, long-term stored intermediates.',
    where_used:
      'Operations holding stock for long periods, seasonal producers, and anyone whose powder cakes or picks up moisture in storage.',
    difference_body:
      'The same base structure is engineered for both powder and liquid duty, which means a mixed product range can standardise on one supplier and one specification instead of managing several.',
    customise:
      'Layer structure\nDimensions\nFitment\nFilling and discharge arrangement\nDesiccant capacity',
    related: ['aluminium-5-and-6-layer-liner', 'aluminium-multilayer-liner-for-water-based-fertilisers', 'aluminium-barrier-drum-liner'],
    seo_title: 'Multilayer Aluminium Laminated Liner for Hygroscopic Powders | GI PackTech',
    seo_description:
      'Aluminium laminated liners for extremely hygroscopic and temperature-sensitive powders in long storage. Stops caking and moisture pickup. Powder and liquid duty.',
  },
  {
    category: 'bulk-bag-and-fibc-liners',
    code: '3.10',
    slug: 'aluminium-multilayer-liner-for-water-based-fertilisers',
    name: 'Aluminium Multilayer Liner for Water-Based Fertilisers',
    tagline: 'Built for the monsoon, not for a general specification',
    problem_headline: 'Fertiliser stock sits through the worst of the humidity, and caked product is sold at a discount.',
    problem_body:
      'Fertiliser is a seasonal business. Stock sits through the monsoon, and caked product is either reprocessed at a cost or sold at a discount.\n\nThe packaging is a small fraction of what that loss is worth. The time to change it is before the season, not after.',
    description:
      'A dedicated construction for water-based fertiliser products. These attack standard liner films and are very sensitive to moisture moving between the product and the air around it. The aluminium multilayer liner holds the product stable through storage and distribution, without caking, moisture pickup or loss of nutrient value.',
    features:
      'Built specifically for water-based fertiliser products\nHigh moisture barrier stops caking and moisture pickup\nChemical resistance to fertiliser formulations\nAvailable in jumbo liner and bulk formats',
    materials: 'Aluminium multilayer laminate.',
    sizes: 'Jumbo liner and bulk formats, made to your container.',
    applications: 'Water-based fertilisers, agrochemicals, soluble nutrient products.',
    where_used:
      'Water-soluble fertiliser makers, agrochemical formulators, and distributors who hold seasonal stock through a monsoon.',
    difference_body:
      'This construction was developed for this product group specifically, rather than being a general barrier liner sold into fertiliser. Water-based fertilisers behave differently from other hygroscopic powders and the film has to be matched to them.',
    customise: 'Layer structure\nDimensions\nJumbo liner or bulk format\nFitment\nPrinting',
    related: ['multilayer-aluminium-laminated-liner-for-powders', 'aluminium-5-and-6-layer-liner', 'fibc-bag-with-air-releasing-vent'],
    seo_title: 'Aluminium Liner for Water-Based Fertilisers | GI PackTech',
    seo_description:
      'Aluminium multilayer liners developed for water-soluble fertilisers. Stops caking, moisture pickup and nutrient loss through seasonal and monsoon storage.',
  },

  // ---------------------------------------------------------------- 4. Liquid
  {
    category: 'liquid-flexi-bags-and-bladder-tanks',
    code: '4.1',
    slug: 'liquid-flexi-bag',
    name: 'Liquid Flexi Bag, 1000 to 1500 Litres, with Inlet and Discharge Valves',
    tagline: 'No container to clean, track or bring back',
    featured: 1,
    problem_headline: 'Most operations have never added up the cost of the return journey and the cleaning.',
    problem_body:
      'An IBC fleet is an asset that has to be bought, tracked, cleaned, repaired and brought back empty. Each of those is a separate line in a different budget, which is why the total is rarely seen in one place.\n\nWhen it is added up, the flexi bag usually wins clearly. The argument is strongest on one-way export routes.',
    description:
      'A flexible bulk liquid container for 1000 to 1500 litre loads, supplied with inlet and discharge valves and an outer assembly that holds the bag in shape during filling, transport and discharge.\n\nThe bag is filled through the inlet valve, carried in its supporting assembly, emptied through the discharge valve, and then disposed of or recycled. There is no container to clean, track or bring back.',
    features:
      '1000 to 1500 litre capacity\nInlet and discharge valves fitted as standard\nOuter assembly supplied to hold the bag in shape\nShapes and materials made to specification\nNo container cleaning, tracking or return journey\nEfficient use of vehicle and container payload',
    materials: 'Multilayer polyethylene film. Barrier and conductive constructions available on request.',
    sizes: '1000 to 1500 litres.',
    applications:
      'Non-hazardous liquid chemicals, edible oils, water-based products, liquid food ingredients, industrial fluids.',
    where_used:
      'Liquid chemical and edible oil producers, contract fillers, and exporters shipping liquid in volume. It fits best where the delivery is one-way and the container would otherwise have to come back empty.',
    difference_body:
      'We build the outer holding assembly as part of the product rather than leaving you to find one. This is where flexi bag installations normally fail: the bag is fine but nothing holds it in shape and it is unusable in practice.',
    customise:
      'Capacity and shape\nFilm structure\nValve type and position\nOuter assembly design\nBarrier layers\nConductive construction',
    related: ['collapsible-bladder-tank', 'multilayer-plastic-liner', 'spill-containment-bund-and-drip-tray'],
    seo_title: 'Liquid Flexi Bag 1000 to 1500 Litre with Valves | GI PackTech',
    seo_description:
      'Flexible bulk liquid containers from 1000 to 1500 litres with inlet and discharge valves and a supporting outer assembly. Removes IBC cleaning, tracking and return freight.',
  },
  {
    category: 'liquid-flexi-bags-and-bladder-tanks',
    code: '4.2',
    slug: 'collapsible-bladder-tank',
    name: 'Collapsible Bladder Tank with Support Frame',
    tagline: 'Goes up in hours, comes down in hours, moves to the next site',
    problem_headline: 'A fixed tank means civil work, time and a permanent commitment on a temporary site.',
    problem_body:
      'When the project moves, the tank cannot. A bladder tank goes up in hours, comes down in hours, and travels to the next site.',
    description:
      'A heavy duty collapsible bladder tank for storing water, fuel or process liquid where a fixed tank is not practical. The bladder is made from reinforced PVC-coated fabric and is held in a knock-down support frame, so it can be set up at site, filled, emptied and folded away again.\n\nThis suits construction sites, remote projects, temporary storage during a plant shutdown, emergency water supply and fire fighting reserve. Capacity, fabric grade and frame design are all built to the site requirement.',
    features:
      'Collapsible bladder that folds flat for transport and storage\nKnock-down support frame supplied with the tank\nHeavy duty reinforced PVC-coated fabric\nFill and discharge fittings positioned to the site requirement\nMade to any capacity the site needs\nSet up and taken down without civil work or permanent installation',
    materials: 'Reinforced PVC-coated fabric. Frame in mild steel or as specified.',
    sizes: 'Made to any capacity the site needs.',
    applications:
      'Construction and infrastructure sites, remote projects, temporary process storage, emergency water supply, fire fighting reserve, agriculture.',
    where_used:
      'Infrastructure and construction contractors, mining and remote project sites, plants needing temporary storage during a shutdown, and fire safety installations.',
    difference_body:
      'We supply the bladder and the frame together as one engineered system. Bladder tanks bought as a bare bag usually fail because the support is improvised at site. Designing both together is what makes the installation work.',
    customise:
      'Capacity\nFabric grade and colour\nFrame design and material\nFitting type and position\nFold pattern for transport',
    related: ['liquid-flexi-bag', 'spill-containment-bund-and-drip-tray', 'pvc-pallet-cover-and-reusable-equipment-cover'],
    seo_title: 'Collapsible Bladder Tank with Support Frame | GI PackTech',
    seo_description:
      'Heavy duty collapsible PVC bladder tanks with knock-down steel frames for water, fuel and process liquid. No civil work. Set up and taken down in hours.',
  },

  // ---------------------------------------------------------------- 5. Machine covers
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.1',
    slug: 'aluminium-vacuum-laminate-cover',
    name: 'Aluminium Vacuum Laminate Cover',
    tagline: 'The premium product in the protective packaging range',
    badge: 'Flagship',
    featured: 1,
    problem_headline: 'The cost is not the repair. It is the delay, the travel, the penalty clause and the reputation.',
    problem_body:
      'A corroded slideway or a tracked control board is discovered at commissioning, when an engineer is already on site and your customer is already waiting.\n\nAgainst that, the cover costs almost nothing. This is not a packaging line item. It is insurance on the machine inside it.',
    description:
      'These aluminium foil and metallized laminates give total protection against atmospheric gases and moisture getting in, with very little passing through even at the heat-seal layers. That barrier is what makes them the correct choice for harsh environments.\n\nThe vacuum process keeps out water, moisture, air and dust. Vacuum packing also lowers the oxygen inside the cover, which holds back the growth of aerobic bacteria and fungi and stops volatile components evaporating.\n\nThe cover can be vacuumed and heat sealed, and the inner layer can carry VCI protection against corrosion of metal surfaces. Six-layer aluminium laminated vacuum bags with nylon and polyester are available for the most demanding jobs.',
    features:
      'Light in weight\nHigh retained value of the protected equipment\nTear resistant and durable\nTotal barrier against atmospheric gases and moisture\nVery little permeation through the heat-seal layers\nCan be vacuumed and heat sealed\nOptional VCI inner layer to protect metal from corrosion\n6-layer aluminium laminate with nylon and polyester available',
    materials:
      'Aluminium foil and metallized laminates. Nylon and polyester layers. Up to 6-layer construction. Optional VCI inner layer.',
    sizes: 'Made to the equipment\'s dimensions.',
    applications:
      'High precision capital goods, glass products of all types, electrical components and panels, machines and machined assemblies, and long sea-freight export consignments.',
    where_used:
      'Machine tool builders, precision equipment manufacturers, glass makers, and electrical equipment exporters. Any consignment going by sea to a humid destination.',
    difference_body:
      'This is the product we have invested the most development into. The six-layer aluminium laminate with nylon and polyester, the VCI inner layer, and the vacuum and heat-seal process are all our own work.\n\nThe seal is where barrier covers usually fail, and our seal specification is the reason we can make a total barrier claim honestly. Send us one machine as a trial.',
    customise:
      'Layer count up to six\nVCI inner layer\nVacuum or non-vacuum\nDesiccant capacity\nHumidity indicator\nCover shape to any machine profile\nLifting and handling reinforcement\nPrinting',
    related: ['cnc-machine-and-large-machinery-cover', 'vci-machine-cover', 'electrical-panel-packaging-cover'],
    seo_title: 'Aluminium Vacuum Laminate Machine Cover, 6 Layer VCI | GI PackTech',
    seo_description:
      'Six-layer aluminium vacuum laminate covers with optional VCI inner layer for precision capital goods, glass, panels and machines on long sea-freight routes.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.2',
    slug: 'generator-protective-cover',
    name: 'Generator Protective Cover',
    tagline: 'Protects the machine and the sale',
    featured: 1,
    problem_headline: 'A rust streak on a brand new set is an argument the dealer cannot win.',
    problem_body:
      'A generator often sits in a dealer yard or at a project site for months before it is commissioned. It arrives looking new and it has to still look new when the customer sees it.\n\nGenerator sets bring together machined metal surfaces, electrical control panels and painted enclosures, and every one of those suffers from moisture and salt air during storage and transit.',
    description:
      'The cover is made to the set\'s dimensions, seals around the base, and can be supplied with VCI treatment for exposed metal and desiccant capacity for long journeys.\n\nCovers are built for the full range of sets, from small standby units up to large silent canopy sets, including the exhaust and control panel projections.',
    features:
      'Made to the generator set dimensions, including canopy and exhaust\nSealed against moisture, dust and salt air\nVCI and desiccant options for long transit\nAvailable in vacuum laminate construction\nClear or printed film so the brand and rating stay visible\nHeavy grades available for yard storage and repeated handling',
    materials: 'Multilayer film, aluminium laminate or aluminium vacuum laminate.',
    sizes: 'Made to the generator set dimensions.',
    applications: 'Diesel and gas generator sets in storage, domestic dispatch and export.',
    where_used:
      'Generator OEMs and their dealer networks, plus rental fleets and project contractors who hold sets in yards before installation.',
    difference_body:
      'We design the cover around the canopy shape, the exhaust projection and the base, so it seals properly instead of being a loose bag thrown over the top. We have built covers for the major generator brands and know how each canopy behaves.',
    customise:
      'Cover shape to the set profile\nFilm grade and thickness\nVCI layer\nDesiccant capacity\nBase sealing method\nPrinted branding\nHandling reinforcement',
    related: ['transformer-protective-cover', 'electrical-panel-packaging-cover', 'aluminium-vacuum-laminate-cover'],
    seo_title: 'Generator Protective Covers for Dispatch and Export | GI PackTech',
    seo_description:
      'Generator set covers made to the canopy, exhaust and base profile. Sealed against moisture, dust and salt air, with VCI and desiccant options for long transit.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.3',
    slug: 'electrical-panel-packaging-cover',
    name: 'Electrical Panel Packaging Cover',
    tagline: 'Humidity control treated as the design problem',
    problem_headline: 'Panel damage is invisible until power is applied.',
    problem_body:
      'By then the panel is installed, the site is live, and replacing it means opening up finished work. The cost of the failure is many times the cost of the panel.\n\nEven light condensation on sensitive electronics, terminations and busbars causes corrosion, tracking and insulation failure.',
    description:
      'Control panels, switchgear and distribution boards hold sensitive electronics, terminations and busbars. A sealed barrier cover with controlled humidity inside protects the panel from the factory floor right through to commissioning.',
    features:
      'Sealed barrier construction for humidity control\nProtects electronics, terminations and busbars\nMade to the panel dimensions including projections\nVacuum laminate construction available\nDesiccant capacity and humidity indicator options',
    materials: 'Multilayer film, aluminium laminate, aluminium vacuum laminate.',
    sizes: 'Made to the panel dimensions including projections.',
    applications: 'Control panels, switchgear, distribution boards, drive and automation cabinets.',
    where_used:
      'Panel builders, switchgear makers, automation integrators, and EPC contractors storing panels before installation.',
    difference_body:
      'We treat humidity control inside the cover as the design problem, not just sealing. That means matching the desiccant capacity to the enclosed volume and the expected transit time, so the humidity actually stays where it should for the whole journey.\n\nThe humidity indicator option turns an invisible benefit into a visible one.',
    customise:
      'Cover dimensions\nFilm grade\nDesiccant capacity\nHumidity indicator window\nSealing method',
    related: ['aluminium-vacuum-laminate-cover', 'transformer-protective-cover', 'battery-charger-and-component-cover'],
    seo_title: 'Electrical Panel and Switchgear Packaging Cover | GI PackTech',
    seo_description:
      'Sealed barrier covers with controlled humidity for control panels, switchgear and distribution boards. Desiccant capacity matched to volume and transit time.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.4',
    slug: 'transformer-protective-cover',
    name: 'Transformer Protective Cover',
    tagline: 'Built around the bushings and radiators, where loose covers tear',
    problem_headline: 'Transformers sit outdoors for months waiting for a substation to be ready.',
    problem_body:
      'Water sitting on bushings and in radiator fins causes problems that only show up at testing, when the whole project timeline depends on that unit.\n\nA unit that fails its pre-commissioning test does not delay a delivery. It delays a substation.',
    description:
      'Transformers are heavy, awkwardly shaped, and are often stored outdoors or in unprotected yards before installation. Covers are made to the unit\'s profile, including the bushings and radiator projections, in materials chosen for the storage time and the exposure expected.',
    features:
      'Made to the transformer profile including bushings and radiators\nSuitable for long outdoor and yard storage\nHigh tear resistance for handling by crane and forklift\nWeather resistant and UV resistant material options',
    materials: 'Heavy duty multilayer film, aluminium laminate.',
    sizes: 'Made to the unit profile.',
    applications: 'Distribution and power transformers in storage, transit and site holding.',
    where_used:
      'Transformer makers, utilities, and EPC contractors holding units at substation sites before energisation.',
    difference_body:
      'The difficulty is the shape. Bushings and radiators are exactly where a loose cover tears and where water collects. We build the cover around those projections and add reinforcement where crane slings and forklift forks make contact.',
    customise:
      'Cover profile to the unit\nFilm grade and thickness\nUV grade\nReinforcement at lifting points\nVent arrangement',
    related: ['generator-protective-cover', 'electrical-panel-packaging-cover', 'woven-laminated-pallet-cover'],
    seo_title: 'Transformer Protective Covers for Yard and Site Storage | GI PackTech',
    seo_description:
      'Heavy duty transformer covers built around bushings and radiator projections, UV and weather resistant, reinforced at crane and forklift contact points.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.5',
    slug: 'battery-charger-and-component-cover',
    name: 'Battery Charger and Component Cover',
    tagline: 'Protection and identification in the same cover',
    problem_headline: 'A small item holds up a very expensive installation.',
    problem_body:
      'The main machine gets protected and the loose parts get thrown in the crate. Then commissioning stops because one instrument is corroded or one spare cannot be found.\n\nA covered and clearly marked component is found in minutes at site instead of being hunted through a crate, which matters when an engineer is standing there on paid time.',
    description:
      'Chargers, drives, instruments and loose machine components are usually the parts that arrive damaged, because they are shipped alongside the main assembly with no protection of their own. Individually sized covers keep each item sealed and identifiable through the whole journey.',
    features:
      'Individually sized to each component\nSealed against moisture and dust\nVCI option for machined and unpainted surfaces\nSupports clear identification and parts traceability\nPrinted or labelled for easy identification at site',
    materials: 'Multilayer film, aluminium laminate, VCI film.',
    sizes: 'Individually sized to each component.',
    applications: 'Battery chargers, drives, instruments, spares and loose machined components.',
    where_used: 'Machine builders shipping loose items with the main machine, and spare parts departments.',
    difference_body:
      'Combining protection with identification is the useful part here. We size to each component and print or label the cover so the part is identified without being opened.',
    customise:
      'Size to each component\nFilm type\nVCI layer\nPrinted or labelled identification\nPacking format',
    related: ['vci-machine-cover', 'cnc-machine-and-large-machinery-cover', 'aluminium-vacuum-laminate-cover'],
    seo_title: 'Battery Charger and Machine Component Covers | GI PackTech',
    seo_description:
      'Individually sized sealed covers for chargers, drives, instruments and loose machined components, with VCI options and printed identification for site handling.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.6',
    slug: 'wind-turbine-component-cover',
    name: 'Wind Turbine and Turbine Component Cover',
    tagline: 'Specified for the storage period, not for a short transit',
    problem_headline: 'Replacement lead time is measured in months. If a component is damaged in storage, the project stops.',
    problem_body:
      'These components sit in open yards for months, exposed to sun, rain and salt air. There is no quick fix when one is damaged.\n\nThe right time to specify the cover is at the project planning stage, before the components arrive.',
    description:
      'Turbine assemblies and their components are high value, take a long time to make, and are often stored at site for long periods before erection. Covers are fabricated to the component profile in heavy duty barrier materials that can take long outdoor exposure and repeated handling.',
    features:
      'Fabricated to large and irregular component profiles\nHeavy duty barrier materials for long outdoor exposure\nHigh tear and puncture resistance\nVacuum laminate construction for critical assemblies\nReinforced at lifting and support points',
    materials: 'Heavy duty multilayer film, aluminium laminate, aluminium vacuum laminate.',
    sizes: 'Any size and profile.',
    applications: 'Wind turbine components, steam and gas turbine assemblies, rotating equipment.',
    where_used:
      'Wind and power equipment makers, EPC contractors, and laydown yards holding components before erection.',
    difference_body:
      'The challenge is size and exposure duration together. We fabricate to very large and irregular profiles and specify UV and tear grades for the actual storage period rather than for a short transit.',
    customise:
      'Any size and profile\nFilm grade\nUV resistance\nReinforcement\nTie-down points\nVent arrangement',
    related: ['cnc-machine-and-large-machinery-cover', 'shrink-wrap-cover', 'aluminium-vacuum-laminate-cover'],
    seo_title: 'Wind and Gas Turbine Component Covers | GI PackTech',
    seo_description:
      'Heavy duty barrier covers fabricated to large and irregular turbine component profiles, UV and tear graded for months of outdoor laydown yard storage.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.7',
    slug: 'screw-compressor-cover',
    name: 'Screw Compressor Cover',
    tagline: 'VCI type and cover seal matched together',
    problem_headline: 'Internal corrosion is not visible from outside. The unit looks perfect, gets installed, and fails early.',
    problem_body:
      'The warranty claim comes back to the maker, who has no way to prove it happened in transit.\n\nTransit corrosion is a common hidden cause of early failures that nobody can explain.',
    description:
      'Compressor packages hold precision rotating parts, oil systems and control gear on a single skid. Moisture getting in during storage causes internal corrosion that nobody finds until commissioning. Sealed barrier covers with VCI protection keep the package in the condition it left the factory in.',
    features:
      'Made to the compressor skid dimensions\nVCI protection for internal metal surfaces\nSealed against moisture, dust and salt air\nSuitable for sea freight and long storage',
    materials: 'Multilayer film, aluminium laminate, VCI film.',
    sizes: 'Made to the compressor skid dimensions.',
    applications: 'Screw compressors, compressor packages, pump and process skids.',
    where_used: 'Compressor makers and packagers, and process equipment builders shipping skid-mounted units.',
    difference_body:
      'VCI works by releasing a vapour inside a sealed space, so the cover has to actually hold that vapour in. We match the VCI type and the cover seal together, which is what makes the protection work rather than just look right.',
    customise:
      'Cover size to the skid\nVCI type and loading\nFilm grade\nDesiccant\nSealing method',
    related: ['vci-machine-cover', 'aluminium-vacuum-laminate-cover', 'cnc-machine-and-large-machinery-cover'],
    seo_title: 'Screw Compressor and Process Skid Covers with VCI | GI PackTech',
    seo_description:
      'Sealed barrier covers with matched VCI for screw compressors, compressor packages and process skids. Prevents hidden internal transit corrosion.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.8',
    slug: 'cnc-machine-and-large-machinery-cover',
    name: 'CNC Machine and Large Machinery Cover',
    tagline: 'Every cover fabricated from the machine drawing',
    featured: 1,
    problem_headline: 'A machine tool is sold on its accuracy. A corroded slideway destroys that permanently.',
    problem_body:
      'The machine is worth a fortune, and the surface that decides its value is a few microns thick. It cannot be polished out.\n\nMachine tools have exposed slideways, ballscrews and precision ground surfaces that corrode from the lightest condensation, inside an enclosure too large for any standard packaging.',
    description:
      'Covers are made to the machine\'s own dimensions in the material and shape required, for machines of any size.\n\nThe same capability covers mechanical power presses, punching machines, industrial machinery and machine components of any shape.',
    features:
      'Made for machines of any size and shape\nProtects slideways, ballscrews and precision ground surfaces\nVCI option for exposed machined surfaces\nSuitable for export crating and sea freight\nVacuum laminate construction for high precision equipment',
    materials: 'Multilayer film, aluminium laminate, aluminium vacuum laminate, VCI film.',
    sizes: 'Any size and shape, made from the machine drawing.',
    applications:
      'CNC machines, machining centres, mechanical power presses, punching machines, industrial machinery, heavy equipment and machine components.',
    where_used:
      'Machine tool builders, importers and dealers, press makers, and heavy engineering firms shipping finished machines.',
    difference_body:
      'There is no standard size in this work at all. Every cover is fabricated from the machine drawing. Our ability to work to any size and shape, and to combine that with VCI and vacuum laminate, is the core capability of this whole section.\n\nSend a general arrangement drawing and we will quote from it.',
    customise:
      'Any size and shape\nVCI layer\nVacuum sealing\nDesiccant\nHumidity indicator\nReinforcement at contact points\nPrinted identification',
    related: ['aluminium-vacuum-laminate-cover', 'vci-machine-cover', 'battery-charger-and-component-cover'],
    seo_title: 'CNC Machine and Large Machinery Covers, Made to Drawing | GI PackTech',
    seo_description:
      'Machine covers fabricated from your machine drawing for CNC machining centres, power presses and heavy equipment. VCI and aluminium vacuum laminate constructions.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.9',
    slug: 'shrink-wrap-cover',
    name: 'Shrink Wrap Cover for Machines and Round Components',
    tagline: 'No loose folds where water can collect',
    problem_headline: 'A loose cover on a round object is worse than no cover at all.',
    problem_body:
      'It traps water in the folds and holds it against the metal. Anyone who has tried tarpaulins on coils knows exactly what this looks like when the cover comes off.',
    description:
      'A heat-shrinkable cover that is pulled down tight onto the equipment, so the film follows the shape closely instead of hanging loose. This suits large round or awkward components such as coils, reels, wheels, drums, tanks and rolled material, where a flat cover would leave folds that collect water.\n\nThe tight fit stops the film flapping in wind, keeps water from pooling in folds, and holds the load together as one unit for handling.',
    features:
      'Shrinks tight to the shape of the equipment\nNo loose folds where water can collect\nSuitable for round, cylindrical and awkward shapes\nHolds the load together as a single unit for handling\nUV resistant grades for outdoor storage\nCan be combined with VCI for metal surfaces',
    materials:
      'Heat-shrinkable polyethylene film in the required thickness. UV resistant and VCI grades available.',
    sizes: 'Made to the component profile.',
    applications:
      'Coils, reels, wheels, tanks, rolled material, large round components, and machines with irregular profiles.',
    where_used:
      'Steel and wire coil producers, cable and reel makers, tank and vessel fabricators, and anyone storing round components outdoors.',
    difference_body:
      'We work on getting the right shrink ratio and thickness for the shape, so the film pulls tight without splitting at the tight radius. Getting this wrong is the usual reason shrink covers fail in the field.',
    customise:
      'Film thickness\nShrink ratio\nUV grade\nVCI combination\nColour\nPrinted branding',
    related: ['pallet-shrink-hood', 'wind-turbine-component-cover', 'vci-machine-cover'],
    seo_title: 'Shrink Wrap Covers for Coils, Reels and Round Components | GI PackTech',
    seo_description:
      'Heat-shrinkable covers that pull tight to round and awkward shapes, leaving no folds to collect water. UV and VCI grades for outdoor storage.',
  },
  {
    category: 'machine-covers-and-protective-packaging',
    code: '5.10',
    slug: 'vci-machine-cover',
    name: 'VCI Machine Cover',
    tagline: 'Protects surfaces the film never touches',
    featured: 1,
    problem_headline: 'Oil and grease work, but every gram has to be cleaned off before the machine is used.',
    problem_body:
      'That costs labour, solvent and time, and it makes a mess of the assembly area. The degreasing step usually costs more than most people have ever added up.\n\nVCI removes that whole step.',
    description:
      'VCI stands for Vapour Corrosion Inhibitor. The film releases a corrosion-inhibiting vapour inside the sealed cover, and that vapour settles as a very thin protective layer on every metal surface inside, including surfaces the film never touches.\n\nThis matters for machines with internal bores, gear cases, threaded holes and hidden surfaces that no coating can reach. There is nothing to clean off afterwards. The part is unwrapped and used, with no degreasing step and no solvent.',
    features:
      'Protects metal surfaces the film never touches, including internal bores\nNo oil or grease to clean off before the machine is used\nProtection continues for the whole time the cover stays sealed\nCan be combined with aluminium barrier and vacuum construction\nAvailable as covers, bags, sheets and interleaving\nFormulated for ferrous or non-ferrous metals as required',
    materials: 'VCI polyethylene film, VCI paper, and VCI combined with aluminium laminate.',
    sizes: 'Covers, bags, sheets and interleaving, made to size.',
    applications:
      'Machined components, gear boxes, engine parts, bearings, tooling, dies and moulds, and spare parts in long storage.',
    where_used:
      'Machine tool builders, automotive component makers, forging and machining shops, tool rooms, and spare parts warehouses.',
    difference_body:
      'The correct VCI formulation depends on the metal, and using the wrong one does nothing at all. We match the formulation to your material, and we combine VCI with aluminium barrier and vacuum construction where the storage period is long.',
    customise:
      'VCI formulation for the metal type\nFilm thickness\nCover, bag or sheet format\nCombination with barrier layers\nPrinting',
    related: ['vci-pallet-cover', 'aluminium-vacuum-laminate-cover', 'cnc-machine-and-large-machinery-cover'],
    seo_title: 'VCI Machine Covers and Corrosion Inhibiting Film | GI PackTech',
    seo_description:
      'VCI film covers releasing a corrosion-inhibiting vapour that protects internal bores and hidden metal surfaces, with no oil to apply and nothing to degrease.',
  },

  // ---------------------------------------------------------------- 6. Pallet
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.1',
    slug: 'ldpe-pallet-cover-and-hood',
    name: 'LDPE Pallet Cover and Pallet Hood',
    tagline: 'One piece, no joins, made to your stack height',
    problem_headline: 'Stretch wrap leaves the top of the pallet open, and that is where dust and water land.',
    problem_body:
      'Most operations are using stretch wrap alone and believe the pallet is protected because it is wrapped. It is not.\n\nWalk into your despatch bay and look at the top of a wrapped pallet. Whatever is sitting on that top face got there after packing.',
    description:
      'A pre-made cover that is pulled down over a loaded pallet like a hood. It covers the top and all four sides in one piece, with no joins for water or dust to get through, and reaches down over the pallet edge.\n\nThis is the simplest and most widely used pallet protection there is. It is made to your own pallet size and stack height, so it fits properly instead of being either too tight to pull down or so loose it flaps.',
    features:
      'One-piece cover with no joins on the top or sides\nMade to your pallet size and stack height\nClear, opaque or coloured film\nAvailable in a range of thicknesses for indoor or outdoor use\nUV resistant grades for outdoor storage\nCan be printed with your branding or handling instructions',
    materials: 'LDPE film in the required thickness. UV resistant and coloured grades available.',
    sizes: 'Made to your pallet size and stack height.',
    applications: 'Warehouse storage, transport, export shipments, and outdoor and yard storage.',
    where_used: 'Almost every warehouse and despatch operation.',
    difference_body:
      'We make to your actual pallet and stack height. A standard-size hood is either a struggle to pull down or hangs loose and tears. Getting the size right is what makes this product work day after day on a real despatch line.',
    customise:
      'Pallet size and stack height\nFilm thickness\nColour\nUV grade\nGusset type\nPerforation\nPrinting',
    related: ['pallet-top-sheet-and-liner', 'pallet-shrink-hood', 'woven-laminated-pallet-cover'],
    seo_title: 'LDPE Pallet Covers and Pallet Hoods, Made to Size | GI PackTech',
    seo_description:
      'One-piece LDPE pallet hoods covering the top and all four sides with no joins, made to your pallet size and stack height. UV and printed grades available.',
  },
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.2',
    slug: 'pallet-shrink-hood',
    name: 'Pallet Shrink Hood',
    tagline: 'Makes the stack behave as one block',
    problem_headline: 'When a load collapses in transit, the whole pallet is a loss, not just the damaged carton.',
    problem_body:
      'Loads shift, lean and collapse on open transport and through multiple transfers. The percentage of pallets arriving with a leaning stack is usually higher than anyone wants to admit.',
    description:
      'A heat-shrinkable hood that is pulled over the loaded pallet and then shrunk with heat so it grips the load tightly. The result is a sealed, weather-tight unit that holds the stack together and behaves like a single solid block during handling.\n\nThis is used where the load must stay stable through rough handling, multiple transfers or open transport, and where a loose cover would flap or tear away.',
    features:
      'Shrinks tight and grips the load as a single unit\nWeather-tight seal on the top and all four sides\nHolds the stack stable during rough handling and transfers\nSuitable for open transport and outdoor storage\nUV resistant grades available\nCan be printed with branding or handling instructions',
    materials: 'Heat-shrinkable polyethylene film in the required thickness.',
    sizes: 'Made to your load size and stack height.',
    applications:
      'Export shipments, open transport, outdoor storage, building materials, and heavy or unstable stacked loads.',
    where_used:
      'Exporters, building material makers, and anyone whose pallets travel by open truck or are handled at several points on the way.',
    difference_body:
      'The film has to shrink enough to grip firmly without splitting at the corners of the load. We work out the shrink ratio and thickness against your load shape and weight instead of supplying one general grade.\n\nWe will run a trial on your worst route, where the improvement will be most visible.',
    customise: 'Load size\nFilm thickness\nShrink ratio\nUV grade\nColour\nPrinting',
    related: ['ldpe-pallet-cover-and-hood', 'shrink-wrap-cover', 'dunnage-air-bag'],
    seo_title: 'Pallet Shrink Hoods for Export and Open Transport | GI PackTech',
    seo_description:
      'Heat-shrinkable pallet hoods that grip the load as one stable block with a weather-tight seal. Shrink ratio worked out for your load shape and weight.',
  },
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.3',
    slug: 'woven-laminated-pallet-cover',
    name: 'Woven Laminated Pallet Cover',
    tagline: 'A one-time purchase that lasts for years',
    featured: 1,
    problem_headline: 'For long or repeated use, you are buying the same protection over and over.',
    problem_body:
      'A single-use film cover is thrown away every time the pallet is opened. If you pick from covered pallets, or hold stock outdoors for months, you are paying for the same protection again and again.\n\nA reusable cover turns that into a one-time purchase. The payback is usually a few months.',
    description:
      'A heavy duty cover made from woven fabric with a laminated coating. The woven base gives tear strength that plain film cannot reach, and the lamination makes it weatherproof. It is built to be fitted, removed and fitted again many times.\n\nThis is the right choice for outdoor storage, long storage periods, and for pallets that are opened and re-covered during picking.',
    features:
      'Woven base fabric with high tear and puncture strength\nLaminated coating for full weather protection\nReusable many times, so the cost per use is very low\nSuitable for long outdoor and yard storage\nUV stabilised for sustained sun exposure\nOptions for eyelets, tie-downs, velcro closures and access flaps',
    materials:
      'Woven polypropylene or polyethylene fabric with laminated coating. UV stabilised grades available.',
    sizes: 'Made to your pallet size and stack height.',
    applications:
      'Outdoor and yard storage, long-term warehouse storage, project material, and pallets opened and re-covered during picking.',
    where_used:
      'Project sites, yard storage operations, seasonal stock holding, and warehouses that pick from covered pallets.',
    difference_body:
      'We build in the practical fittings that decide whether a reusable cover actually gets reused: eyelets, tie-downs, closures and access flaps. A cover that is awkward to refit gets left off, and then it protects nothing.\n\nPrinted with your branding, it also carries your name around your own yard for years.',
    customise:
      'Pallet size and stack height\nFabric grade and colour\nUV grade\nEyelets and tie-downs\nVelcro or zip closures\nAccess flaps\nPrinted branding',
    related: ['pvc-pallet-cover-and-reusable-equipment-cover', 'ldpe-pallet-cover-and-hood', 'transformer-protective-cover'],
    seo_title: 'Woven Laminated Reusable Pallet Covers | GI PackTech',
    seo_description:
      'Heavy duty reusable woven laminated pallet covers with high tear strength, UV stabilised, with eyelets, tie-downs, closures and access flaps.',
  },
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.4',
    slug: 'pvc-pallet-cover-and-reusable-equipment-cover',
    name: 'PVC Pallet Cover and Reusable Equipment Cover',
    tagline: 'Built for daily use over years, not for one journey',
    problem_headline: 'Daily-use covers made from film tear within days and end up as litter around the plant.',
    problem_body:
      'They become an endless series of small purchases that nobody tracks but that add up to real money.\n\nA PVC cover lasts for years, looks tidy, and stops that cycle.',
    description:
      'Heavy duty reusable covers made from PVC-coated fabric, built for daily use over years rather than for a single journey. They are supplied with handles, closures and reinforced corners so they can be fitted and removed quickly, many times a day, without damage.\n\nThese are used to cover pallets, trolleys, equipment, machinery in use, stock in a yard and material at site. They can be made in any size and colour and printed with your branding, which turns a protective cover into part of a tidy, professional-looking operation.',
    features:
      'Heavy duty PVC-coated fabric built for years of repeated use\nHandles, closures and reinforced corners for quick fitting and removal\nFully waterproof and dust proof\nMade in any size, shape and colour\nPrinted branding available\nWipe clean, so it stays presentable in a working environment',
    materials: 'PVC-coated fabric in the required weight and colour.',
    sizes: 'Any size, shape and colour.',
    applications:
      'Pallet covers, trolley covers, equipment covers, in-plant machinery covers, yard stock covers, and site material covers.',
    where_used:
      'Plants with internal material movement, warehouses, hospitals and clean areas, retail distribution, and any operation where covers are fitted and removed daily.',
    difference_body:
      'We make these to any size and shape, and we design the handles and closures around how you actually use them. A cover that takes two people to fit will not be used, no matter how good the fabric is.',
    customise:
      'Any size and shape\nFabric weight\nColour\nHandle type and position\nClosure type\nReinforcement\nPrinted branding',
    related: ['woven-laminated-pallet-cover', 'collapsible-bladder-tank', 'spill-containment-bund-and-drip-tray'],
    seo_title: 'Reusable PVC Pallet and Equipment Covers | GI PackTech',
    seo_description:
      'Heavy duty PVC-coated reusable covers with handles, closures and reinforced corners for pallets, trolleys, equipment and yard stock. Any size, colour and branding.',
  },
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.5',
    slug: 'vci-pallet-cover',
    name: 'VCI Pallet Cover',
    tagline: 'A full pallet of metal parts protected in one operation',
    problem_headline: 'Wrapping parts one by one is slow. Oiling them means degreasing them later.',
    problem_body:
      'Count the minutes per pallet spent wrapping parts individually or applying oil, then multiply by pallets per day. That labour number alone usually justifies the change.\n\nThe corrosion protection comes free on top of it.',
    description:
      'A pallet cover made in VCI film, so a full pallet of metal parts is protected against corrosion in one operation instead of wrapping every part separately. The corrosion-inhibiting vapour fills the space under the cover and settles on every metal surface inside.\n\nThis is the fastest way to protect a mixed pallet of machined parts, castings, fasteners or components in storage or transit, with no oil to apply and nothing to clean off afterwards.',
    features:
      'Protects a full pallet of metal parts in one operation\nNo oil or grease to apply and nothing to clean off later\nReaches surfaces the film never touches, including internal bores\nAvailable as hoods, sheets and covers\nFormulated for ferrous or non-ferrous metals\nCan be combined with barrier film for long storage',
    materials: 'VCI polyethylene film. VCI combined with barrier layers where long storage is needed.',
    sizes: 'Made to your pallet size and stack height.',
    applications:
      'Machined components, castings, forgings, fasteners, automotive parts, spare parts, and metal stock in storage.',
    where_used:
      'Automotive component makers, forging and casting units, fastener makers, machining job shops, and spare parts warehouses.',
    difference_body:
      'The vapour has to be held under the cover to work, so the cover design and the VCI loading are worked out together against the pallet volume and the expected storage time.',
    customise:
      'Pallet size and stack height\nVCI formulation for the metal\nFilm thickness\nBarrier combination\nPrinting',
    related: ['vci-machine-cover', 'ldpe-pallet-cover-and-hood', 'battery-charger-and-component-cover'],
    seo_title: 'VCI Pallet Covers for Metal Components | GI PackTech',
    seo_description:
      'VCI pallet hoods protecting a full pallet of machined parts, castings and fasteners in one operation. No oil to apply, nothing to degrease afterwards.',
  },
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.6',
    slug: 'pallet-top-sheet-and-liner',
    name: 'Pallet Top Sheet and Pallet Liner',
    tagline: 'Closes the one gap stretch wrap always leaves',
    problem_headline: 'The top layer of cartons is dusty or water-stained and nobody can explain why.',
    problem_body:
      'The top face was never covered. Stretch wrap makes people feel the pallet is protected, but it leaves the top open.\n\nUnderneath, the bottom layer sits directly on the pallet deck, against moisture, dirt, splinters and nail heads. A surprising amount of damage starts there.',
    description:
      'The top sheet is a simple sheet laid over the top of a stacked pallet before it is stretch wrapped. It closes the one gap that stretch wrap always leaves.\n\nThe pallet liner is laid on the pallet deck under the load. It stops moisture, dirt, splinters and nail heads from the pallet itself reaching the bottom layer of goods.',
    features:
      'Top sheet closes the open top face that stretch wrap leaves\nLiner protects the bottom layer from the pallet deck itself\nVery low cost per pallet\nFits straight into an existing stretch wrapping operation\nAvailable in clear, opaque and coloured film\nSupplied flat, folded or on a roll to suit the packing line',
    materials: 'LDPE film in the required thickness. Coloured and UV grades available.',
    sizes: 'Made to your pallet footprint.',
    applications:
      'Any stretch wrapping operation, food and pharma warehouses, export shipments, and outdoor pallet storage.',
    where_used:
      'Every warehouse that stretch wraps pallets. Especially strong in food, pharma and hygiene-sensitive operations.',
    difference_body:
      'We supply in the format that fits your line, whether that is flat, folded or on a roll. A product that slows the packing line down will be dropped within a week, however cheap it is.',
    customise: 'Sheet size\nFilm thickness\nColour\nSupply format\nPerforation\nPrinting',
    related: ['ldpe-pallet-cover-and-hood', 'pallet-shrink-hood', 'vci-pallet-cover'],
    seo_title: 'Pallet Top Sheets and Pallet Liners | GI PackTech',
    seo_description:
      'LDPE pallet top sheets that close the open top face stretch wrap leaves, and pallet liners that protect the bottom layer from the deck. Flat, folded or roll supply.',
  },
  {
    category: 'pallet-covers-and-pallet-wraps',
    code: '6.7',
    slug: 'dunnage-air-bag',
    name: 'Dunnage Air Bag for Container and Truck Loads',
    tagline: 'Movement in transit is the largest cause of damage inside a sealed container',
    problem_headline: 'The container arrives locked and undamaged, and the goods inside are broken.',
    problem_body:
      'Container damage gets blamed on the shipping line, on the port, on rough handling. It is usually the void inside the container.\n\nYou paid for the goods, the freight and the packaging, and lost the lot to an empty gap that was never filled. Recovery rates on those claims are usually very low.',
    description:
      'An inflatable bag placed in the empty space between pallets, or between the load and the container wall, and then inflated. It fills the void and holds the load firmly in place, so nothing can slide, tip or knock against anything else during transport.',
    features:
      'Fills the void between loads and stops movement in transit\nInflates in seconds with a standard air line\nSpreads load pressure evenly instead of concentrating it\nAvailable in a range of sizes for different gap widths\nReusable grades and single-use grades available\nFar faster to fit than timber bracing',
    materials: 'Multi-ply paper or polyethylene outer with a polyethylene inner bladder.',
    sizes: 'A range of sizes for different gap widths.',
    applications:
      'Container shipments, truck loads, rail freight, palletised goods, drums, cartons and bagged product.',
    where_used:
      'Exporters, freight forwarders, and any operation loading containers with pallets that do not fill the full width.',
    difference_body:
      'The right bag size for the gap is what makes this work. An undersized bag does nothing and an oversized one bursts. We size against your actual load plan rather than selling one general size.\n\nSend a load plan and photographs of a loaded container and we will size it.',
    customise:
      'Bag size for the gap width\nPly strength\nValve type\nSingle-use or reusable grade\nPrinting',
    related: ['pallet-shrink-hood', 'net-baffle-jumbo-bag', 'ldpe-pallet-cover-and-hood'],
    seo_title: 'Dunnage Air Bags for Container and Truck Loads | GI PackTech',
    seo_description:
      'Inflatable dunnage bags that fill container voids and stop load movement in transit. Sized against your actual load plan, in reusable and single-use grades.',
  },

  // ---------------------------------------------------------------- 7. Hazardous
  {
    category: 'hazardous-waste-containment',
    code: '7.1',
    slug: 'asbestos-demolition-containment-chamber',
    name: 'Asbestos Demolition Containment Chamber',
    tagline: 'Built to your method statement',
    problem_headline: 'You cannot start work without a compliant enclosure, and no standard product fits your site.',
    problem_body:
      'Compliance, not price, decides this purchase. Every site is different, and the enclosure has to satisfy the method statement and the governing regulation before anyone can begin.',
    description:
      'A sealed enclosure built around an asbestos removal or demolition work area to hold fibres in and stop them escaping into the surrounding environment. The chamber is made to the dimensions and layout of the specific site, in the material grade required by the contractor\'s method statement and by the governing regulation.\n\nChambers can include airlock entries, negative pressure connections, viewing panels and waste transfer arrangements, as specified.',
    features:
      'Made to each site\'s own dimensions and layout\nMaterial grade to the method statement and the regulation\nAirlock, negative pressure and viewing panel arrangements available\nSealed construction to contain fibre release\nSupplied with your specified waste transfer arrangement',
    materials: 'Made in any material to the specification and requirements of the site.',
    sizes: 'Made to each site\'s own dimensions and layout.',
    applications:
      'Asbestos removal and demolition projects, contaminated building strip-out, licensed remediation work.',
    where_used: 'Licensed asbestos removal contractors, demolition companies, and remediation specialists.',
    difference_body:
      'We build to your own method statement rather than offering a fixed product. That means reading the documents, understanding the regulation being worked to, and fabricating to it. Very few packaging suppliers will engage at this level.',
    customise:
      'Site dimensions and layout\nMaterial grade\nAirlock arrangement\nNegative pressure connections\nViewing panels\nWaste transfer arrangement',
    related: ['nuclear-and-hazardous-waste-site-enclosure', 'spill-containment-bund-and-drip-tray', 'round-drum-liner-any-diameter'],
    seo_title: 'Asbestos Removal and Demolition Containment Chambers | GI PackTech',
    seo_description:
      'Sealed asbestos containment enclosures built to your method statement, with airlock entries, negative pressure connections, viewing panels and waste transfer arrangements.',
  },
  {
    category: 'hazardous-waste-containment',
    code: '7.2',
    slug: 'nuclear-and-hazardous-waste-site-enclosure',
    name: 'Nuclear and Hazardous Waste Site Enclosure',
    tagline: 'Built entirely to your issued engineering specification',
    problem_headline: 'You cannot buy this from a catalogue. It has to be built to your issued specification.',
    problem_body:
      'Everything is defined by your engineering documents, with full documentation and traceability. What you need is a manufacturer who will work that way and can prove it.',
    description:
      'Containment enclosures for nuclear and other hazardous waste sites, built entirely to the specification and requirements issued by the site. Material, construction, sealing method, penetration arrangements and testing are all defined by your engineering documents.\n\nRound drum liners for nuclear waste containment are supplied from the same capability, in the diameters and materials required.',
    features:
      'Built entirely to the specification issued by the site\nAny material required by the governing standard\nCustom sealing, penetration and transfer arrangements\nSupported by matching drum liners for waste containment\nDocumentation and traceability to your requirement',
    materials: 'Made in any material as specified by the site.',
    sizes: 'Built entirely to the specification issued by the site.',
    applications: 'Nuclear waste sites, hazardous waste remediation, licensed containment operations.',
    where_used: 'Nuclear sites, licensed hazardous waste operators, and specialist remediation contractors.',
    difference_body:
      'Being able to work to an issued engineering specification, with documentation and traceability, is itself the capability. This is the highest technical and regulatory barrier of anything we do.',
    customise:
      'Everything is to the site specification: material, construction, sealing, penetrations, testing and documentation.',
    related: ['asbestos-demolition-containment-chamber', 'round-drum-liner-any-diameter', 'spill-containment-bund-and-drip-tray'],
    seo_title: 'Nuclear and Hazardous Waste Site Containment Enclosures | GI PackTech',
    seo_description:
      'Containment enclosures built entirely to the site\'s issued engineering specification, with custom sealing, penetrations, testing, documentation and traceability.',
  },
  {
    category: 'hazardous-waste-containment',
    code: '7.3',
    slug: 'spill-containment-bund-and-drip-tray',
    name: 'Spill Containment Bund and Drip Tray',
    tagline: 'Walls stand on their own, so it actually gets used',
    featured: 1,
    problem_headline: 'A concrete bund is expensive, takes time, and is permanent.',
    problem_body:
      'Most environmental regulations require secondary containment wherever liquids are stored or transferred, and this is usually driven by an audit finding rather than by choice.\n\nA flexible bund satisfies the same requirement, arrives in days, and can be moved when the equipment moves.',
    description:
      'A flexible bund made from PVC-coated fabric that holds any leak or spill from drums, IBCs, machinery or vehicles parked inside it. The walls stand up on their own when the bund is placed, and the whole unit folds flat for storage and transport.\n\nThis is used under drum stores, IBCs, generators, transformers, pumps and refuelling points. It is a compliance product as much as a protection product.',
    features:
      'Holds leaks and spills from drums, IBCs, machinery and vehicles\nWalls stand up on their own with no frame needed\nFolds flat for storage and transport\nChemical resistant PVC-coated fabric\nMade to any size and holding capacity\nDrain fitting and lifting handle options',
    materials: 'Chemical resistant PVC-coated fabric in the required weight.',
    sizes: 'Made to any size and holding capacity.',
    applications:
      'Drum and IBC storage areas, generator and transformer bases, refuelling points, workshop floors, machinery bases, and temporary work sites.',
    where_used:
      'Chemical plants, fuel storage and refuelling operations, generator and transformer installations, workshops, and construction sites.',
    difference_body:
      'The walls standing without a frame is the practical difference. A bund that needs assembling gets left folded in a corner. Ours is placed and it is ready, which is what makes it actually get used.',
    customise:
      'Any size and capacity\nFabric weight and colour\nDrain fitting\nLifting handles\nFolding pattern',
    related: ['collapsible-bladder-tank', 'pvc-pallet-cover-and-reusable-equipment-cover', 'asbestos-demolition-containment-chamber'],
    seo_title: 'Flexible Spill Containment Bunds and Drip Trays | GI PackTech',
    seo_description:
      'Chemical resistant PVC spill containment bunds with self-supporting walls that fold flat for storage. Secondary containment for drums, IBCs, generators and refuelling points.',
  },
];

module.exports = { categories, products };
