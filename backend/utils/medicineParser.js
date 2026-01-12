const STOP_WORDS = [
  "prescription",
  "doctor",
  "signature",
  "tablet",
  "tablets",
  "capsule",
  "capsules",
  "once",
  "twice",
  "daily",
  "morning",
  "night"
];

function cleanLine(line) {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "")
    .trim();
}

function isPossibleMedicine(line) {
  if (!line) return false;
  if (line.length < 3) return false;

  return !STOP_WORDS.some(word => line.includes(word));
}

function parseMedicines(extractedText) {
  if (!extractedText) return [];

  const lines = extractedText
    .split("\n")
    .map(l => cleanLine(l))
    .filter(Boolean);

  const medicines = [];

  for (let line of lines) {
    if (isPossibleMedicine(line)) {
      medicines.push({
        name: line
          .replace(/\b\d+mg\b/g, "")
          .trim()
          .replace(/\b\w/g, c => c.toUpperCase())
      });
    }
  }

  // remove duplicates
  const unique = [];
  const seen = new Set();

  for (let med of medicines) {
    if (!seen.has(med.name)) {
      seen.add(med.name);
      unique.push(med);
    }
  }

  return unique;
}

module.exports = { parseMedicines };
