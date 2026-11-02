'use strict';

/*
 * The glossary.
 *
 * "What is a form-fit liner", "what does SWL mean", "what is a Type D bag" —
 * a large share of the questions buyers put to a search engine or an
 * assistant are definitions. Each entry here answers one in a sentence or
 * two that stands on its own, and links to the guide or product that goes
 * further. The page is marked up as a DefinedTermSet, which is the shape an
 * answer engine can lift and attribute.
 *
 *   term        the word as a buyer would write it
 *   also        other names for the same thing, which are what many people search
 *   definition  one or two sentences; accurate first, short second
 *   link        a page on this site that goes further (optional)
 *   link_label  the words on that link
 *
 * Definitions follow the same rule as the rest of the site: a published,
 * checkable figure is fine (a standard's threshold, a container's size); a
 * figure about GI PackTech that has not been confirmed is not.
 */

const terms = [
  {
    term: 'Aluminium foil laminate',
    also: 'alu laminate, foil liner, aluminium barrier film',
    definition:
      'A film made by laminating a layer of aluminium foil between polymer layers such as polyester, nylon and polyethylene. Intact foil is effectively impermeable to moisture, oxygen and light, so the heat seal becomes the main path for anything to get in.',
    link: '/blog/evoh-vs-aluminium-barrier-liners',
    link_label: 'EVOH vs aluminium barrier liners',
  },
  {
    term: 'Antistatic',
    also: 'static dissipative',
    definition:
      'Describes a material or construction that prevents static charge from building up to a dangerous level, usually by letting it bleed away gradually. In FIBCs, the antistatic type that needs no earth connection is Type D.',
    link: '/blog/conductive-liners-and-static-safety',
    link_label: 'Conductive and antistatic liners',
  },
  {
    term: 'Baffle bag',
    also: 'Q-bag, baffled FIBC',
    definition:
      'An FIBC with internal fabric panels or nets stitched across its corners that hold it square as it fills, so it stacks upright and uses pallet and container space more fully than a round-filling bag.',
    link: '/blog/baffle-bags-vs-round-fibc',
    link_label: 'Baffle bags vs round FIBCs',
  },
  {
    term: 'Baffle liner',
    also: 'gambo liner',
    definition:
      'A bulk bag liner with its own internal baffles, so the liner itself holds the load square. It brings shape control to barrier and conductive films that a separate baffle bag cannot.',
    link: '/products/bulk-bag-and-fibc-liners/baffle-and-gambo-liner',
    link_label: 'Baffle and gambo liner',
  },
  {
    term: 'Barrier liner',
    definition:
      'A liner that contains a layer specifically to stop oxygen, moisture or both — usually EVOH or aluminium foil — rather than relying on the slow permeation of plain polyethylene.',
    link: '/blog/evoh-vs-aluminium-barrier-liners',
    link_label: 'Choosing a barrier',
  },
  {
    term: 'Bladder tank',
    also: 'collapsible tank, pillow tank',
    definition:
      'A flexible tank of reinforced coated fabric for storing water, fuel or process liquid where a fixed tank is impractical. It is filled, emptied and folded away, and moved to the next site.',
    link: '/products/liquid-flexi-bags-and-bladder-tanks/collapsible-bladder-tank',
    link_label: 'Collapsible bladder tank',
  },
  {
    term: 'BOPP laminated sack',
    definition:
      'A woven polypropylene sack laminated with biaxially oriented polypropylene film, which gives a smooth face for high-quality multicolour printing and better moisture resistance than plain woven fabric.',
    link: '/blog/heavy-duty-sacks-25kg-and-50kg',
    link_label: 'Heavy duty sacks guide',
  },
  {
    term: 'Box type liner',
    also: 'box liner, cubic liner',
    definition:
      'A bulk bag liner pre-formed to a square profile, so it opens square inside the FIBC from the first load. It fills faster, creases less and uses the bag’s full volume.',
    link: '/products/bulk-bag-and-fibc-liners/pe-box-type-liner',
    link_label: 'PE box type liner',
  },
  {
    term: 'Breakdown voltage',
    definition:
      'The voltage at which an insulating material such as a bag fabric breaks down and lets a discharge pass through it. A Type B FIBC has a breakdown voltage below 6 kV, which prevents propagating brush discharges.',
    link: '/blog/fibc-types-a-b-c-d-explained',
    link_label: 'FIBC types explained',
  },
  {
    term: 'Brush discharge',
    definition:
      'A static discharge from a charged insulating surface, such as a plastic liner, to a nearby conductor. It can release several millijoules — enough to ignite many solvent vapours.',
    link: '/blog/conductive-liners-and-static-safety',
    link_label: 'Static safety guide',
  },
  {
    term: 'Bulkhead',
    definition:
      'In a container liner, the woven panel at the door end with pockets for steel bars fitted across the door frame. It holds the cargo back when the doors are opened at destination.',
    link: '/blog/container-liners-for-dry-bulk',
    link_label: 'Container liners for dry bulk',
  },
  {
    term: 'Caking',
    definition:
      'The fusing of a powder or granule into lumps or a solid block, caused by moisture uptake and temperature cycling. It is prevented by keeping moisture out with a barrier liner, not by a thicker plain liner.',
    link: '/blog/preventing-caking-in-hygroscopic-powders',
    link_label: 'How to stop caking',
  },
  {
    term: 'Co-extruded film',
    also: 'co-ex film, multilayer film',
    definition:
      'A film made by extruding several layers of polymer together in one pass, each layer chosen for a job — strength, sealing, barrier. It gives more performance from less material than a single-layer film.',
    link: '/materials',
    link_label: 'Material reference',
  },
  {
    term: 'Conductive liner',
    definition:
      'A drum or FIBC liner made from film with low enough electrical resistance to carry static charge to earth through a grounding connection. Used for flammable powders, solvents and alcohol.',
    link: '/products/bulk-bag-and-fibc-liners/conductive-liner',
    link_label: 'Conductive liner',
  },
  {
    term: 'Conductive aluminium liner',
    definition:
      'A liner that laminates a conductive film with aluminium foil and polymer layers, so one construction gives both static control and a near-total moisture and gas barrier, replacing double lining.',
    link: '/products/bulk-bag-and-fibc-liners/conductive-aluminium-liner',
    link_label: 'Conductive aluminium liner',
  },
  {
    term: 'Container liner',
    also: 'sea bulk liner, bulk container liner, dry bulk liner',
    definition:
      'A single large bag fitted inside a 20 or 40 foot shipping container so dry bulk travels loose instead of in sacks. It is filled through a spout and emptied by tipping the container.',
    link: '/blog/container-liners-for-dry-bulk',
    link_label: 'Container liners for dry bulk',
  },
  {
    term: 'Container rain',
    also: 'container sweat',
    definition:
      'Condensation that forms on the inside walls and roof of a shipping container when the air inside cools below its dew point, then drips onto the cargo.',
    link: '/blog/container-rain-and-cargo-sweat',
    link_label: 'Container rain and cargo sweat',
  },
  {
    term: 'Cargo sweat',
    definition:
      'Condensation that forms directly on the cargo, typically when cold goods meet warmer, more humid air — for example when a container loaded in a cold climate is opened in a warm one.',
    link: '/blog/container-rain-and-cargo-sweat',
    link_label: 'Container rain and cargo sweat',
  },
  {
    term: 'Critical relative humidity',
    also: 'CRH',
    definition:
      'The relative humidity above which a hygroscopic material starts to absorb moisture from the air. Many fertiliser salts have a critical humidity below the humidity of a monsoon or tropical port.',
    link: '/blog/preventing-caking-in-hygroscopic-powders',
    link_label: 'Preventing caking',
  },
  {
    term: 'CTU Code',
    definition:
      'The IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units — international guidance on packing and securing cargo in containers, trucks and wagons.',
    link: '/blog/dunnage-air-bags-guide',
    link_label: 'Dunnage air bags guide',
  },
  {
    term: 'Desiccant',
    definition:
      'A material that absorbs moisture, placed inside a sealed barrier pack to dry the air trapped at sealing and any that permeates in. The quantity is calculated from the enclosed volume, the barrier and the transit time.',
    link: '/blog/seaworthy-export-packing-for-machinery',
    link_label: 'Seaworthy export packing',
  },
  {
    term: 'Dew point',
    definition:
      'The temperature at which air becomes saturated and its moisture begins to condense. Inside a container, surfaces that fall below the dew point collect condensation.',
    link: '/blog/container-rain-and-cargo-sweat',
    link_label: 'Container rain',
  },
  {
    term: 'Drum liner',
    definition:
      'A flexible bag fitted inside a steel, plastic or fibre drum so the product never touches the drum wall. It keeps the product clean, lets the drum be reused and reduces residue.',
    link: '/blog/drum-liner-materials-guide',
    link_label: 'Drum liner materials compared',
  },
  {
    term: 'Dunnage air bag',
    also: 'dunnage bag, void filler bag',
    definition:
      'An inflatable bag placed in the gap between load units, or between the load and a container wall, and inflated to fill the void so the load cannot shift in transit.',
    link: '/blog/dunnage-air-bags-guide',
    link_label: 'Dunnage air bags guide',
  },
  {
    term: 'EVOH',
    also: 'ethylene vinyl alcohol',
    definition:
      'A polymer with one of the lowest oxygen transmission rates of any common packaging plastic. Because it loses barrier when wet, it is co-extruded between protective polyethylene layers.',
    link: '/products/bulk-bag-and-fibc-liners/evoh-barrier-liner',
    link_label: 'EVOH barrier liner',
  },
  {
    term: 'Extended producer responsibility',
    also: 'EPR',
    definition:
      'A policy that makes producers, importers and brand owners responsible for the packaging they place on the market through to its collection and recycling. In India it applies under the Plastic Waste Management Rules.',
    link: '/blog/sustainable-industrial-packaging',
    link_label: 'Sustainable industrial packaging',
  },
  {
    term: 'FFS film',
    also: 'form-fill-seal',
    definition:
      'Tubular polyethylene film supplied on a roll to a form-fill-seal machine, which makes the sack, fills it and seals it in one pass — common for 25 kg polymer and fertiliser sacks.',
    link: '/blog/heavy-duty-sacks-25kg-and-50kg',
    link_label: 'Heavy duty sacks guide',
  },
  {
    term: 'FIBC',
    also: 'flexible intermediate bulk container, jumbo bag, bulk bag, big bag, tonne bag',
    definition:
      'A large woven polypropylene bag with lifting loops for moving powders and granules, typically several hundred kilograms to over a tonne, by forklift or crane.',
    link: '/products/fibc-and-jumbo-bags',
    link_label: 'FIBC and jumbo bags',
  },
  {
    term: 'Flexi bag',
    also: 'liquid flexi bag',
    definition:
      'A flexible bulk liquid container — here 1,000 to 1,500 litres — filled through an inlet valve and emptied through a discharge valve, in an outer assembly that holds its shape. It needs no cleaning or return journey.',
    link: '/blog/liquid-flexi-bags-vs-ibc-vs-drums',
    link_label: 'Flexi bags vs IBCs vs drums',
  },
  {
    term: 'Flexitank',
    definition:
      'A very large single-use bag that fills a whole 20 foot container with one liquid cargo. It is a different product from an IBC-sized liquid flexi bag.',
    link: '/blog/liquid-flexi-bags-vs-ibc-vs-drums',
    link_label: 'Flexi bags vs IBCs vs drums',
  },
  {
    term: 'Form-fit liner',
    definition:
      'An FIBC liner shaped to match the inside of the bag, spouts included, instead of a simple tube. It discharges more completely and is less likely to be drawn into the discharge spout.',
    link: '/blog/fibc-liner-types-guide',
    link_label: 'FIBC liner types',
  },
  {
    term: 'Gusset',
    definition:
      'A fold set into the side or bottom of a bag or liner that lets it open out to a fuller, squarer shape. Gusset shape is one of the things made to suit the drum or container.',
    link: '/blog/how-to-measure-a-drum-for-a-liner',
    link_label: 'How to measure a drum',
  },
  {
    term: 'GSM',
    also: 'grams per square metre',
    definition:
      'The weight of a fabric per square metre, used to specify woven polypropylene for bags, sacks and container liners. It follows from the load and handling rather than being chosen first.',
    link: '/blog/heavy-duty-sacks-25kg-and-50kg',
    link_label: 'Heavy duty sacks guide',
  },
  {
    term: 'HS code',
    also: 'Harmonized System code, tariff code',
    definition:
      'The international customs classification for traded goods. Polyethylene bags and liners usually fall under 3923.21, and woven FIBCs under 6305.32, but a customs broker should confirm each item.',
    link: '/blog/sourcing-industrial-packaging-from-india',
    link_label: 'Sourcing from India',
  },
  {
    term: 'Humidity indicator',
    definition:
      'A card that changes colour with relative humidity, placed inside a sealed barrier pack and visible through a window, so the receiving engineer can confirm the air stayed dry before opening.',
    link: '/blog/covers-for-generators-transformers-and-panels',
    link_label: 'Covers for panels and generators',
  },
  {
    term: 'IBC',
    also: 'intermediate bulk container',
    definition:
      'A rigid container of about 1,000 litres — usually a plastic bottle in a steel cage on a pallet — used for liquids and reused after cleaning.',
    link: '/blog/liquid-flexi-bags-vs-ibc-vs-drums',
    link_label: 'Flexi bags vs IBCs vs drums',
  },
  {
    term: 'IEC 61340-4-4',
    definition:
      'The international standard for the electrostatic classification of FIBCs. It defines Types A, B, C and D, their test methods and guidance on where each may be used.',
    link: '/blog/fibc-types-a-b-c-d-explained',
    link_label: 'FIBC types explained',
  },
  {
    term: 'Incoterms',
    definition:
      'The International Chamber of Commerce rules, such as FOB, CIF and DAP, that define who pays for and bears the risk of each stage of an international shipment.',
    link: '/blog/sourcing-industrial-packaging-from-india',
    link_label: 'Sourcing from India',
  },
  {
    term: 'Lay-flat width',
    definition:
      'The width of a tube liner when laid flat. For a drum liner it is roughly half the drum’s internal circumference plus a small allowance.',
    link: '/blog/how-to-measure-a-drum-for-a-liner',
    link_label: 'How to measure a drum',
  },
  {
    term: 'Minimum ignition energy',
    also: 'MIE',
    definition:
      'The smallest spark energy that can ignite a dust cloud or vapour. It decides which FIBC type a powder needs: the lower the MIE, the more static protection is required.',
    link: '/blog/fibc-types-a-b-c-d-explained',
    link_label: 'FIBC types explained',
  },
  {
    term: 'Multilayer liner',
    definition:
      'A liner made from co-extruded multilayer film, which holds its shape under load without the bulging and splitting of a single-layer film.',
    link: '/products/bulk-bag-and-fibc-liners/multilayer-plastic-liner',
    link_label: 'Multilayer plastic liner',
  },
  {
    term: 'Oxygen transmission rate',
    also: 'OTR',
    definition:
      'The amount of oxygen that passes through a film over a given area and time. EVOH and aluminium foil have very low OTR; polyethylene has a high one.',
    link: '/blog/evoh-vs-aluminium-barrier-liners',
    link_label: 'Barrier liners compared',
  },
  {
    term: 'Pallet hood',
    also: 'pallet cover',
    definition:
      'A pre-made film cover pulled down over a loaded pallet, covering the top and four sides in one piece. It closes the top face that stretch wrap leaves open.',
    link: '/products/pallet-covers-and-pallet-wraps/ldpe-pallet-cover-and-hood',
    link_label: 'LDPE pallet cover and hood',
  },
  {
    term: 'Propagating brush discharge',
    definition:
      'A very energetic static discharge, in the order of joules, from a thin insulating layer charged on both sides. Type B, C and D FIBCs are designed to prevent it.',
    link: '/blog/fibc-types-a-b-c-d-explained',
    link_label: 'FIBC types explained',
  },
  {
    term: 'Reactor liner',
    also: 'vessel liner, tank liner',
    definition:
      'A flexible liner made to the internal diameter and height of an open-top reactor, process vessel or tank, so the batch never touches the wall and changeovers need far less cleaning.',
    link: '/blog/reactor-vessel-and-tank-liners',
    link_label: 'Reactor, vessel and tank liners',
  },
  {
    term: 'Safe working load',
    also: 'SWL',
    definition:
      'The maximum load an FIBC is designed to carry in normal use. It is set alongside a safety factor that defines how far beyond the SWL the bag is tested.',
    link: '/faq#fibc-safe-working-load',
    link_label: 'FAQ: safe working load',
  },
  {
    term: 'Safety factor',
    also: '5:1, 6:1',
    definition:
      'The ratio of the load an FIBC withstands in testing to its safe working load. Under ISO 21898, 5:1 is for single-trip bags and 6:1 for bags intended for multiple trips.',
    link: '/faq#fibc-safe-working-load',
    link_label: 'FAQ: safety factor',
  },
  {
    term: 'Seaworthy packing',
    also: 'export packing, sea-freight packing',
    definition:
      'Packing that protects goods through a sea voyage and the storage either side of it — for machinery, a sealed aluminium barrier with desiccant and VCI inside a crate or skid.',
    link: '/blog/seaworthy-export-packing-for-machinery',
    link_label: 'Seaworthy export packing',
  },
  {
    term: 'Shrink hood',
    definition:
      'A heat-shrinkable film hood pulled over a loaded pallet and shrunk tight with heat, so the stack is sealed and held together as one weather-tight block.',
    link: '/blog/pallet-covers-vs-stretch-wrap-vs-shrink-hoods',
    link_label: 'Pallet protection compared',
  },
  {
    term: 'Spill bund',
    also: 'spill containment bund, drip tray, secondary containment',
    definition:
      'A tray placed under drums, IBCs, machinery or vehicles that holds any leak so it cannot reach soil or drains. Flexible bunds have self-supporting walls and fold flat.',
    link: '/products/hazardous-waste-containment/spill-containment-bund-and-drip-tray',
    link_label: 'Spill containment bund',
  },
  {
    term: 'Spouted drum liner',
    also: 'drum liner with dispensing spout',
    definition:
      'A drum liner with a discharge spout welded in, so product is drawn without opening the drum. The rest of the batch stays sealed and the drum stays clean for reuse.',
    link: '/products/round-drum-liners/drum-liner-with-integrated-dispensing-spout',
    link_label: 'Drum liner with dispensing spout',
  },
  {
    term: 'Stretch wrap',
    definition:
      'Stretchable film wound around the sides of a pallet to hold the load together. It leaves the top face of the pallet open unless a top sheet or hood is added.',
    link: '/blog/pallet-covers-vs-stretch-wrap-vs-shrink-hoods',
    link_label: 'Pallet protection compared',
  },
  {
    term: 'Top sheet',
    also: 'pallet top sheet',
    definition:
      'A sheet of film laid over the top of a stacked pallet before stretch wrapping, closing the gap that stretch wrap leaves where dust and water land first.',
    link: '/products/pallet-covers-and-pallet-wraps/pallet-top-sheet-and-liner',
    link_label: 'Pallet top sheet and liner',
  },
  {
    term: 'Type A FIBC',
    definition:
      'A plain woven polypropylene bulk bag with no static protection, suitable only for non-flammable products handled where no flammable dust or vapour is present.',
    link: '/blog/fibc-types-a-b-c-d-explained',
    link_label: 'FIBC types explained',
  },
  {
    term: 'Type B FIBC',
    definition:
      'A bulk bag with a fabric breakdown voltage below 6 kV, preventing propagating brush discharges. Not for use where flammable vapour or gas is present.',
    link: '/blog/fibc-types-a-b-c-d-explained',
    link_label: 'FIBC types explained',
  },
  {
    term: 'Type C FIBC',
    also: 'conductive FIBC, groundable FIBC',
    definition:
      'A bulk bag woven with interconnected conductive threads that must be connected to earth during filling and discharge. It is safe only while it is earthed.',
    link: '/products/fibc-and-jumbo-bags/conductive-type-c-jumbo-bag',
    link_label: 'Type C jumbo bag',
  },
  {
    term: 'Type D FIBC',
    also: 'antistatic FIBC, static dissipative FIBC',
    definition:
      'A bulk bag of static-dissipative fabric that dissipates charge safely with no earth connection, so its protection does not depend on an operator connecting a clamp.',
    link: '/products/fibc-and-jumbo-bags/conductive-type-d-jumbo-bag',
    link_label: 'Type D jumbo bag',
  },
  {
    term: 'UN packaging code',
    also: 'UN FIBC code, 13H',
    definition:
      'The code marked on packaging approved for dangerous goods under the UN Recommendations. Woven plastic FIBCs are 13H1 (uncoated, unlined), 13H2 (coated), 13H3 (with liner) and 13H4 (coated and lined); 13H5 is plastic film.',
    link: '/blog/chemical-packaging-guide',
    link_label: 'Chemical packaging guide',
  },
  {
    term: 'Vacuum packing',
    also: 'vacuum barrier packing',
    definition:
      'Drawing the air out of a sealed barrier cover before the final seal, which removes most of the moisture and oxygen, pulls the cover tight and makes any leak visible.',
    link: '/products/machine-covers-and-protective-packaging/aluminium-vacuum-laminate-cover',
    link_label: 'Aluminium vacuum laminate cover',
  },
  {
    term: 'VCI',
    also: 'volatile corrosion inhibitor, vapour corrosion inhibitor',
    definition:
      'A compound released from film or paper that vaporises inside a closed enclosure and settles as a very thin protective layer on metal surfaces, preventing rust with nothing to clean off.',
    link: '/blog/what-is-vci-packaging',
    link_label: 'What is VCI packaging?',
  },
  {
    term: 'Vented FIBC',
    also: 'air release vent bag',
    definition:
      'A bulk bag fitted with vent panels that let trapped air escape during filling, so the bag fills faster and holds its intended shape.',
    link: '/products/fibc-and-jumbo-bags/fibc-bag-with-air-releasing-vent',
    link_label: 'Vented FIBC',
  },
  {
    term: 'Water vapour transmission rate',
    also: 'WVTR, MVTR',
    definition:
      'The amount of water vapour that passes through a film over a given area and time. It is what decides whether a hygroscopic product stays dry over a long storage period.',
    link: '/blog/preventing-caking-in-hygroscopic-powders',
    link_label: 'Preventing caking',
  },
  {
    term: 'Woven polypropylene',
    also: 'woven PP',
    definition:
      'Fabric woven from polypropylene tape, used for FIBCs, sacks and container liners. It gives high tear strength; coating or lamination adds moisture and dust resistance.',
    link: '/blog/heavy-duty-sacks-25kg-and-50kg',
    link_label: 'Heavy duty sacks guide',
  },
];

module.exports = { terms };
