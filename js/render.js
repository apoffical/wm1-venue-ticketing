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

function describeSeat(seat, seatState) {
  return `Seat ${seat.id}, ${seat.blockLabel}, row ${seat.row}, number ${seat.number}, ` +
         `${seat.categoryLabel}, ${formatPrice(seat.price)}, ${STATE_LABELS[seatState]}`;
}

function refreshSeatStates() {
  document.querySelectorAll(".seat").forEach((button) => {
    const seat = SEAT_BY_ID.get(button.dataset.seatId);
    const seatState = getSeatState(seat);
    button.dataset.state = seatState;
    button.setAttribute("aria-label", describeSeat(seat, seatState));
    button.setAttribute("aria-disabled", String(seatState === "unavailable"));
    if (state.inspectedSeatId === seat.id) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function setDetail(id, text) {
  document.getElementById(id).textContent = text;
}

function renderSeatDetails() {
  const seat = SEAT_BY_ID.get(state.inspectedSeatId);
  const hint = document.getElementById("details-hint");
  const status = document.getElementById("detail-status");
  const addButton = document.getElementById("add-to-cart");

  if (!seat) {
    ["seat", "zone", "row", "number", "category", "price", "status"].forEach((name) => {
      setDetail(`detail-${name}`, "\u2013");
    });
    status.dataset.status = "";
    hint.textContent = "Click a seat on the map to inspect it.";
    addButton.disabled = true;
    return;
  }

  const seatState = getSeatState(seat);
  setDetail("detail-seat", seat.id);
  setDetail("detail-zone", seat.zoneName);
  setDetail("detail-row", seat.row);
  setDetail("detail-number", seat.number);
  setDetail("detail-category", seat.categoryLabel);
  setDetail("detail-price", formatPrice(seat.price));
  setDetail("detail-status", STATE_LABELS[seatState]);
  status.dataset.status = seatState;

  if (seatState === "unavailable") {
    hint.textContent = "This seat is unavailable and cannot be added.";
  } else if (seatState === "in-cart") {
    hint.textContent = "This seat is already in your cart.";
  } else {
    hint.textContent = "Review the details, then press ADD TO CART.";
  }
  addButton.disabled = !canAddToCart(seat);
}

function inspectSeat(seatId) {
  state.inspectedSeatId = seatId;
  refreshSeatStates();
  renderSeatDetails();
}

function initSeatInteraction() {
  document.getElementById("seat-map").addEventListener("click", (event) => {
    const button = event.target.closest(".seat");
    if (button) inspectSeat(button.dataset.seatId);
  });
}

function createCartItem(seat) {
  const item = document.createElement("li");
  item.className = "cart-item";
  item.style.setProperty("--seat-color", CATEGORIES[seat.category].color);

  const title = document.createElement("span");
  title.className = "cart-item__title";
  title.textContent = `Seat ${seat.id}`;

  const price = document.createElement("span");
  price.className = "cart-item__price";
  price.textContent = formatPrice(seat.price);

  const meta = document.createElement("span");
  meta.className = "cart-item__meta";
  meta.textContent = `${seat.zoneName} | Row ${seat.row}, Seat ${seat.number} | ${seat.categoryLabel}`;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "btn btn--small";
  remove.textContent = "Remove";
  remove.dataset.removeSeatId = seat.id;
  remove.setAttribute("aria-label", `Remove seat ${seat.id} from the cart`);

  item.append(title, price, meta, remove);
  return item;
}

function renderCart() {
  const seats = getCartSeats();
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  seats.forEach((seat) => list.append(createCartItem(seat)));
  document.getElementById("cart-empty").hidden = seats.length > 0;
  document.getElementById("cart-count").textContent = seats.length;
  document.getElementById("cart-total").textContent = formatPrice(getCartTotal());
}

function refreshUI() {
  refreshSeatStates();
  renderSeatDetails();
  renderCart();
}

function initCartInteraction() {
  document.getElementById("add-to-cart").addEventListener("click", () => {
    if (addSeatToCart(state.inspectedSeatId)) refreshUI();
  });

  document.getElementById("cart-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-seat-id]");
    if (button && removeSeatFromCart(button.dataset.removeSeatId)) refreshUI();
  });
   window.addEventListener("storage", (event) => {
    if (event.key !== CART_STORAGE_KEY) return;
    state.cartSeatIds = loadCart();
    refreshUI();
  });
}