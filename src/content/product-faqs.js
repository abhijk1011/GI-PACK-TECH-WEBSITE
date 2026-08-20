'use strict';

/*
 * Per-product questions.
 *
 * The site-wide FAQ answers questions about the company — ordering, lead time,
 * whether we manufacture. These answer questions about one product, and they
 * exist because that is the shape most real searches take. Nobody types
 * "flexible packaging manufacturer"; they type "when do you need a conductive
 * drum liner", and whoever has answered that question in plain words is who
 * gets quoted.
 *
 * Each entry follows the same three-part shape, and the order matters:
 *
 *   1. The QUESTION is written the way a buyer would type or say it, not the
 *      way we would title a brochure section. Retrieval matches the question,
 *      so the buyer's vocabulary belongs here — "bulk packaging requirements",
 *      "industrial grade", "which industries use".
 *
 *   2. The ANSWER opens with the answer itself, in one sentence, and stands on
 *      its own without the question or the page around it. This is the part an
 *      assistant lifts whole, so it carries the substance: what the thing is,
 *      when it applies, what governs the choice.
 *
 *   3. The LAST sentence is what GI PackTech does differently. It earns its
 *      place only because the two sentences before it were useful. A paragraph
 *      that is only positioning gets skipped by the reader and paraphrased away
 *      by the machine.
 *
 * Every claim is drawn from the product's own entry in the catalogue. Where a
 * figure is not established anywhere on the site — a micron range, a
 * resistivity class, an MVTR — the answer says what governs it and asks for the
 * specification. Inventing one for an industrial buyer who may size a liner
 * against it is not a shortcut worth taking.
 */

const productFaqs = {
  // -------------------------------------------------- round drum liners
  'drum-liner-with-integrated-dispensing-spout': [
    {
      question: 'What is a drum liner with an integrated dispensing spout used for?',
      answer:
        'It is a liner fitted inside a drum with a discharge spout welded into it, so product is drawn off through the spout rather than by opening the drum. The drum stays clean and reusable, residue is not left clinging to the wall, and the batch is not exposed to moisture and dust every time it is opened. GI PackTech makes these to the drum, in any internal diameter from 6 to 100 inches.',
    },
    {
      question: 'Can the spout be positioned to suit our existing drums and filling line?',
      answer:
        'Yes. Spout size, spout type and spout position are all specified per order, along with liner diameter, height, gusset shape, bottom shape and film structure. The liner is built to your drum rather than to a size the supplier already runs, which is what allows an existing drum fleet and filling line to be kept exactly as they are.',
    },
    {
      question: 'Is the spout seal a weak point that can leak?',
      answer:
        'The seal around the spout is the usual failure point in this kind of product, which is why GI PackTech makes it a factory-sealed joint rather than a field-fitted add-on. It is welded under controlled conditions on our own line and tested before dispatch, so the joint is not being made in a warehouse by whoever is holding the liner.',
    },
    {
      question: 'Which industries use spouted drum liners for bulk packaging requirements?',
      answer:
        'Lubricants and base oils, specialty chemicals, food-grade liquids, inks and adhesives — in practice any operation where the same drum is opened repeatedly and the product is worth more than the packaging. The heavier the reuse cycle, the more the spout pays for itself, because the drum never needs cleaning and the residue never becomes waste.',
    },
  ],

  'round-drum-liner-any-diameter': [
    {
      question: 'What sizes of round drum liner can be manufactured?',
      answer:
        'Any drum internal diameter from 6 inches to 100 inches, at any height, with the bottom shape and gusset arrangement built to the drum. That range is a plant capability rather than a catalogue claim — it comes from GI PackTech running its own lamination, extrusion, cutting and heat-sealing lines, and from tooling built up over years of one-off jobs.',
    },
    {
      question: 'Why does drum liner fit actually matter?',
      answer:
        'A liner that does not fit costs product on every batch. Too small and it is stressed at the seams; too large and it creases, trapping product in the folds that never discharges. Most buyers have simply accepted a poor fit because it is all their current supplier makes, and treat the creasing and the occasional seam failure as normal. It is not normal, it is a sizing problem.',
    },
    {
      question: 'Can I get a drum liner for a non-standard or unusual drum size?',
      answer:
        'Yes, and it is an ordinary production question rather than a special request. Very few manufacturers can quote the small diameters or the very large ones, so buyers with unusual drums are used to being turned away. Because every liner here is made to order on our own lines, a non-standard size is specified the same way a standard one is.',
    },
    {
      question: 'Who manufactures custom industrial-grade drum liners in India?',
      answer:
        'GI PackTech manufactures made-to-specification drum liners at Gundlav, Valsad, in Gujarat, and has done since 2006. The plant is ISO 9001:2015 certified and supplies across India and for export. Materials run from plain PE and multilayer co-extruded film to EVOH, aluminium laminate, conductive film and PVC, chosen against the product going inside rather than offered as a fixed range.',
    },
  ],

  'conductive-round-drum-liner': [
    {
      question: 'When do you need a conductive drum liner?',
      answer:
        'Whenever flammable solvents, alcohols or fine powders are filled or discharged. Material moving against the liner wall builds static charge, and if that charge is allowed to collect it can jump as a spark inside a headspace full of vapour. A conductive liner gives the charge a path to earth instead. One ignition event costs more than a lifetime of liner supply.',
    },
    {
      question: 'How does a conductive drum liner connect to our existing earthing procedure?',
      answer:
        'Through a grounding tab, whose type and position are specified per order so the liner fits the earthing procedure your plant already follows. The intention is that operators carry on doing exactly what they do now — the liner adapts to the procedure rather than the procedure being rewritten around the liner. Film type and resistivity class are specified alongside it.',
    },
    {
      question: 'Can one liner give both static control and a moisture barrier?',
      answer:
        'Yes. A plant needing both usually double-lines, which is slow, awkward on the filling line and more expensive per drum. GI PackTech supplies a single conductive aluminium construction that does both jobs in one liner — combining static control with barrier performance has been the specific focus of our development work on this product.',
    },
    {
      question: 'Which industries require conductive or antistatic drum liners?',
      answer:
        'Solvents, alcohol and brewery products, flammable chemicals, fine powders and pharmaceutical intermediates — anywhere a hazardous-area classification applies to the filling or discharge point. If your process safety assessment identifies an electrostatic ignition risk at the drum, the liner is part of the control measure rather than an accessory to it.',
    },
  ],

  'aluminium-barrier-drum-liner': [
    {
      question: 'What is an aluminium barrier drum liner?',
      answer:
        'A liner built from aluminium foil laminated with polyester, nylon and polyethylene layers, in 5-layer and 6-layer constructions, giving an almost total barrier against moisture, oxygen and atmospheric gases. It is used where the product inside degrades on contact with air or humidity, and where that degradation will not be discovered until the drum is opened at the destination.',
    },
    {
      question: 'When is an aluminium barrier liner worth the extra cost over multilayer PE?',
      answer:
        'When the batch is worth many times the packaging. A catalyst or pharmaceutical intermediate that picks up moisture in transit is rejected thousands of kilometres away, where nobody can inspect anything until it arrives — so the real cost is never the liner, it is the rejected batch and the freight already spent on it. Long export routes and hygroscopic products are where the arithmetic changes.',
    },
    {
      question: 'Where do barrier liners usually fail?',
      answer:
        'At the seal, not through the film. A barrier film is only as good as its weakest seal, and most barrier failures happen there. That is where GI PackTech has concentrated its development work: the 5-layer and 6-layer structures are built and sealed so the seal is not the limiting factor, rather than specifying an impressive film and joining it carelessly.',
    },
    {
      question: 'What products need aluminium barrier drum liners?',
      answer:
        'Catalysts, pharmaceutical intermediates, hygroscopic powders, specialty chemicals and moisture-sensitive additives. Layer count, foil thickness, seal structure and diameter are all specified per order, and a conductive variant or a desiccant pocket can be built in where the product needs static control or active moisture scavenging as well as a passive barrier.',
    },
  ],

  'pvc-round-drum-liner': [
    {
      question: 'When should you use a PVC drum liner instead of polyethylene?',
      answer:
        'When the product attacks polyethylene. Certain aggressive and hazardous chemical groups degrade standard films, and if your current liner is being attacked, softened or discoloured by the contents, the answer is a different material rather than a thicker version of the wrong one. This is a compatibility problem, not a price problem.',
    },
    {
      question: 'How do I know whether PVC is compatible with my chemical?',
      answer:
        'Send the product data sheet before anything is quoted. GI PackTech works material compatibility case by case against that sheet, and will say plainly if PVC is the wrong answer for your product. We would rather refuse a job than supply a film that will fail in service — a failed liner costs the customer the batch, not just the liner.',
    },
    {
      question: 'Can PVC drum liners be supplied transparent so the contents are visible?',
      answer:
        'Yes. PVC liners are supplied clear or pigmented, in the film thickness you specify, with diameter, height, bottom shape and fitment arrangement made to the drum. Clear film is normally chosen where the contents need to be visible for level checking or contamination inspection without opening the drum.',
    },
    {
      question: 'Are PVC liners suitable for hazardous chemicals?',
      answer:
        'They are used for hazardous and aggressive chemicals, specialty liquids and industrial products, but suitability is decided per product rather than by category. Two chemicals in the same hazard class can behave very differently against the same film, which is why compatibility is assessed against your data sheet before quotation rather than assumed from the classification.',
    },
  ],
};

module.exports = productFaqs;
