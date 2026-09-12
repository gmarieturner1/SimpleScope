// ================= CATALOG =================
// Every catalog item has a stable id (do NOT randomize — room
// templates reference these ids directly). baseCost is the
// starting per-unit cost; each variant option's "delta" is added
// on top when that option is selected. These are internal
// estimates only — real numbers come from sub/supplier bids in
// step 2/3.

const JOB_TYPES = [
  { id: "flip", label: "Flip" },
  { id: "rental", label: "Rental repair" },
  { id: "job", label: "Client job" },
];

const UNITS = ["sq ft", "linear ft", "each", "door pack", "hour", "day", "sheet", "gallon", "lump sum"];

const CATALOG = [
  // ---- Flooring ----
  { id: "flooring", name: "Flooring", trade: "Flooring", unit: "sq ft", baseCost: 0,
    variants: [{ key: "type", label: "Type", options: [
      { value: "Tile", delta: 6.50 },
      { value: "Linoleum", delta: 3.00 },
      { value: "LVP", delta: 4.25 },
      { value: "Carpet", delta: 2.50 },
      { value: "Other", delta: 0, custom: true },
    ]}]},

  // ---- Paint & Drywall ----
  { id: "interior-paint", name: "Interior paint, walls + trim", trade: "Paint & Drywall", unit: "sq ft", baseCost: 1.75 },
  { id: "exterior-paint", name: "Exterior paint", trade: "Paint & Drywall", unit: "sq ft", baseCost: 1.60 },
  { id: "drywall-sheet", name: "Drywall sheet, hung + finished", trade: "Paint & Drywall", unit: "sheet", baseCost: 38 },

  // ---- Windows, Doors & Trim ----
  { id: "window-swap", name: "Window", trade: "Windows, Doors & Trim", unit: "each", baseCost: 425,
    variants: [
      { key: "width", label: "Width", options: [{ value: '24"', delta: -75 }, { value: '30"', delta: -40 }, { value: '36"', delta: 0 }, { value: '48"', delta: 60 }, { value: '60"', delta: 130 }, { value: '72"', delta: 200 }] },
      { key: "height", label: "Height", options: [{ value: '24"', delta: -40 }, { value: '36"', delta: 0 }, { value: '48"', delta: 40 }, { value: '60"', delta: 90 }] },
    ]},
  { id: "window-covering", name: "Window covering", trade: "Windows, Doors & Trim", unit: "each", baseCost: 80,
    variants: [
      { key: "type", label: "Type", options: [{ value: "Blinds", delta: 0 }, { value: "Curtains", delta: -20 }, { value: "Shades", delta: 10 }, { value: "Shutters", delta: 150 }, { value: "Other", delta: 0, custom: true }] },
      { key: "color", label: "Color", options: [{ value: "White", delta: 0 }, { value: "Off-white", delta: 0 }, { value: "Gray", delta: 0 }, { value: "Black", delta: 5 }, { value: "Custom", delta: 0 }] },
      { key: "width", label: "Width", options: [{ value: '24"', delta: -15 }, { value: '36"', delta: 0 }, { value: '48"', delta: 15 }, { value: '60"', delta: 30 }, { value: '72"', delta: 45 }] },
      { key: "length", label: "Length", options: [{ value: '36"', delta: -10 }, { value: '48"', delta: 0 }, { value: '64"', delta: 15 }, { value: '72"', delta: 25 }, { value: '84"', delta: 35 }] },
    ]},
  { id: "interior-door", name: "Interior door, hung", trade: "Windows, Doors & Trim", unit: "each", baseCost: 210, measure: { label: "Size (W x H)" } },
  { id: "base-molding", name: "Base molding, install", trade: "Windows, Doors & Trim", unit: "linear ft", baseCost: 2.50 },
  { id: "door-trim", name: "Door trim/casing (door pack)", trade: "Windows, Doors & Trim", unit: "door pack", baseCost: 35 },
  { id: "closet-door", name: "Closet door", trade: "Windows, Doors & Trim", unit: "each", baseCost: 150, measure: { label: "Size (W x H)" } },
  { id: "pantry-door", name: "Pantry door", trade: "Windows, Doors & Trim", unit: "each", baseCost: 150, measure: { label: "Size (W x H)" } },
  { id: "front-door", name: "Front door", trade: "Windows, Doors & Trim", unit: "each", baseCost: 850,
    variants: [
      { key: "size", label: "Size", options: [{ value: '32"', delta: 0 }, { value: '36"', delta: 60 }] },
      { key: "construction", label: "Construction", options: [{ value: "Steel", delta: 0 }, { value: "Fiberglass", delta: 180 }, { value: "Solid wood", delta: 350 }] },
    ]},
  { id: "back-door", name: "Back door", trade: "Windows, Doors & Trim", unit: "each", baseCost: 750,
    variants: [
      { key: "size", label: "Size", options: [{ value: '32"', delta: 0 }, { value: '36"', delta: 60 }] },
      { key: "construction", label: "Construction", options: [{ value: "Steel", delta: 0 }, { value: "Fiberglass", delta: 180 }, { value: "Solid wood", delta: 350 }] },
    ]},
  { id: "sliding-door", name: "Sliding door", trade: "Windows, Doors & Trim", unit: "each", baseCost: 1400,
    variants: [
      { key: "size", label: "Size", options: [{ value: '60"', delta: -300 }, { value: '72"', delta: 0 }, { value: '96"', delta: 500 }] },
      { key: "construction", label: "Construction", options: [{ value: "Vinyl", delta: 0 }, { value: "Aluminum", delta: 150 }, { value: "Wood", delta: 450 }] },
    ]},

  // ---- Door hardware (per door) ----
  { id: "hinges", name: "Hinges", trade: "Windows, Doors & Trim", unit: "each", baseCost: 8,
    variants: [{ key: "type", label: "Type", options: [{ value: "Standard", delta: 0 }, { value: "Spring", delta: 6 }] }, finishVariant()] },
  { id: "door-handle", name: "Door handle", trade: "Windows, Doors & Trim", unit: "each", baseCost: 35,
    variants: [
      { key: "shape", label: "Shape", options: [{ value: "Lever", delta: 0 }, { value: "Round knob", delta: -5 }, { value: "Straight bar", delta: 15 }] },
      finishVariant(),
      { key: "locking", label: "Locking", options: [{ value: "No (passage)", delta: 0 }, { value: "Yes (privacy/entry)", delta: 15 }] },
    ]},
  { id: "deadbolt", name: "Deadbolt", trade: "Windows, Doors & Trim", unit: "each", baseCost: 60, variants: [finishVariant()] },

  // ---- Closet & pantry shelving ----
  { id: "closet-shelving", name: "Closet shelving", trade: "Cabinetry & Countertops", unit: "linear ft", baseCost: 8,
    variants: [
      { key: "material", label: "Material", options: [{ value: "Wire", delta: 0 }, { value: "Solid", delta: 7 }] },
      { key: "rod", label: "Rod", options: [{ value: "With rod", delta: 3 }, { value: "Without rod", delta: 0 }] },
    ], measure: { label: "Measurements (L x D)" } },
  { id: "pantry-shelving", name: "Pantry shelving", trade: "Cabinetry & Countertops", unit: "linear ft", baseCost: 8,
    variants: [{ key: "material", label: "Material", options: [{ value: "Wire", delta: 0 }, { value: "Solid", delta: 7 }] }],
    measure: { label: "Measurements (L x D)" } },

  // ---- Cabinetry & Countertops ----
  { id: "countertops", name: "Countertops (stone/quartz), install", trade: "Cabinetry & Countertops", unit: "sq ft", baseCost: 55 },
  { id: "backsplash", name: "Backsplash", trade: "Cabinetry & Countertops", unit: "sq ft", baseCost: 0,
    variants: [{ key: "style", label: "Style", options: [
      { value: "Solid (slab)", delta: 12 }, { value: "Tile", delta: 18 }, { value: "Mosaic", delta: 25 }, { value: "Other", delta: 0, custom: true },
    ]}], measure: { label: "Measurements (L x H)" } },
  { id: "cabinets", name: "Cabinets, install", trade: "Cabinetry & Countertops", unit: "linear ft", baseCost: 150 },
  { id: "upper-cabinets", name: "Upper cabinets", trade: "Cabinetry & Countertops", unit: "linear ft", baseCost: 150,
    variants: [
      { key: "size", label: "Width", options: [{ value: '12"', delta: -30 }, { value: '15"', delta: -15 }, { value: '18"', delta: 0 }, { value: '24"', delta: 20 }, { value: '30"', delta: 40 }, { value: '36"', delta: 60 }] },
      { key: "door", label: "Door style", options: [{ value: "Solid door", delta: 0 }, { value: "Glass door", delta: 35 }, { value: "No door (open shelving)", delta: -40 }] },
    ]},
  { id: "lower-cabinets", name: "Lower cabinets", trade: "Cabinetry & Countertops", unit: "linear ft", baseCost: 170,
    variants: [
      { key: "size", label: "Width", options: [{ value: '12"', delta: -30 }, { value: '15"', delta: -15 }, { value: '18"', delta: 0 }, { value: '24"', delta: 20 }, { value: '30"', delta: 40 }, { value: '36"', delta: 60 }] },
      { key: "door", label: "Door style", options: [{ value: "Solid door", delta: 0 }, { value: "Glass door", delta: 35 }, { value: "No door (open shelving)", delta: -40 }] },
    ]},
  { id: "lazy-susan", name: "Lazy Susan (corner cabinet)", trade: "Cabinetry & Countertops", unit: "each", baseCost: 220 },
  { id: "pot-drawer", name: "Pot drawer", trade: "Cabinetry & Countertops", unit: "each", baseCost: 180 },
  { id: "bank-of-drawers", name: "Bank of drawers", trade: "Cabinetry & Countertops", unit: "each", baseCost: 260 },
  { id: "pullout-trash", name: "Pull-out trash/recycling cabinet", trade: "Cabinetry & Countertops", unit: "each", baseCost: 210 },
  { id: "medicine-cabinet", name: "Medicine cabinet", trade: "Cabinetry & Countertops", unit: "each", baseCost: 165,
    variants: [{ key: "size", label: "Size", options: [
      { value: '14"x18"', delta: -20 }, { value: '16"x20"', delta: 0 }, { value: '24"x30"', delta: 60 }, { value: "Custom", delta: 0, custom: true },
    ]}]},
  { id: "vanity", name: "Bathroom vanity", trade: "Cabinetry & Countertops", unit: "each", baseCost: 450,
    variants: [
      { key: "config", label: "Configuration", options: [{ value: "Single", delta: 0 }, { value: "Double", delta: 250 }] },
      { key: "size", label: "Size", options: [
        { value: '24"', delta: -100 }, { value: '30"', delta: -50 }, { value: '36"', delta: 0 },
        { value: '48"', delta: 100 }, { value: '60"', delta: 250 }, { value: '72"', delta: 400 }, { value: '84"', delta: 550 },
      ]},
    ]},

  // ---- Plumbing ----
  { id: "water-heater", name: "Water heater, installed", trade: "Plumbing", unit: "each", baseCost: 1200 },
  { id: "plumbing-fixture", name: "Plumbing fixture swap (sink/faucet)", trade: "Plumbing", unit: "each", baseCost: 165 },
  { id: "garbage-disposal", name: "Garbage disposal, installed", trade: "Plumbing", unit: "each", baseCost: 250 },
  { id: "bath-sink", name: "Bathroom sink", trade: "Plumbing", unit: "each", baseCost: 220,
    variants: [
      { key: "type", label: "Type", options: [{ value: "Pedestal", delta: 0 }, { value: "Wall-mount", delta: 60 }, { value: "Vessel/Drop-in", delta: 120 }] },
      { key: "size", label: "Size", options: [{ value: "Standard", delta: 0 }, { value: "Small (powder room)", delta: -40 }] },
      { key: "holes", label: "Faucet holes", options: [{ value: "Single hole", delta: 0 }, { value: "Three hole", delta: 20 }] },
    ]},
  { id: "faucet", name: "Faucet", trade: "Plumbing", unit: "each", baseCost: 160,
    variants: [
      { key: "style", label: "Style", options: [{ value: "Single-hole", delta: 0 }, { value: "Centerset (4\")", delta: 15 }, { value: "Widespread (8\")", delta: 45 }, { value: "Wall-mount", delta: 90 }] },
      finishVariant(),
    ]},
  { id: "kitchen-faucet", name: "Kitchen faucet", trade: "Plumbing", unit: "each", baseCost: 220,
    variants: [
      { key: "height", label: "Height", options: [{ value: "Standard", delta: 0 }, { value: "High-arc/Gooseneck", delta: 60 }] },
      { key: "style", label: "Style", options: [{ value: "Standard (no spray)", delta: 0 }, { value: "Pull-down spray", delta: 70 }, { value: "Pull-out spray", delta: 65 }] },
      finishVariant(),
    ]},
  { id: "sprayer", name: "Separate sprayer", trade: "Plumbing", unit: "each", baseCost: 45, variants: [finishVariant()] },
  { id: "kitchen-sink", name: "Kitchen sink", trade: "Plumbing", unit: "each", baseCost: 280,
    variants: [
      { key: "type", label: "Type", options: [
        { value: "Drop-in/Top-mount", delta: 0 }, { value: "Undermount", delta: 90 }, { value: "Farmhouse/Apron-front", delta: 260 }, { value: "Vessel", delta: 150 },
      ]},
      { key: "bowls", label: "Bowls", options: [{ value: "Single", delta: 0 }, { value: "Double", delta: 80 }] },
      { key: "material", label: "Material", options: [{ value: "Stainless steel", delta: 0 }, { value: "Composite granite", delta: 120 }, { value: "Fireclay", delta: 240 }, { value: "Cast iron", delta: 180 }] },
    ]},
  { id: "shower-head", name: "Shower head", trade: "Plumbing", unit: "each", baseCost: 90,
    variants: [
      { key: "style", label: "Style", options: [{ value: "Standard", delta: 0 }, { value: "Rain", delta: 60 }, { value: "Handheld", delta: 40 }, { value: "Combo (rain + handheld)", delta: 110 }] },
      finishVariant(),
    ]},
  { id: "shower-door", name: "Shower door", trade: "Plumbing", unit: "each", baseCost: 650,
    variants: [
      { key: "type", label: "Type", options: [{ value: "Sliding", delta: 0 }, { value: "Pivot/hinged", delta: 150 }, { value: "Frameless", delta: 450 }, { value: "Curtain (no door)", delta: -600 }] },
      { key: "size", label: "Size", options: [{ value: '24"', delta: -100 }, { value: '28"', delta: -50 }, { value: '30"', delta: 0 }, { value: '32"', delta: 40 }, { value: '36"', delta: 90 }] },
    ]},
  { id: "toilet", name: "Toilet", trade: "Plumbing", unit: "each", baseCost: 380,
    variants: [
      { key: "bowl", label: "Bowl shape", options: [{ value: "Round", delta: 0 }, { value: "Elongated", delta: 35 }] },
      { key: "height", label: "Height", options: [{ value: "Standard", delta: 0 }, { value: "Comfort/ADA", delta: 45 }] },
    ]},
  { id: "shower-pan", name: "Shower with pan", trade: "Plumbing", unit: "each", baseCost: 1450,
    variants: [
      { key: "drain", label: "Drain side", options: [{ value: "Left-hand", delta: 0 }, { value: "Right-hand", delta: 0 }] },
      { key: "size", label: "Size", options: [
        { value: '32"x32"', delta: -150 }, { value: '36"x36"', delta: 0 }, { value: '36"x48"', delta: 180 }, { value: '60"x32" (tub combo)', delta: 350 },
      ]},
    ]},

  // ---- Electrical: outlets (each with cover plate) ----
  { id: "outlet-standard", name: "Standard outlet (15A)", trade: "Electrical", unit: "each", baseCost: 45, variants: [coverPlateVariant()] },
  { id: "outlet-gfci", name: "GFCI outlet", trade: "Electrical", unit: "each", baseCost: 95, variants: [coverPlateVariant()] },
  { id: "outlet-usb", name: "USB outlet", trade: "Electrical", unit: "each", baseCost: 110, variants: [coverPlateVariant()] },
  { id: "outlet-220v", name: "220V outlet (dryer/range)", trade: "Electrical", unit: "each", baseCost: 165, variants: [coverPlateVariant()] },

  // ---- Electrical: switches (each with cover plate) ----
  { id: "switch-single", name: "Single-pole switch", trade: "Electrical", unit: "each", baseCost: 40, variants: [coverPlateVariant()] },
  { id: "switch-3way", name: "3-way switch", trade: "Electrical", unit: "each", baseCost: 55, variants: [coverPlateVariant()] },
  { id: "switch-double", name: "Double switch", trade: "Electrical", unit: "each", baseCost: 65, variants: [coverPlateVariant()] },
  { id: "switch-dimmer", name: "Dimmer switch", trade: "Electrical", unit: "each", baseCost: 75, variants: [coverPlateVariant()] },

  // ---- Electrical: lighting ----
  { id: "can-light", name: "Can light (recessed)", trade: "Electrical", unit: "each", baseCost: 145,
    variants: [{ key: "diameter", label: "Diameter", options: [{ value: '4"', delta: -15 }, { value: '5"', delta: 0 }, { value: '6"', delta: 15 }] }]},
  { id: "canless-light", name: "Canless recessed light", trade: "Electrical", unit: "each", baseCost: 130,
    variants: [{ key: "diameter", label: "Diameter", options: [{ value: '4"', delta: -10 }, { value: '6"', delta: 10 }] }]},
  { id: "pendant-light", name: "Pendant light", trade: "Electrical", unit: "each", baseCost: 165,
    variants: [
      { key: "length", label: "Length", options: [{ value: '12"', delta: -10 }, { value: '24"', delta: 0 }, { value: '36"', delta: 15 }, { value: '48"+', delta: 30 }] },
      { key: "diameter", label: "Diameter", options: [{ value: '6"', delta: -10 }, { value: '8"', delta: 0 }, { value: '10"', delta: 15 }, { value: '12"', delta: 30 }] },
    ]},
  { id: "chandelier", name: "Chandelier", trade: "Electrical", unit: "each", baseCost: 320,
    variants: [
      { key: "length", label: "Length", options: [{ value: '24"', delta: -30 }, { value: '36"', delta: 0 }, { value: '48"', delta: 40 }, { value: '60"', delta: 90 }] },
      { key: "diameter", label: "Diameter", options: [{ value: '18"', delta: -20 }, { value: '24"', delta: 0 }, { value: '30"', delta: 40 }, { value: '36"', delta: 90 }] },
    ]},
  { id: "flush-mount", name: "Flush mount light", trade: "Electrical", unit: "each", baseCost: 110,
    variants: [{ key: "diameter", label: "Diameter", options: [{ value: '10"', delta: -10 }, { value: '12"', delta: 0 }, { value: '14"', delta: 15 }, { value: '16"', delta: 30 }] }]},
  { id: "semi-flush-mount", name: "Semi-flush mount light", trade: "Electrical", unit: "each", baseCost: 125,
    variants: [{ key: "diameter", label: "Diameter", options: [{ value: '10"', delta: -10 }, { value: '12"', delta: 0 }, { value: '14"', delta: 15 }, { value: '16"', delta: 30 }] }]},
  { id: "exterior-light", name: "Exterior light fixture, install", trade: "Electrical", unit: "each", baseCost: 140 },
  { id: "bath-exhaust-fan", name: "Bathroom exhaust fan", trade: "Electrical", unit: "each", baseCost: 220 },
  { id: "ceiling-fan", name: "Ceiling fan", trade: "Electrical", unit: "each", baseCost: 210,
    variants: [{ key: "size", label: "Size", options: [
      { value: '36"', delta: -30 }, { value: '42"', delta: 0 }, { value: '52"', delta: 30 }, { value: '56"', delta: 60 }, { value: '60"', delta: 100 },
    ]}]},
  { id: "smoke-detector", name: "Smoke detector", trade: "Electrical", unit: "each", baseCost: 55 },
  { id: "co-detector", name: "Carbon monoxide detector", trade: "Electrical", unit: "each", baseCost: 55 },

  // ---- HVAC ----
  { id: "mini-split", name: "Mini split heat/air system, per zone", trade: "HVAC", unit: "each", baseCost: 4500 },
  { id: "window-wall-ac", name: "Window/wall AC unit", trade: "HVAC", unit: "each", baseCost: 450 },
  { id: "baseboard-heater", name: "Baseboard heater", trade: "HVAC", unit: "each", baseCost: 275 },
  { id: "central-air", name: "Central air conditioning system", trade: "HVAC", unit: "each", baseCost: 6500 },
  { id: "heat-pump", name: "Heat pump system", trade: "HVAC", unit: "each", baseCost: 7500 },
  { id: "hvac-vent-cover", name: "Vent/register cover", trade: "HVAC", unit: "each", baseCost: 25,
    variants: [
      { key: "type", label: "Type", options: [{ value: "Supply register", delta: 0 }, { value: "Return air grille", delta: 10 }, { value: "Floor register", delta: 5 }] },
      { key: "finish", label: "Finish", options: [{ value: "White", delta: 0 }, { value: "Brushed nickel", delta: 8 }, { value: "Brown", delta: 3 }] },
    ]},
  { id: "ductwork", name: "Ductwork", trade: "HVAC", unit: "linear ft", baseCost: 12 },
  { id: "thermostat", name: "Thermostat", trade: "HVAC", unit: "each", baseCost: 180 },

  // ---- Appliances ----
  { id: "range", name: "Range/oven", trade: "Appliances", unit: "each", baseCost: 900, variants: [fuelTypeVariant()] },
  { id: "fridge", name: "Refrigerator", trade: "Appliances", unit: "each", baseCost: 1200 },
  { id: "dishwasher", name: "Dishwasher", trade: "Appliances", unit: "each", baseCost: 650 },
  { id: "microwave", name: "Microwave / range hood", trade: "Appliances", unit: "each", baseCost: 350,
    variants: [
      { key: "placement", label: "Placement", options: [{ value: "Countertop", delta: -80 }, { value: "Over-the-range", delta: 0 }] },
      { key: "size", label: "Size", options: [{ value: "Standard", delta: 0 }, { value: "Large", delta: 60 }] },
    ]},
  { id: "washer", name: "Washer", trade: "Appliances", unit: "each", baseCost: 750 },
  { id: "dryer", name: "Dryer", trade: "Appliances", unit: "each", baseCost: 750, variants: [fuelTypeVariant()] },

  // ---- Fixtures & Hardware ----
  { id: "drawer-pulls", name: "Drawer pulls", trade: "Fixtures & Hardware", unit: "each", baseCost: 6,
    variants: [
      { key: "shape", label: "Shape", options: [{ value: "Bar pull", delta: 0 }, { value: "Knob", delta: -1 }, { value: "Cup pull", delta: 2 }, { value: "T-bar", delta: 3 }] },
      finishVariant(),
    ]},
  { id: "tp-holder", name: "Toilet paper holder", trade: "Fixtures & Hardware", unit: "each", baseCost: 35, variants: [finishVariant()] },
  { id: "towel-bar", name: "Towel bar", trade: "Fixtures & Hardware", unit: "each", baseCost: 45,
    variants: [
      { key: "size", label: "Size", options: [{ value: '18"', delta: 0 }, { value: '24"', delta: 10 }, { value: '30"', delta: 20 }] },
      finishVariant(),
    ]},
  { id: "mirror", name: "Mirror", trade: "Fixtures & Hardware", unit: "each", baseCost: 120,
    variants: [{ key: "size", label: "Size", options: [
      { value: '24"x30"', delta: -30 }, { value: '30"x36"', delta: 0 }, { value: '36"x30"', delta: 0 }, { value: '48"x36"', delta: 60 }, { value: "Custom", delta: 0, custom: true },
    ]}]},

  // ---- Roofing / Siding / Decking ----
  { id: "roof", name: "Roof, asphalt shingle, tear-off + install", trade: "Roofing", unit: "sq ft", baseCost: 5.50 },
  { id: "siding", name: "Siding, install", trade: "Siding & Exterior", unit: "sq ft", baseCost: 6.50 },
  { id: "stone-veneer", name: "Stone veneer, install", trade: "Siding & Exterior", unit: "sq ft", baseCost: 22 },
  { id: "fence", name: "Fence, install", trade: "Decking & Fencing", unit: "linear ft", baseCost: 35 },
  { id: "decking", name: "Porch/patio flooring", trade: "Decking & Fencing", unit: "sq ft", baseCost: 28,
    variants: [{ key: "material", label: "Material", options: [
      { value: "Pressure-treated wood", delta: 0 }, { value: "Cedar", delta: 8 }, { value: "Composite", delta: 14 }, { value: "PVC", delta: 20 },
      { value: "Pavers", delta: -8 }, { value: "Concrete", delta: -18 }, { value: "Tile", delta: -13 }, { value: "Carpet", delta: -23 },
    ]}]},

  // ---- Porch & patio ----
  { id: "porch-roof", name: "Porch roof", trade: "Roofing", unit: "sq ft", baseCost: 6.50 },
  { id: "porch-railing", name: "Porch railing", trade: "Decking & Fencing", unit: "linear ft", baseCost: 22,
    variants: [{ key: "material", label: "Material", options: [
      { value: "Wood", delta: 0 }, { value: "Vinyl", delta: 8 }, { value: "Metal", delta: 12 }, { value: "Cable", delta: 25 },
    ]}]},
  { id: "porch-columns", name: "Porch columns/posts", trade: "Decking & Fencing", unit: "each", baseCost: 180,
    variants: [{ key: "material", label: "Material", options: [
      { value: "Wood", delta: 0 }, { value: "Vinyl-wrapped", delta: 60 }, { value: "Composite", delta: 90 },
    ]}]},
  { id: "patio-surface", name: "Patio surface", trade: "Hardscape & Concrete", unit: "sq ft", baseCost: 12,
    variants: [{ key: "material", label: "Material", options: [
      { value: "Concrete", delta: 0 }, { value: "Stamped concrete", delta: 6 }, { value: "Pavers", delta: 8 }, { value: "Natural stone", delta: 15 }, { value: "Gravel", delta: -6 },
    ]}]},
  { id: "patio-cover", name: "Patio cover", trade: "Decking & Fencing", unit: "sq ft", baseCost: 18,
    variants: [{ key: "material", label: "Material", options: [
      { value: "Wood", delta: 0 }, { value: "Aluminum", delta: 6 }, { value: "Vinyl", delta: 10 },
    ]}]},

  // ---- Driveway & carport ----
  { id: "driveway", name: "Driveway", trade: "Hardscape & Concrete", unit: "sq ft", baseCost: 8,
    variants: [{ key: "material", label: "Material", options: [
      { value: "Asphalt", delta: 0 }, { value: "Concrete", delta: 3 }, { value: "Gravel", delta: -5 }, { value: "Pavers", delta: 7 },
    ]}]},
  { id: "carport", name: "Carport", trade: "Siding & Exterior", unit: "each", baseCost: 3500,
    variants: [
      { key: "config", label: "Configuration", options: [{ value: "Single", delta: 0 }, { value: "Double", delta: 1800 }] },
      { key: "material", label: "Material", options: [{ value: "Aluminum", delta: 0 }, { value: "Steel", delta: 400 }, { value: "Wood", delta: 900 }] },
    ]},

  // ---- Garage & shed (structures) ----
  { id: "garage-structure", name: "Detached garage (structure)", trade: "Siding & Exterior", unit: "each", baseCost: 12000,
    variants: [{ key: "size", label: "Size", options: [{ value: "1-car", delta: 0 }, { value: "2-car", delta: 6000 }, { value: "3-car", delta: 12000 }] }]},
  { id: "outbuilding", name: "Outbuilding", trade: "Siding & Exterior", unit: "each", baseCost: 6000,
    variants: [
      { key: "size", label: "Size", options: [{ value: "Small", delta: -2500 }, { value: "Medium", delta: 0 }, { value: "Large", delta: 5000 }, { value: "Custom", delta: 0, custom: true }] },
      { key: "material", label: "Material", options: [{ value: "Wood", delta: 0 }, { value: "Metal", delta: -1000 }, { value: "Pole building/Post-frame", delta: 1500 }] },
    ]},
  { id: "shed", name: "Shed", trade: "Siding & Exterior", unit: "each", baseCost: 1800,
    variants: [
      { key: "size", label: "Size", options: [{ value: "Small (8'x10')", delta: 0 }, { value: "Medium (10'x12')", delta: 500 }, { value: "Large (12'x16')", delta: 1100 }, { value: "Custom", delta: 0, custom: true }] },
      { key: "material", label: "Material", options: [{ value: "Wood", delta: 0 }, { value: "Metal", delta: -300 }, { value: "Resin/Vinyl", delta: -100 }] },
    ]},

  // ---- Yard & landscaping ----
  { id: "sod-grading", name: "Sod/grading", trade: "Landscaping", unit: "sq ft", baseCost: 0.85 },
  { id: "mulch-beds", name: "Mulch/landscaping beds", trade: "Landscaping", unit: "sq ft", baseCost: 3 },
  { id: "weed-control", name: "Weed control/treatment", trade: "Landscaping", unit: "lump sum", baseCost: 250,
    variants: [{ key: "type", label: "Type", options: [
      { value: "Chemical treatment", delta: 0 }, { value: "Fabric + gravel", delta: 400 }, { value: "Fabric + mulch", delta: 300 },
    ]}]},
  { id: "tree-shrub-removal", name: "Tree/shrub removal", trade: "Landscaping", unit: "each", baseCost: 350 },

  // ---- Garage doors (its own trade — usually a specialty sub) ----
  { id: "garage-door", name: "Garage door", trade: "Garage Doors", unit: "each", baseCost: 1100,
    variants: [
      { key: "config", label: "Configuration", options: [{ value: "Single", delta: 0 }, { value: "Double", delta: 650 }] },
      { key: "construction", label: "Construction", options: [{ value: "Steel", delta: 0 }, { value: "Insulated steel", delta: 250 }, { value: "Wood", delta: 500 }, { value: "Aluminum", delta: 300 }] },
    ]},
  { id: "garage-door-opener", name: "Garage door opener", trade: "Garage Doors", unit: "each", baseCost: 320 },
];

function coverPlateVariant() {
  return { key: "plate", label: "Cover plate", options: [{ value: "Standard", delta: 0 }, { value: "Decora", delta: 4 }] };
}

function fuelTypeVariant() {
  return { key: "fuel", label: "Fuel type", options: [{ value: "Gas", delta: 50 }, { value: "Electric", delta: 0 }] };
}

function finishVariant() {
  return { key: "finish", label: "Finish", options: [
    { value: "Chrome", delta: 0 }, { value: "Brushed nickel", delta: 5 }, { value: "Matte black", delta: 10 },
    { value: "Oil-rubbed bronze", delta: 10 }, { value: "Brushed gold", delta: 20 },
  ]};
}

// Labor & whole-job items — bid as a lump sum for the entire job,
// not tied to any one room.
const LABOR_ITEMS = [
  { id: "general-labor", name: "General labor", trade: "General Labor", unit: "hour", baseCost: 55 },
  { id: "electrician-hours", name: "Electrician, licensed", trade: "Electrical", unit: "hour", baseCost: 95 },
  { id: "dumpster", name: "Dumpster / haul-away", trade: "Equipment & Disposal", unit: "lump sum", baseCost: 450 },
];

// Which catalog item ids show up in each room type's checklist.
const ROOM_TYPES = [
  "Kitchen", "Bathroom", "Bedroom", "Master Bedroom", "Living / Dining", "Laundry",
  "Hallway", "Basement / Garage", "Exterior / Whole House", "Exterior Doors",
  "Front Porch / Patio", "Back Porch / Patio", "Driveway", "Carport", "Garage", "Shed", "Outbuilding", "Fence", "Yard / Landscaping", "Roof", "Other",
];

// Groups the room-type dropdown into Interior / Exterior sections.
// "Other" is left out — rendered as its own ungrouped option.
const ROOM_GROUPS = {
  "Interior": ["Kitchen", "Bathroom", "Bedroom", "Master Bedroom", "Living / Dining", "Laundry", "Hallway", "Basement / Garage"],
  "Exterior": ["Exterior / Whole House", "Exterior Doors", "Roof", "Front Porch / Patio", "Back Porch / Patio", "Driveway", "Carport", "Garage", "Shed", "Outbuilding", "Fence", "Yard / Landscaping"],
};

const ROOM_TEMPLATES = {
  "Kitchen": ["flooring", "interior-paint", "base-molding", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering", "countertops", "backsplash",
    "upper-cabinets", "lower-cabinets", "lazy-susan", "pot-drawer", "bank-of-drawers", "pullout-trash",
    "plumbing-fixture", "garbage-disposal", "kitchen-sink", "kitchen-faucet", "sprayer",
    "closet-door", "closet-shelving", "pantry-door", "pantry-shelving",
    "outlet-standard", "outlet-gfci", "outlet-usb", "outlet-220v", "switch-single", "switch-3way", "switch-double", "switch-dimmer",
    "can-light", "canless-light", "pendant-light", "flush-mount", "semi-flush-mount",
    "hvac-vent-cover", "smoke-detector", "co-detector",
    "range", "fridge", "dishwasher", "microwave", "drawer-pulls"],

  "Bathroom": ["flooring", "interior-paint", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering",
    "vanity", "countertops", "backsplash", "medicine-cabinet",
    "plumbing-fixture", "bath-sink", "faucet", "toilet", "shower-pan", "shower-head", "shower-door",
    "tp-holder", "towel-bar", "mirror", "bath-exhaust-fan", "baseboard-heater",
    "closet-door", "closet-shelving",
    "outlet-standard", "outlet-gfci", "switch-single", "switch-dimmer",
    "can-light", "flush-mount", "semi-flush-mount", "drawer-pulls",
    "hvac-vent-cover", "smoke-detector", "co-detector"],

  "Bedroom": ["flooring", "interior-paint", "base-molding", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering", "ceiling-fan",
    "closet-door", "closet-shelving",
    "outlet-standard", "switch-single", "switch-3way", "switch-dimmer", "flush-mount", "semi-flush-mount", "pendant-light",
    "window-wall-ac", "baseboard-heater", "hvac-vent-cover", "smoke-detector", "co-detector"],

  "Master Bedroom": ["flooring", "interior-paint", "base-molding", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering", "ceiling-fan",
    "closet-door", "closet-shelving",
    "outlet-standard", "switch-single", "switch-3way", "switch-dimmer", "flush-mount", "semi-flush-mount", "pendant-light",
    "window-wall-ac", "baseboard-heater", "hvac-vent-cover", "smoke-detector", "co-detector"],

  "Living / Dining": ["flooring", "interior-paint", "base-molding", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering", "ceiling-fan",
    "mini-split", "window-wall-ac", "baseboard-heater", "hvac-vent-cover",
    "closet-door", "closet-shelving",
    "outlet-standard", "outlet-gfci", "switch-single", "switch-3way", "switch-dimmer",
    "can-light", "pendant-light", "chandelier", "flush-mount", "semi-flush-mount",
    "smoke-detector", "co-detector"],

  "Laundry": ["flooring", "interior-paint", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering",
    "water-heater", "plumbing-fixture", "garbage-disposal", "cabinets", "washer", "dryer",
    "closet-door", "closet-shelving",
    "outlet-standard", "outlet-220v", "switch-single", "flush-mount", "can-light",
    "hvac-vent-cover", "smoke-detector"],

  "Hallway": ["flooring", "interior-paint", "base-molding", "interior-door", "door-trim", "hinges", "door-handle",
    "closet-door", "closet-shelving",
    "outlet-standard", "switch-single", "switch-3way", "flush-mount", "semi-flush-mount", "can-light",
    "smoke-detector", "co-detector"],

  "Basement / Garage": ["interior-paint", "drywall-sheet", "interior-door", "door-trim", "hinges", "door-handle",
    "window-swap", "window-covering",
    "water-heater", "mini-split", "window-wall-ac", "baseboard-heater", "hvac-vent-cover",
    "closet-door", "closet-shelving",
    "outlet-standard", "outlet-220v", "switch-single", "flush-mount", "can-light",
    "smoke-detector", "co-detector"],

  "Exterior / Whole House": ["exterior-paint", "siding", "stone-veneer",
    "exterior-light", "roof", "central-air", "heat-pump", "ductwork", "thermostat"],

  "Exterior Doors": ["front-door", "back-door", "sliding-door", "hinges", "door-handle", "deadbolt",
    "garage-door", "garage-door-opener"],

  "Front Porch / Patio": ["decking", "porch-roof", "porch-railing", "porch-columns", "patio-surface", "patio-cover", "exterior-paint", "exterior-light"],

  "Back Porch / Patio": ["decking", "porch-roof", "porch-railing", "porch-columns", "patio-surface", "patio-cover", "exterior-paint", "exterior-light"],

  "Driveway": ["driveway"],

  "Carport": ["carport"],

  "Garage": ["garage-structure", "siding", "roof", "exterior-paint", "exterior-light", "garage-door", "garage-door-opener"],

  "Shed": ["shed", "exterior-paint", "exterior-light"],

  "Outbuilding": ["outbuilding", "siding", "roof", "exterior-paint", "exterior-light"],

  "Fence": ["fence"],

  "Yard / Landscaping": ["sod-grading", "mulch-beds", "weed-control", "tree-shrub-removal"],

  "Roof": ["roof"],
};

function itemIdsForRoom(room) {
  if (room.isLabor) return LABOR_ITEMS.map((i) => i.id);
  const type = room.type && ROOM_TEMPLATES[room.type] ? room.type : null;
  if (type) return ROOM_TEMPLATES[type];
  // Legacy rooms saved before room types existed: try matching the
  // free-text name, else fall back to showing everything.
  const guess = ROOM_TYPES.find((t) => t.toLowerCase() === (room.name || "").toLowerCase());
  if (guess && ROOM_TEMPLATES[guess]) return ROOM_TEMPLATES[guess];
  return CATALOG.map((i) => i.id);
}

function catalogItem(id) {
  return CATALOG.find((i) => i.id === id) || LABOR_ITEMS.find((i) => i.id === id);
}

function computeItemCost(item, selections, customCost) {
  if (customCost !== undefined && customCost !== null && customCost !== "") return parseFloat(customCost) || 0;
  let cost = item.baseCost || 0;
  (item.variants || []).forEach((v) => {
    const opt = v.options.find((o) => o.value === (selections || {})[v.key]);
    if (opt) cost += opt.delta;
  });
  return cost;
}

function defaultSelections(item) {
  const sel = {};
  (item.variants || []).forEach((v) => { sel[v.key] = v.options[0].value; });
  return sel;
}

const uid = () => Math.random().toString(36).slice(2, 10);

function currency(n) {
  n = parseFloat(n);
  if (Number.isNaN(n) || n === null || n === undefined) return "$0.00";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function makeLaborRoom() {
  return { id: "labor-box", name: "Labor & Whole-Job Items", isLabor: true, items: [], naItems: [], notes: "" };
}

function makeJob(name, jobType) {
  return {
    id: uid(),
    name: name || "Untitled",
    jobType,
    rooms: [makeLaborRoom()],
    bids: {},
    markupPct: 20,
    taxPct: 8.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function ensureLaborRoom(job) {
  if (!job.rooms.some((r) => r.isLabor)) job.rooms.push(makeLaborRoom());
}

// Backfills fields on rooms/items saved before multi-instance support
// existed, so old jobs keep working without a manual migration step.
function normalizeRoom(room) {
  if (!room.naItems) room.naItems = [];
  if (!room.items) room.items = [];
  // Legacy rows stored a single "isNA" flag directly on an item entry
  // instead of in room.naItems — migrate those out.
  room.items = room.items.filter((it) => {
    if (it.isNA) {
      if (!room.naItems.includes(it.itemId)) room.naItems.push(it.itemId);
      return false;
    }
    return true;
  });
  room.items.forEach((it) => { if (!it.instanceId) it.instanceId = uid(); });
  return room;
}

// ---------- App state ----------
const state = {
  jobs: [],
  jobsLoaded: false,
  authError: null,
  currentJobId: null,
  view: "list",
  step: "walkthrough",
  openRoomId: null,
  openTrade: null, // which department/trade section is expanded in the currently open room
  customFormFor: null,
  saveNote: "",
};

let db = null;
const dirtyTimers = {}; // jobId -> setTimeout handle, i.e. "has unsaved local edits pending"
const DEBOUNCE_MS = 500;

function getCurrentJob() {
  return state.jobs.find((j) => j.id === state.currentJobId) || null;
}

// ---------- Firebase init ----------
function configLooksReal() {
  return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_");
}

async function initFirebase() {
  if (!configLooksReal()) {
    state.authError = "config";
    render();
    return;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    try { await db.enablePersistence({ synchronizeTabs: true }); } catch (e) {}

    await firebase.auth().signInAnonymously();

    db.collection("jobs").onSnapshot(
      (snap) => {
        const remoteJobs = snap.docs.map((d) => d.data());
        const remoteIds = new Set(remoteJobs.map((j) => j.id));
        remoteJobs.forEach((rj) => {
          if (dirtyTimers[rj.id]) return; // local edits pending — don't clobber
          ensureLaborRoom(rj);
          rj.rooms.forEach(normalizeRoom);
          const idx = state.jobs.findIndex((j) => j.id === rj.id);
          if (idx >= 0) state.jobs[idx] = rj; else state.jobs.push(rj);
        });
        state.jobs = state.jobs.filter((j) => remoteIds.has(j.id) || dirtyTimers[j.id]);
        state.jobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        state.jobsLoaded = true;
        render();
      },
      () => { state.authError = "rules"; render(); }
    );
  } catch (e) {
    state.authError = "auth";
    render();
  }
}

// ---------- Save plumbing ----------
function scheduleSave(jobId) {
  clearTimeout(dirtyTimers[jobId]);
  dirtyTimers[jobId] = setTimeout(() => {
    delete dirtyTimers[jobId];
    const job = state.jobs.find((j) => j.id === jobId);
    if (job && db) {
      const toSave = { ...job, updatedAt: new Date().toISOString() };
      db.collection("jobs").doc(job.id).set(toSave)
        .then(() => flashSave("Saved"))
        .catch(() => flashSave("Save failed — will retry when online"));
    }
  }, DEBOUNCE_MS);
}

function flushSave(jobId) {
  clearTimeout(dirtyTimers[jobId]);
  delete dirtyTimers[jobId];
  const job = state.jobs.find((j) => j.id === jobId);
  if (job && db) {
    db.collection("jobs").doc(job.id).set({ ...job, updatedAt: new Date().toISOString() }).catch(() => {});
  }
}

let saveNoteTimer = null;
function flashSave(msg) {
  state.saveNote = msg;
  const el = document.getElementById("save-note");
  if (el) el.textContent = state.saveNote;
  clearTimeout(saveNoteTimer);
  saveNoteTimer = setTimeout(() => {
    state.saveNote = "";
    const el2 = document.getElementById("save-note");
    if (el2) el2.textContent = "";
  }, 1500);
}

// ---------- Actions ----------
function goList() {
  if (state.currentJobId) flushSave(state.currentJobId);
  state.view = "list";
  state.currentJobId = null;
  render();
}

function createJob() {
  const nameInput = document.getElementById("new-job-name");
  const typeInput = document.getElementById("new-job-type");
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }
  const job = makeJob(name, typeInput.value);
  state.jobs.unshift(job);
  db.collection("jobs").doc(job.id).set(job).catch(() => flashSave("Save failed — check connection"));
  state.currentJobId = job.id;
  state.view = "job";
  state.step = "walkthrough";
  state.openRoomId = null;
  render();
}

function openJob(id) {
  state.currentJobId = id;
  const job = getCurrentJob();
  if (job) { ensureLaborRoom(job); }
  state.view = "job";
  state.step = "walkthrough";
  state.openRoomId = job && job.rooms.find((r) => !r.isLabor) ? job.rooms.find((r) => !r.isLabor).id : null;
  render();
}

function deleteJob(id) {
  if (!confirm("Delete this job? This can't be undone.")) return;
  state.jobs = state.jobs.filter((j) => j.id !== id);
  db.collection("jobs").doc(id).delete().catch(() => {});
  render();
}

function setStep(step) {
  state.step = step;
  render();
}

function addRoom() {
  const typeSelect = document.getElementById("new-room-type");
  const labelInput = document.getElementById("new-room-label");
  const type = typeSelect.value;
  const label = labelInput.value.trim() || type;
  const job = getCurrentJob();
  const room = { id: uid(), name: label, type, items: [], naItems: [], notes: "" };
  job.rooms.push(room);
  state.openRoomId = room.id;
  labelInput.value = "";
  scheduleSave(job.id);
  render();
}

function removeRoom(roomId) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  if (room && room.isLabor) return; // can't remove the labor box
  job.rooms = job.rooms.filter((r) => r.id !== roomId);
  scheduleSave(job.id);
  render();
}

function toggleOpenRoom(roomId) {
  state.openRoomId = state.openRoomId === roomId ? null : roomId;
  state.openTrade = null; // collapse any expanded department when switching rooms
  render();
}

function toggleTradeGroup(trade) {
  state.openTrade = state.openTrade === trade ? null : trade;
  render();
}

// Adds a new, independently-configured instance of a catalog item to a
// room — e.g. a second "Interior paint" instance for an accent wall, or
// a second "Porch/patio flooring" instance for a two-material patio.
function addItemInstance(roomId, catalogId) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const item = catalogItem(catalogId);
  const selections = defaultSelections(item);
  room.naItems = room.naItems.filter((id) => id !== catalogId); // adding an instance clears any N/A mark
  room.items.push({
    instanceId: uid(), itemId: item.id, name: item.name, trade: item.trade, unit: item.unit, qty: 1,
    selections, customCost: null, customNote: "", measurement: "",
    cost: computeItemCost(item, selections, null),
  });
  scheduleSave(job.id);
  render();
}

function removeItemInstance(roomId, instanceId) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  room.items = room.items.filter((i) => i.instanceId !== instanceId);
  scheduleSave(job.id);
  render();
}

function toggleItemNA(roomId, catalogId) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  if (room.naItems.includes(catalogId)) {
    room.naItems = room.naItems.filter((id) => id !== catalogId);
  } else {
    room.naItems.push(catalogId);
  }
  scheduleSave(job.id);
  render();
}

function updateRoomNotes(roomId, value) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  room.notes = value;
  scheduleSave(job.id);
}

function updateItemQty(roomId, instanceId, qty) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const it = room.items.find((i) => i.instanceId === instanceId);
  if (it) it.qty = qty;
  scheduleSave(job.id);
  updateWalkthroughTotals();
}

function updateItemVariant(roomId, instanceId, variantKey, value) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const it = room.items.find((i) => i.instanceId === instanceId);
  const catItem = catalogItem(it.itemId);
  it.selections[variantKey] = value;
  it.cost = computeItemCost(catItem, it.selections, it.customCost);
  scheduleSave(job.id);
  render();
}

function updateItemMeasurement(roomId, instanceId, value) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const it = room.items.find((i) => i.instanceId === instanceId);
  it.measurement = value;
  scheduleSave(job.id);
}

function updateItemCustomNote(roomId, instanceId, note) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const it = room.items.find((i) => i.instanceId === instanceId);
  it.customNote = note;
  scheduleSave(job.id);
}

function updateItemCustomCost(roomId, instanceId, cost) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const it = room.items.find((i) => i.instanceId === instanceId);
  const catItem = catalogItem(it.itemId);
  it.customCost = cost;
  it.cost = computeItemCost(catItem, it.selections, cost);
  scheduleSave(job.id);
  updateWalkthroughTotals();
}

function openCustomForm(roomId) {
  state.customFormFor = roomId;
  render();
}

function addCustomItem(roomId) {
  const name = document.getElementById("custom-name").value.trim();
  if (!name) return;
  const trade = document.getElementById("custom-trade").value;
  const unit = document.getElementById("custom-unit").value;
  const qty = parseFloat(document.getElementById("custom-qty").value) || 1;
  const cost = parseFloat(document.getElementById("custom-cost").value) || 0;
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const customId = uid();
  room.items.push({ instanceId: uid(), itemId: customId, name, trade, unit, cost, qty, selections: {}, customCost: cost, customNote: "" });
  state.customFormFor = null;
  scheduleSave(job.id);
  render();
}

function updateBid(trade, field, value) {
  const job = getCurrentJob();
  if (!job.bids[trade]) job.bids[trade] = {};
  job.bids[trade][field] = value;
  scheduleSave(job.id);
  if (field === "amount") updateQuoteTotals();
}

function updateJobField(field, value) {
  const job = getCurrentJob();
  job[field] = value;
  scheduleSave(job.id);
  updateQuoteTotals();
}

function updateJobName(value) {
  const job = getCurrentJob();
  job.name = value;
  scheduleSave(job.id);
}

function doPrint() { window.print(); }

// All distinct trades, used for the custom-item trade picker
const ALL_TRADES = [...new Set(CATALOG.map((i) => i.trade).concat(LABOR_ITEMS.map((i) => i.trade)))];

// ---------- Computation ----------
function computeTradeGroups(job) {
  const groups = {};
  job.rooms.forEach((room) => {
    room.items.forEach((item) => {
      if (!groups[item.trade]) groups[item.trade] = { lines: [], estTotal: 0 };
      groups[item.trade].lines.push({ ...item, roomName: room.name });
      groups[item.trade].estTotal += (parseFloat(item.qty) || 0) * (parseFloat(item.cost) || 0);
    });
  });
  return groups;
}

function computeInternalTotal(groups) {
  return Object.values(groups).reduce((s, g) => s + g.estTotal, 0);
}

function computeQuoteTotals(job, groups) {
  const subtotal = Object.keys(groups).reduce((sum, trade) => {
    const bid = job.bids[trade] || {};
    const amt = bid.amount !== undefined && bid.amount !== "" ? parseFloat(bid.amount) || 0 : groups[trade].estTotal;
    return sum + amt;
  }, 0);
  const markupAmount = (subtotal * (parseFloat(job.markupPct) || 0)) / 100;
  const taxAmount = ((subtotal + markupAmount) * (parseFloat(job.taxPct) || 0)) / 100;
  const total = subtotal + markupAmount + taxAmount;
  return { subtotal, markupAmount, taxAmount, total };
}

function itemLineLabel(item) {
  const parts = Object.values(item.selections || {}).filter(Boolean);
  let label = item.name;
  if (parts.length) label += " (" + parts.join(", ") + ")";
  if (item.measurement) label += ` [${item.measurement}]`;
  if (item.customNote) label += " — " + item.customNote;
  return label;
}

function updateWalkthroughTotals() {
  const job = getCurrentJob();
  if (!job) return;
  const groups = computeTradeGroups(job);
  const countEl = document.getElementById("wt-item-count");
  if (countEl) {
    const realRooms = job.rooms.filter((r) => !r.isLabor);
    const total = job.rooms.reduce((s, r) => s + r.items.length, 0);
    countEl.textContent = `${total} item${total !== 1 ? "s" : ""} checked across ${realRooms.length} room${realRooms.length !== 1 ? "s" : ""}`;
  }
  const estEl = document.getElementById("wt-est-total");
  if (estEl) estEl.textContent = "Est. internal cost: " + currency(computeInternalTotal(groups));
}

function updateQuoteTotals() {
  const job = getCurrentJob();
  if (!job || job.jobType !== "job") return;
  const groups = computeTradeGroups(job);
  const t = computeQuoteTotals(job, groups);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("q-subtotal", currency(t.subtotal));
  set("q-markup", currency(t.markupAmount));
  set("q-tax", currency(t.taxAmount));
  set("q-total", currency(t.total));
}

// ---------- Render ----------
function render() {
  const activeEl = document.activeElement;
  const activeId = activeEl && activeEl.id;
  const selStart = activeEl && typeof activeEl.selectionStart === "number" ? activeEl.selectionStart : null;

  const app = document.getElementById("app");

  if (state.authError) { app.innerHTML = renderSetupScreen(); return; }
  if (!state.jobsLoaded) { app.innerHTML = `<div style="padding:40px;color:var(--ink-soft);">Connecting…</div>`; return; }

  app.innerHTML = state.view === "list" ? renderListView() : renderJobView();

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus();
      if (selStart !== null && el.setSelectionRange) { try { el.setSelectionRange(selStart, selStart); } catch (e) {} }
    }
  }
}

function renderSetupScreen() {
  if (state.authError === "config") {
    return `<div style="padding:40px 20px;max-width:560px;"><h1>Setup needed</h1>
      <p style="color:var(--ink-soft);line-height:1.6;margin-top:14px;">
      This app syncs jobs across devices using Firebase, but it hasn't been connected yet.
      Open <code>firebase-config.js</code> and paste in your project's config — see README.txt.
      </p></div>`;
  }
  return `<div style="padding:40px 20px;max-width:560px;"><h1>Can't connect</h1>
    <p style="color:var(--ink-soft);line-height:1.6;margin-top:14px;">
    Double-check firebase-config.js, that Firestore exists, and that Anonymous sign-in and
    the security rules are set — see README.txt.
    </p></div>`;
}

function ticks() {
  const line = `<path d="M0 0 H14 M0 0 V14" stroke="#1B3A5C" stroke-width="1.5"/>`;
  return `<div class="ticks">
    <div class="tick tl"><svg viewBox="0 0 14 14">${line}</svg></div>
    <div class="tick tr"><svg viewBox="0 0 14 14">${line}</svg></div>
    <div class="tick bl"><svg viewBox="0 0 14 14">${line}</svg></div>
    <div class="tick br"><svg viewBox="0 0 14 14">${line}</svg></div>
  </div>`;
}

function renderListView() {
  const jobRows = state.jobs.map((j) => `
    <div class="panel job-card">
      ${ticks()}
      <div>
        <div class="name">${esc(j.name)}</div>
        <div class="meta">${JOB_TYPES.find((t) => t.id === j.jobType).label} · updated ${new Date(j.updatedAt).toLocaleDateString()}</div>
      </div>
      <div class="row">
        <button class="btn-primary" style="padding:6px 14px;" onclick="openJob('${j.id}')">Open</button>
        <button class="btn-danger-ghost" onclick="deleteJob('${j.id}')">Delete</button>
      </div>
    </div>
  `).join("");

  return `
    <h1>Scope of Work</h1>
    <div style="height:20px"></div>
    <div class="panel" style="margin-bottom:20px;">
      ${ticks()}
      <div style="font-weight:700;font-size:14px;margin-bottom:10px;">Start a new job</div>
      <div class="row wrap">
        <input id="new-job-name" placeholder="Property address / job name" style="flex:1;min-width:220px;" onkeydown="if(event.key==='Enter')createJob()" />
        <select id="new-job-type">${JOB_TYPES.map((jt) => `<option value="${jt.id}">${jt.label}</option>`).join("")}</select>
        <button class="btn-primary" onclick="createJob()">Start walkthrough</button>
      </div>
    </div>
    <div style="font-weight:700;font-size:14px;margin-bottom:10px;">Jobs</div>
    ${state.jobs.length === 0 ? `<div class="empty-note">No jobs yet — start one above.</div>` : `<div class="grid">${jobRows}</div>`}
  `;
}

function renderJobView() {
  const job = getCurrentJob();
  if (!job) { state.view = "list"; return renderListView(); }
  const jobTypeLabel = JOB_TYPES.find((t) => t.id === job.jobType).label;

  let stepHtml = "";
  if (state.step === "walkthrough") stepHtml = renderWalkthrough(job);
  else if (state.step === "bids") stepHtml = renderBids(job);
  else if (state.step === "quote") stepHtml = renderQuote(job);

  return `
    <div class="row between no-print" style="margin-bottom:16px;">
      <button class="btn-ghost" onclick="goList()">&larr; All jobs</button>
      <span class="save-note" id="save-note">${esc(state.saveNote)}</span>
    </div>
    <div class="eyebrow">${jobTypeLabel}</div>
    <input id="job-name-input" value="${esc(job.name)}" oninput="updateJobName(this.value)"
      style="font-family:var(--font-head);font-weight:700;font-size:24px;color:var(--navy-deep);border:none;background:none;padding:0;width:100%;margin-bottom:16px;" />
    <div class="tabs no-print">
      <button class="tab ${state.step === "walkthrough" ? "active" : ""}" onclick="setStep('walkthrough')">1. Walkthrough</button>
      <button class="tab ${state.step === "bids" ? "active" : ""}" onclick="setStep('bids')">2. Bid packages</button>
      ${job.jobType === "job" ? `<button class="tab ${state.step === "quote" ? "active" : ""}" onclick="setStep('quote')">3. Client quote</button>` : ""}
    </div>
    ${stepHtml}
  `;
}

function renderItemVariants(room, instance, catItem) {
  const hasVariants = !!catItem.variants;
  const hasMeasure = !!catItem.measure;
  if (!hasVariants && !hasMeasure) return "";

  const selectsHtml = hasVariants ? catItem.variants.map((v) => {
    const optsHtml = v.options.map((o) => `<option value="${esc(o.value)}" ${instance.selections[v.key] === o.value ? "selected" : ""}>${esc(o.value)}</option>`).join("");
    return `<label style="font-size:11px;color:var(--ink-soft);">${esc(v.label)}
      <select onchange="updateItemVariant('${room.id}','${instance.instanceId}','${v.key}',this.value)" style="display:block;margin-top:2px;">${optsHtml}</select>
    </label>`;
  }).join("") : "";

  const measureHtml = hasMeasure ? `
    <label style="font-size:11px;color:var(--ink-soft);">${esc(catItem.measure.label)}
      <input id="measure-${room.id}-${instance.instanceId}" value="${esc(instance.measurement || "")}"
        oninput="updateItemMeasurement('${room.id}','${instance.instanceId}',this.value)" placeholder="e.g. 30 x 80" style="display:block;margin-top:2px;width:120px;" />
    </label>` : "";

  const isOther = hasVariants && catItem.variants.some((v) => v.options.some((o) => o.custom && instance.selections[v.key] === o.value));
  const otherFields = isOther ? `
    <label style="font-size:11px;color:var(--ink-soft);">Describe it
      <input id="other-note-${room.id}-${instance.instanceId}" value="${esc(instance.customNote)}"
        oninput="updateItemCustomNote('${room.id}','${instance.instanceId}',this.value)" style="display:block;margin-top:2px;width:140px;" />
    </label>
    <label style="font-size:11px;color:var(--ink-soft);">$/unit
      <input id="other-cost-${room.id}-${instance.instanceId}" type="number" value="${instance.customCost !== null ? instance.customCost : ""}"
        oninput="updateItemCustomCost('${room.id}','${instance.instanceId}',this.value)" style="display:block;margin-top:2px;width:80px;" />
    </label>` : "";

  return `<div class="item-variants no-print" style="display:flex;gap:14px;flex-wrap:wrap;padding:6px 0 10px 28px;">${selectsHtml}${measureHtml}${otherFields}</div>`;
}

function renderCatalogItemRow(room, id) {
  const catItem = catalogItem(id);
  if (!catItem) return "";
  const instances = room.items.filter((i) => i.itemId === id);
  const isNA = room.naItems.includes(id);
  const count = instances.length;

  if (count === 0) {
    // Nothing added yet — offer to add one, or mark not needed.
    return `
      <div class="trade-group" style="margin-bottom:0;">
        <div class="item-row" style="${isNA ? "opacity:0.55;" : ""}">
          <span class="item-name" style="flex:1;${isNA ? "text-decoration:line-through;" : ""}">${esc(catItem.name)}</span>
          <span class="unit-label">${isNA ? "" : esc(catItem.unit)}</span>
          ${isNA
            ? `<button type="button" class="btn-ghost no-print" style="padding:3px 8px;font-size:11px;background:var(--ink-soft);color:white;border-color:var(--ink-soft);" onclick="toggleItemNA('${room.id}','${id}')">N/A</button>`
            : `<button type="button" class="btn-primary no-print" style="padding:3px 10px;font-size:11px;" onclick="addItemInstance('${room.id}','${id}')">+ Add</button>
               <button type="button" class="btn-ghost no-print" style="padding:3px 8px;font-size:11px;" onclick="toggleItemNA('${room.id}','${id}')">N/A</button>`}
        </div>
      </div>`;
  }

  const instancesHtml = instances.map((inst, idx) => {
    const label = count > 1 ? `${catItem.name} ${idx + 1}` : catItem.name;
    return `
      <div class="trade-group" style="margin-bottom:4px;">
        <div class="item-row">
          <span class="item-name">${esc(label)}</span>
          <input type="number" step="0.5" value="${inst.qty}" oninput="updateItemQty('${room.id}','${inst.instanceId}', this.value)" />
          <span class="unit-label">${esc(catItem.unit)}</span>
          <button type="button" class="btn-danger-ghost no-print" style="padding:3px 8px;font-size:11px;" onclick="removeItemInstance('${room.id}','${inst.instanceId}')">Remove</button>
        </div>
        ${renderItemVariants(room, inst, catItem)}
      </div>`;
  }).join("");

  return `${instancesHtml}
    <div style="padding:0 0 8px 0;">
      <button type="button" class="btn-ghost no-print" style="padding:3px 10px;font-size:11px;" onclick="addItemInstance('${room.id}','${id}')">+ Add another ${esc(catItem.name)}</button>
    </div>`;
}

// Groups a room's checklist into department-style sections by trade
// (Flooring, Electrical, Plumbing, etc.) — like a store aisle layout —
// so the foreman taps a department open instead of scrolling one long list.
function renderRoomChecklist(room) {
  const itemIds = itemIdsForRoom(room);
  const tradeOrder = [];
  const tradeMap = {};
  itemIds.forEach((id) => {
    const catItem = catalogItem(id);
    if (!catItem) return;
    if (!tradeMap[catItem.trade]) { tradeMap[catItem.trade] = []; tradeOrder.push(catItem.trade); }
    tradeMap[catItem.trade].push(id);
  });

  return tradeOrder.map((trade) => {
    const ids = tradeMap[trade];
    const addedCount = ids.filter((id) => room.items.some((i) => i.itemId === id)).length;
    const naCount = ids.filter((id) => room.naItems.includes(id)).length;
    const isOpen = state.openTrade === trade;
    const badgeBits = [];
    if (addedCount > 0) badgeBits.push(`${addedCount} added`);
    if (naCount > 0) badgeBits.push(`${naCount} N/A`);
    const badge = badgeBits.length ? `<span style="font-size:11px;color:var(--ink-soft);">${badgeBits.join(", ")}</span>` : "";

    return `
      <div style="border:1px solid var(--line-soft);margin-bottom:6px;">
        <div class="no-print" onclick="toggleTradeGroup('${trade}')"
          style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;cursor:pointer;background:${isOpen ? "var(--bg)" : "white"};">
          <span style="font-weight:600;font-size:13px;">${esc(trade)}</span>
          <span style="display:flex;align-items:center;gap:10px;">${badge}<span style="font-size:12px;">${isOpen ? "&#9650;" : "&#9660;"}</span></span>
        </div>
        <div style="display:${isOpen ? "block" : "none"};padding:10px 12px;border-top:1px solid var(--line-soft);">
          ${ids.map((id) => renderCatalogItemRow(room, id)).join("")}
        </div>
      </div>`;
  }).join("");
}

function renderWalkthrough(job) {
  const realRooms = job.rooms.filter((r) => !r.isLabor);
  const laborRoom = job.rooms.find((r) => r.isLabor) || makeLaborRoom();
  const allRoomsInOrder = [...realRooms, laborRoom];

  const roomsHtml = allRoomsInOrder.map((room) => {
    const isOpen = state.openRoomId === room.id;
    const itemsHtml = renderRoomChecklist(room);


    const customFormHtml = state.customFormFor === room.id
      ? `<div class="custom-form no-print">
          <input id="custom-name" placeholder="Description" />
          <select id="custom-trade">${ALL_TRADES.map((t) => `<option value="${t}">${t}</option>`).join("")}</select>
          <input id="custom-qty" type="number" placeholder="Qty" value="1" style="max-width:60px;" />
          <select id="custom-unit">${UNITS.map((u) => `<option value="${u}">${u}</option>`).join("")}</select>
          <input id="custom-cost" type="number" placeholder="$/unit (optional)" style="max-width:120px;" />
          <button class="btn-primary" style="padding:8px 12px;" onclick="addCustomItem('${room.id}')">Add</button>
        </div>`
      : `<button class="dashed-add no-print" onclick="openCustomForm('${room.id}')">+ Add item not on the list</button>`;

    const checkedList = room.items.length > 0
      ? `<div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">Checked: ${room.items.map((i) => esc(itemLineLabel(i))).join(", ")}</div>`
      : "";
    const naList = room.naItems.length > 0
      ? `<div style="margin-top:4px;font-size:12px;color:var(--ink-soft);font-style:italic;">N/A: ${room.naItems.map((naId) => { const ci = catalogItem(naId); return esc(ci ? ci.name : naId); }).join(", ")}</div>`
      : "";

    const notesHtml = `<div class="no-print" style="margin-top:14px;">
      <label style="font-size:11.5px;font-weight:600;color:var(--ink-soft);display:block;margin-bottom:4px;">Notes</label>
      <textarea id="room-notes-${room.id}" oninput="updateRoomNotes('${room.id}', this.value)"
        placeholder="e.g. previously remodeled, skip flooring; water damage under sink"
        style="width:100%;min-height:56px;resize:vertical;">${esc(room.notes || "")}</textarea>
    </div>`;

    const headerNote = room.isLabor ? "" : `<span style="font-size:11px;color:var(--ink-soft);margin-left:8px;">${esc(room.type || "")}</span>`;
    const naBadge = room.naItems.length > 0 ? `, ${room.naItems.length} N/A` : "";

    return `
      <div class="panel room-card">
        <div class="room-head" onclick="toggleOpenRoom('${room.id}')">
          <div class="name">${esc(room.name)}${headerNote}</div>
          <div class="row">
            <span class="count">${room.items.length} item${room.items.length !== 1 ? "s" : ""}${naBadge}</span>
            ${room.isLabor ? "" : `<button class="btn-danger-ghost no-print" onclick="event.stopPropagation();removeRoom('${room.id}')">Remove</button>`}
            <span style="font-size:12px;">${isOpen ? "&#9650;" : "&#9660;"}</span>
          </div>
        </div>
        ${isOpen ? `<div class="room-body">${itemsHtml}${customFormHtml}${checkedList}${naList}${notesHtml}</div>` : ""}
      </div>
    `;
  }).join("");

  const groups = computeTradeGroups(job);
  const totalItems = job.rooms.reduce((s, r) => s + r.items.length, 0);

  return `
    <div class="row wrap no-print" style="margin-bottom:14px;">
      <select id="new-room-type" style="min-width:160px;">
        <optgroup label="Interior">${ROOM_GROUPS["Interior"].map((t) => `<option value="${t}">${t}</option>`).join("")}</optgroup>
        <optgroup label="Exterior">${ROOM_GROUPS["Exterior"].map((t) => `<option value="${t}">${t}</option>`).join("")}</optgroup>
        <option value="Other">Other</option>
      </select>
      <input id="new-room-label" placeholder="Label (optional, e.g. Bath 2)" style="flex:1;min-width:160px;" onkeydown="if(event.key==='Enter')addRoom()" />
      <button class="btn-primary" onclick="addRoom()">+ Add room</button>
    </div>
    ${realRooms.length === 0 ? `<div class="panel empty-note">No rooms yet. Pick a room type above and add each area as you walk it.</div>` : ""}
    <div class="grid">${roomsHtml}</div>
    <div class="panel row between" style="margin-top:16px;">
      <div id="wt-item-count" style="font-size:13px;">${totalItems} item${totalItems !== 1 ? "s" : ""} checked across ${realRooms.length} room${realRooms.length !== 1 ? "s" : ""}</div>
      ${job.jobType !== "job" ? `<div id="wt-est-total" style="font-weight:700;font-size:16px;">Est. internal cost: ${currency(computeInternalTotal(groups))}</div>` : ""}
    </div>
  `;
}

function renderBids(job) {
  const groups = computeTradeGroups(job);
  const trades = Object.keys(groups);
  if (trades.length === 0) {
    return `<div class="panel empty-note">Nothing to package yet — check off items in the walkthrough first.</div>`;
  }
  const groupsHtml = trades.map((trade) => {
    const group = groups[trade];
    const bid = job.bids[trade] || {};
    const linesHtml = group.lines.map((line) => `
      <tr>
        <td>${esc(itemLineLabel(line))}</td>
        <td style="color:var(--ink-soft);">${esc(line.roomName)}</td>
        <td class="num">${line.qty}</td>
        <td style="color:var(--ink-soft);">${esc(line.unit)}</td>
      </tr>`).join("");
    return `
      <div class="panel" style="margin-bottom:12px;">
        ${ticks()}
        <div class="row between" style="margin-bottom:10px;">
          <div style="font-weight:700;font-size:15px;">${esc(trade)}</div>
          <div class="no-print" style="font-size:11.5px;color:var(--ink-soft);">internal est. ${currency(group.estTotal)}</div>
        </div>
        <table style="margin-bottom:12px;">
          <thead><tr><th>Item</th><th>Room</th><th class="num">Qty</th><th>Unit</th></tr></thead>
          <tbody>${linesHtml}</tbody>
        </table>
        <div class="row wrap no-print" style="border-top:1px solid var(--line-soft);padding-top:10px;">
          <input placeholder="Sub/supplier name" value="${esc(bid.sub || "")}" oninput="updateBid('${trade}','sub',this.value)" style="flex:1;min-width:160px;" />
          <input type="number" placeholder="Bid amount $" value="${bid.amount !== undefined ? bid.amount : ""}" oninput="updateBid('${trade}','amount',this.value)" style="width:130px;" />
          <input placeholder="Notes" value="${esc(bid.notes || "")}" oninput="updateBid('${trade}','notes',this.value)" style="flex:1;min-width:160px;" />
        </div>
      </div>`;
  }).join("");

  return `${groupsHtml}<div class="no-print" style="margin-top:14px;"><button class="btn-secondary" onclick="doPrint()">Print this page</button></div>`;
}

function renderQuote(job) {
  const groups = computeTradeGroups(job);
  const trades = Object.keys(groups);
  const t = computeQuoteTotals(job, groups);

  const rows = trades.map((trade) => {
    const bid = job.bids[trade] || {};
    const hasBid = bid.amount !== undefined && bid.amount !== "";
    const amt = hasBid ? parseFloat(bid.amount) || 0 : groups[trade].estTotal;
    return `
      <tr>
        <td>${esc(trade)}</td>
        <td style="color:var(--ink-soft);font-size:12px;">${hasBid ? "Sub bid" + (bid.sub ? " — " + esc(bid.sub) : "") : "Internal estimate (no bid yet)"}</td>
        <td class="num">
          <input class="no-print" type="number" value="${bid.amount !== undefined ? bid.amount : ""}" placeholder="${currency(groups[trade].estTotal)}"
            oninput="updateBid('${trade}','amount',this.value)" style="width:110px;text-align:right;" />
          <span class="print-only" style="display:none;">${currency(amt)}</span>
        </td>
      </tr>`;
  }).join("");

  return `
    <div class="panel">
      ${ticks()}
      <table>
        <thead><tr><th>Trade</th><th>Source</th><th class="num" style="width:130px;">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals-box" style="margin-top:20px;">
        <div class="totals-row"><span>Subtotal</span><span id="q-subtotal">${currency(t.subtotal)}</span></div>
        <div class="totals-row">
          <span class="no-print">Markup <input type="number" value="${job.markupPct}" oninput="updateJobField('markupPct',this.value)" style="width:44px;padding:2px 4px;font-size:12px;" />%</span>
          <span id="q-markup">${currency(t.markupAmount)}</span>
        </div>
        <div class="totals-row">
          <span class="no-print">Tax <input type="number" value="${job.taxPct}" oninput="updateJobField('taxPct',this.value)" style="width:44px;padding:2px 4px;font-size:12px;" />%</span>
          <span id="q-tax">${currency(t.taxAmount)}</span>
        </div>
        <div class="totals-final"><span>Total due</span><span id="q-total">${currency(t.total)}</span></div>
      </div>
      <div class="no-print" style="margin-top:20px;border-top:1px solid var(--line-soft);padding-top:16px;">
        <button class="btn-accent" onclick="doPrint()">Print / export PDF</button>
      </div>
    </div>
  `;
}

// ---------- Install prompt ----------
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "flex";
});
function doInstall() {
  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "none";
  if (deferredInstallPrompt) { deferredInstallPrompt.prompt(); deferredInstallPrompt = null; }
}
function dismissInstall() {
  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "none";
}

// ---------- Online/offline banner ----------
function updateOnlineBanner() {
  const banner = document.getElementById("offline-banner");
  if (banner) banner.style.display = navigator.onLine ? "none" : "block";
}
window.addEventListener("online", updateOnlineBanner);
window.addEventListener("offline", updateOnlineBanner);

// ---------- Service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}

updateOnlineBanner();
initFirebase();
