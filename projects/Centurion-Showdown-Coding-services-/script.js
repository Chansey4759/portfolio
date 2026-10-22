const elements = [
  "typeless",
  "air",
  "blast",
  "blood",
  "cosmic",
  "crystal",
  "dark",
  "dragon",
  "earth",
  "fairy",
  "fire",
  "fossil",
  "ghost",
  "ice",
  "insect",
  "lava",
  "light",
  "magic",
  "martial",
  "metal",
  "nature",
  "poison",
  "psychic",
  "radiation",
  "rock",
  "sound",
  "tech",
  "thunder",
  "water",
];

const matchups = {
  air: {
    strong: ["fairy", "insect", "martial", "nature"],
    weak: ["cosmic", "crystal", "fossil", "ice", "lava", "metal", "rock", "tech", "thunder"],
  },
  blast: {
    strong: ["air", "cosmic", "crystal", "dark", "earth", "fossil", "ice", "lava", "metal", "nature", "rock", "tech"],
    weak: ["dragon", "fire", "ghost", "insect", "water"],
  },
  blood: {
    strong: ["blood", "fairy", "fire", "tech"],
    weak: ["blast", "cosmic", "crystal", "fossil", "ghost", "poison", "rock", "thunder", "water"],
  },
  cosmic: {
    strong: ["air", "crystal", "dark", "earth", "lava", "light", "metal", "nature", "radiation", "rock", "sound"],
    weak: ["blast", "fire", "ice", "tech", "water"],
  },
  crystal: {
    strong: ["air", "fire", "fossil", "ice", "insect", "lava", "magic", "radiation", "rock"],
    weak: ["blast", "blood", "cosmic", "earth", "martial", "metal", "nature", "water"],
  },
  dark: {
    strong: ["blast", "ghost", "light", "magic", "psychic"],
    weak: ["cosmic", "fairy", "insect", "martial"],
  },
  dragon: {
    strong: ["dragon", "lava", "magic", "metal", "radiation"],
    weak: ["cosmic", "fairy", "ice"],
  },
  earth: {
    strong: ["blast", "crystal", "fire", "fossil", "light", "metal", "poison", "radiation", "rock", "sound", "tech", "thunder"],
    weak: ["cosmic", "ice", "insect", "lava", "nature", "water"],
  },
  fairy: {
    strong: ["dark", "dragon", "magic", "martial"],
    weak: ["air", "blood", "crystal", "insect", "metal", "poison"],
  },
  fire: {
    strong: ["ice", "insect", "metal", "nature", "tech"],
    weak: ["blast", "blood", "cosmic", "crystal", "dragon", "earth", "fire", "fossil", "lava", "rock", "water"],
  },
  fossil: {
    strong: ["air", "fire", "ice", "insect", "rock"],
    weak: ["blast", "cosmic", "crystal", "earth", "lava", "martial", "metal", "nature", "radiation", "water"],
  },
  ghost: {
    strong: ["ghost", "martial", "psychic", "tech"],
    weak: ["dark", "light", "magic"],
  },
  ice: {
    strong: ["air", "cosmic", "dragon", "earth", "insect", "nature", "radiation", "water"],
    weak: ["blast", "blood", "crystal", "fire", "fossil", "ice", "martial", "metal", "rock"],
  },
  insect: {
    strong: ["blood", "earth", "fairy", "nature", "poison", "psychic"],
    weak: ["air", "crystal", "fire", "fossil", "ice", "lava", "light", "metal", "radiation", "rock"],
  },
  lava: {
    strong: ["blast", "blood", "fairy", "fire", "fossil", "ice", "insect", "metal", "nature", "poison", "radiation", "rock", "thunder"],
    weak: ["crystal", "dragon", "earth", "ghost", "magic"],
  },
  light: {
    strong: ["dark", "ghost", "sound"],
    weak: ["cosmic", "earth", "fire", "nature"],
  },
  magic: {
    strong: ["blood", "cosmic", "crystal", "ghost", "martial", "metal", "tech"],
    weak: ["dark", "dragon", "fairy", "magic"],
  },
  martial: {
    strong: ["crystal", "dark", "fossil", "ice", "metal", "rock"],
    weak: ["air", "cosmic", "fairy", "insect", "lava", "magic", "psychic", "radiation", "sound"],
  },
  metal: {
    strong: ["crystal", "fairy", "fossil", "ice", "insect", "rock"],
    weak: ["blast", "earth", "fire", "lava", "martial", "metal", "radiation", "sound", "tech", "thunder"],
  },
  nature: {
    strong: ["crystal", "earth", "fossil", "light", "rock", "tech", "water"],
    weak: ["air", "blast", "cosmic", "dragon", "fire", "ice", "insect", "poison"],
  },
  poison: {
    strong: ["blood", "fairy", "insect", "martial", "nature", "water"],
    weak: ["dragon", "fossil", "ghost", "lava", "psychic", "radiation", "rock"],
  },
  psychic: {
    strong: ["magic", "martial", "poison", "tech"],
    weak: ["cosmic", "fairy", "ghost", "lava", "sound"],
  },
  radiation: {
    strong: ["air", "blast", "blood", "earth", "ice", "insect", "martial", "nature", "poison", "tech"],
    weak: ["cosmic", "dark", "magic", "metal", "sound", "water"],
  },
  rock: {
    strong: ["air", "fire", "ice", "insect", "radiation", "tech", "thunder"],
    weak: ["blast", "dark", "earth", "ghost", "martial", "metal", "nature", "water"],
  },
  sound: {
    strong: ["air", "crystal", "ice", "metal"],
    weak: ["ghost", "insect", "psychic", "radiation", "rock"],
  },
  tech: {
    strong: ["blood", "cosmic", "dark", "fossil", "lava", "magic", "martial", "radiation", "sound"],
    weak: ["blast", "earth", "fairy", "fire", "ghost"],
  },
  thunder: {
    strong: ["air", "blood", "light", "metal", "poison", "tech", "water"],
    weak: ["crystal", "dragon", "radiation", "rock"],
  },
  water: {
    strong: ["blast", "crystal", "earth", "fire", "fossil", "insect", "rock", "tech"],
    weak: ["blood", "cosmic", "dragon", "ice", "nature", "poison", "radiation", "sound", "thunder"],
  },
};

const immunities = {
  blast: ["sound", "radiation"],
  blood: ["insect", "lava", "metal", "radiation"],
  crystal: ["thunder"],
  earth: ["air"],
  fire: ["radiation"],
  ice: ["lava"],
  lava: ["cosmic", "lava", "water"],
  light: ["radiation"],
  martial: ["ghost"],
  nature: ["lava"],
  poison: ["cosmic", "crystal", "earth", "metal", "poison"],
  psychic: ["dark"],
  radiation: ["ghost", "lava", "light"],
  rock: ["cosmic", "lava"],
  sound: ["cosmic", "earth"],
  tech: ["thunder"],
  thunder: ["earth", "fossil", "lava"],
  water: ["lava"],
};

const form = document.querySelector("#calculator-form");
const resultCard = document.querySelector("#result-card");
const damageTotal = document.querySelector("#damage-total");
const resultKicker = document.querySelector("#result-kicker");
const resultSummary = document.querySelector("#result-summary");
const resultDetails = document.querySelector("#result-details");
const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 8,
});

function populateElementSelect(select, placeholder) {
  select.add(new Option(placeholder, ""));

  for (const element of elements) {
    const label = element === "typeless"
      ? "Typeless (neutral)"
      : element.charAt(0).toUpperCase() + element.slice(1);
    select.add(new Option(label, element));
  }
}

document.querySelectorAll("select").forEach((select) => {
  const placeholder = select.name === "attackElement1"
    ? "Choose an element"
    : select.name === "attackElement2"
      ? "No second element"
      : "No element";
  populateElementSelect(select, placeholder);
});

function addDetail(label, value) {
  const chip = document.createElement("span");
  chip.className = "detail-chip";
  const labelNode = document.createElement("strong");
  labelNode.textContent = `${label}: `;
  chip.append(labelNode, document.createTextNode(value));
  resultDetails.append(chip);
}

function readStat(input) {
  const value = input.valueAsNumber;
  if (!Number.isSafeInteger(value) || value < 0) {
    input.setCustomValidity("Enter a non-negative whole number within the safe integer range.");
    input.reportValidity();
    input.setCustomValidity("");
    input.focus();
    return null;
  }
  return value;
}

function getElement(select) {
  return select.value || "typeless";
}

function calculateDamage(attack, attackElements, defense, defenseElements) {
  let steps = 0;
  let immune = false;

  for (const attackElement of new Set(attackElements)) {
    for (const defenseElement of defenseElements) {
      if (immunities[attackElement]?.includes(defenseElement)) {
        immune = true;
        continue;
      }

      const matchup = matchups[attackElement];
      if (matchup?.strong.includes(defenseElement)) {
        steps += 1;
      } else if (matchup?.weak.includes(defenseElement)) {
        steps -= 1;
      }
    }
  }

  let remainingDefense = defense;
  const defenseAbsorbed = !immune && remainingDefense !== 0 && steps >= 1;
  if (defenseAbsorbed) {
    remainingDefense = 0;
    steps -= 1;
  }

  const damage = immune
    ? 0
    : Math.max(0, attack * (2 ** steps) - remainingDefense);

  return { damage, steps, immune, defenseAbsorbed };
}

function describeMatchup(steps, immune) {
  if (immune) {
    return "This opponent is immune to the selected attack.";
  }
  if (steps > 0) {
    return `Super effective · ${numberFormatter.format(2 ** steps)}× attack multiplier`;
  }
  if (steps < 0) {
    return `Resisted · ${numberFormatter.format(2 ** steps)}× attack multiplier`;
  }
  return "Neutral effectiveness · 1× attack multiplier";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const attack = readStat(form.elements.attack);
  if (attack === null) return;
  const defense = readStat(form.elements.defense);
  if (defense === null) return;

  const attackElements = [
    getElement(form.elements.attackElement1),
    getElement(form.elements.attackElement2),
  ];
  const defenseElements = [
    getElement(form.elements.defenseElement1),
    getElement(form.elements.defenseElement2),
    getElement(form.elements.defenseElement3),
    getElement(form.elements.defenseElement4),
  ];
  const result = calculateDamage(attack, attackElements, defense, defenseElements);

  resultKicker.textContent = result.immune ? "Immune matchup" : "Battle result";
  damageTotal.textContent = numberFormatter.format(result.damage);
  resultSummary.textContent = describeMatchup(result.steps, result.immune);
  resultDetails.replaceChildren();
  addDetail("ATK", numberFormatter.format(attack));
  addDetail("DEF", numberFormatter.format(defense));
  if (result.defenseAbsorbed) addDetail("DEF effect", "absorbed one advantage step");
  resultCard.hidden = false;
});

form.addEventListener("input", () => {
  resultCard.hidden = true;
});

form.addEventListener("change", () => {
  resultCard.hidden = true;
});

form.addEventListener("reset", () => {
  resultCard.hidden = true;
});
