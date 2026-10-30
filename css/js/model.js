const UNAVAILABLE_SET = new Set(UNAVAILABLE_SEATS);

function seatId(blockKey, row, number) {
  return `${BLOCKS[blockKey].code}-${row}${String(number).padStart(2, "0")}`;
}

function buildSeats() {
  const seats = [];
  ZONES.forEach((zone) => {
    const block = BLOCKS[zone.block];
    const category = CATEGORIES[zone.category];
    zone.rows.forEach((row) => {
      for (let number = 1; number <= block.seatsPerRow; number++) {
        const id = seatId(zone.block, row, number);
        seats.push({
          id, block: zone.block, blockLabel: block.label, zoneId: zone.id, zoneName: zone.name,
          row, number, category: zone.category, categoryLabel: category.label, price: category.price,
          available: !UNAVAILABLE_SET.has(id)
        });
      }
    });
  });
  return seats;
}

const SEATS = buildSeats();
const SEAT_BY_ID = new Map(SEATS.map((seat) => [seat.id, seat]));

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function validateVenue() {
  const problems = [];

  if (SEAT_BY_ID.size !== SEATS.length) {
    problems.push("Duplicate seat IDs found.");
  }
  UNAVAILABLE_SEATS.forEach((id) => {
    if (!SEAT_BY_ID.has(id)) problems.push(`Unavailable seat does not exist: ${id}`);
  });
  ZONES.forEach((zone) => {
    if (!BLOCKS[zone.block]) problems.push(`Zone ${zone.id} uses unknown block "${zone.block}".`);
    if (!CATEGORIES[zone.category]) problems.push(`Zone ${zone.id} uses unknown category "${zone.category}".`);
  });
  Object.keys(BLOCKS).forEach((blockKey) => {
    const expected = VENUE.rows.length * BLOCKS[blockKey].seatsPerRow;
    const actual = SEATS.filter((seat) => seat.block === blockKey).length;
    if (expected !== actual) {
      problems.push(`Block ${blockKey}: expected ${expected} seats but generated ${actual}.`);
    }
  });
  return problems;
}