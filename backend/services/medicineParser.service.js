exports.extractMedicines = (text) => {
  const knownMedicines = [
    'dolo',
    'paracetamol',
    'azithromycin',
    'amoxicillin',
    'crocin'
  ];

  const found = new Set();

  knownMedicines.forEach(med => {
    if (text.toLowerCase().includes(med)) {
      found.add(med);
    }
  });

  return Array.from(found);
};
