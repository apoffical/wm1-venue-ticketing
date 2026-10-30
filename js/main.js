function renderVenueSummary() {
  const available = SEATS.filter((seat) => seat.available).length;
  const categoryCount = Object.keys(CATEGORIES).length;
  document.getElementById("venue-name").textContent = VENUE.name;
  document.getElementById("venue-summary").textContent =
    `${SEATS.length} seats | ${ZONES.length} zones | ${categoryCount} price categories | ${available} currently available`;
}

function createLegendItem(swatchClass, text, color) {
  const item = document.createElement("li");
  item.className = "legend__item";

  const swatch = document.createElement("span");
  swatch.className = `legend__swatch ${swatchClass}`;
  if (color) swatch.style.backgroundColor = color;

  const label = document.createElement("span");
  label.textContent = text;

  item.append(swatch, label);
  return item;
}

function renderLegend() {
  const legend = document.getElementById("legend");
  legend.innerHTML = "";
  Object.values(CATEGORIES).forEach((category) => {
    legend.append(createLegendItem("", `${category.label} - ${formatPrice(category.price)}`, category.color));
  });
  legend.append(createLegendItem("legend__swatch--unavailable", "Unavailable"));
}

document.addEventListener("DOMContentLoaded", () => {
  const problems = validateVenue();
  if (problems.length > 0) {
    console.error("Venue data problems:", problems);
  } else {
    console.log(`Venue OK: ${SEATS.length} seats generated.`);
  }
  renderVenueSummary();
  renderLegend();
});