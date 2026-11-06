const CART_STORAGE_KEY = "cedarHall.cart.v1";

let storageWorks = true;

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
    storageWorks = true;
  } catch (error) {
    storageWorks = false;
    console.warn("The cart could not be saved:", error);
  }
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!saved || !Array.isArray(saved.seatIds)) return [];
    const valid = [];
    saved.seatIds.forEach((id) => {
      const seat = SEAT_BY_ID.get(id);
      if (seat && seat.available && !valid.includes(id)) valid.push(id);
    });
    return valid;
  } catch (error) {
    return [];
  }
}