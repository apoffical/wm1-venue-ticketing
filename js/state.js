const state = {
  inspectedSeatId: null, // the seat currently shown in the details panel
  cartSeatIds: []        // seats in the cart (filled in Week 3)
};

const STATE_LABELS = {
  available: "Available",
  inspected: "Available",
  "in-cart": "In your cart",
  unavailable: "Unavailable"
};

function isInCart(seatId) {
  return state.cartSeatIds.includes(seatId);
}

function getSeatState(seat) {
  if (!seat.available) return "unavailable";
  if (isInCart(seat.id)) return "in-cart";
  if (state.inspectedSeatId === seat.id) return "inspected";
  return "available";
}

function canAddToCart(seat) {
  return seat.available && !isInCart(seat.id);
}