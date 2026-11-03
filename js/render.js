function seatsInRow(blockKey, row) {
  return SEATS.filter((seat) => seat.block === blockKey && seat.row === row);
}

function createSeatButton(seat) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "seat";
  button.dataset.seatId = seat.id;
  button.style.setProperty("--seat-color", CATEGORIES[seat.category].color);
  button.textContent = seat.number;
  button.title = `${seat.id} | ${seat.categoryLabel} | ${formatPrice(seat.price)}`;
  return button;
}

function createRow(blockKey, row) {
  const rowElement = document.createElement("div");
  rowElement.className = "seat-row";

  const label = document.createElement("span");
  label.className = "seat-row__label";
  label.textContent = row;
  label.setAttribute("aria-hidden", "true");
  rowElement.append(label);

  seatsInRow(blockKey, row).forEach((seat) => rowElement.append(createSeatButton(seat)));
  return rowElement;
}

function createBlock(blockKey) {
  const block = BLOCKS[blockKey];
  const blockElement = document.createElement("div");
  blockElement.className = `seat-block seat-block--${blockKey}`;
  blockElement.setAttribute("role", "group");
  blockElement.setAttribute("aria-label", block.label);

  const title = document.createElement("h3");
  title.className = "seat-block__title";
  title.textContent = block.label;
  blockElement.append(title);

  VENUE.rows.forEach((row) => blockElement.append(createRow(blockKey, row)));
  return blockElement;
}


function renderSeatMap() {
  const container = document.getElementById("seat-map");
  container.innerHTML = "";
  Object.keys(BLOCKS).forEach((blockKey) => container.append(createBlock(blockKey)));
}