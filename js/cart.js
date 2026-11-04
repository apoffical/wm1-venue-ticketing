function addSeatToCart(seatId) {
  const seat = SEAT_BY_ID.get(seatId);
  if (!seat || !canAddToCart(seat)) return false;
  state.cartSeatIds.push(seatId);
  return true;
}

function removeSeatFromCart(seatId) {
  const index = state.cartSeatIds.indexOf(seatId);
  if (index === -1) return false;
  state.cartSeatIds.splice(index, 1);
  return true;
}

function getCartSeats() {
  return state.cartSeatIds.map((id) => SEAT_BY_ID.get(id));
}

function getCartTotal() {
  return getCartSeats().reduce((sum, seat) => sum + seat.price, 0);
}