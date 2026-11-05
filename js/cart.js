const CART_STORAGE_KEY = "cedarHall.cart.v1";

function addSeatToCart(seatId) {
  const seat = SEAT_BY_ID.get(seatId);
  if (!seat || !canAddToCart(seat)) return false;
  state.cartSeatIds.push(seatId);
  saveCart();
  return true;
}

function removeSeatFromCart(seatId) {
  const index = state.cartSeatIds.indexOf(seatId);
  if (index === -1) return false;
  state.cartSeatIds.splice(index, 1);
  saveCart();
  return true;
}

function getCartSeats() {
  return state.cartSeatIds.map((id) => SEAT_BY_ID.get(id));
}

function getCartTotal() {
  return getCartSeats().reduce((sum, seat) => sum + seat.price, 0);
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, seatIds: state.cartSeatIds }));
  } catch (error) {
    console.warn("The cart could not be saved:", error);
  }
}

// Reads the saved cart. Anything wrong with the saved data is ignored, so the page never breaks.
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!saved || !Array.isArray(saved.seatIds)) return [];
    const valid = [];
    saved.seatIds.forEach((id) => {
      const seat = SEAT_BY_ID.get(id);
      // keep only seats that still exist, are still available and are not repeated
      if (seat && seat.available && !valid.includes(id)) valid.push(id);
    });
    return valid;
  } catch (error) {
    return [];
  }
}