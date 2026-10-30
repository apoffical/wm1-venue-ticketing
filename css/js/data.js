const VENUE ={
    name: "Cedar Hall Auditorium",
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
};

function rowRange(from,to) {
    return VENUE.rows.slice(VENUE.rows.indexOf(from), VENUE.rows.indexOf(to) + 1);
}

const CATEGORIES = {
    vip: {id: "vip", label: "VIP", price: 80, color: "#e0a800"},
    premium: {id: "premium", label: "Premium", price: 60, color: "#d1365f"},
    standard: {id: "standard", label: "Standard", price: 40, color: "#2f78d6"},
    economy: {id: "economy", label: "Economy", price: 25, color: "#2fae6c"}
};

const BLOCKS = {
    left: {code: "L", label: "Left Wing", seatsPerRow: 6},
    center: {code: "C", label: "Center Block", seatsPerRow: 14},
    right: {code: "R", label: "Right Wing", seatsPerRow: 6}
};

const ZONES = [
    { id: "vip-center", name: "VIP Center", block: "center", category: "vip", rows: rowRange("A", "C") },
    { id: "premium-center", name: "Premium Center", block: "center", category: "premium", rows: rowRange("D", "G") },
    { id: "standard-center", name: "Standard Center", block: "center", category: "standard", rows: rowRange("H", "L") },
    { id: "standard-left", name: "Left Standard", block: "left", category: "standard", rows: rowRange("A", "F") },
    { id: "economy-left", name: "Left Economy", block: "left", category: "economy", rows: rowRange("G", "L") },
    { id: "standard-right", name: "Right Standard", block: "right", category: "standard", rows: rowRange("A", "F") },
    { id: "economy-right", name: "Right Economy", block: "right", category: "economy", rows: rowRange("G", "L") }
];

const UNAVAILABLE_SEATS = [
  "C-A07", "C-A11", "C-C07", "C-D02", "C-D11", "C-D12", "C-E02", "C-E03",
  "C-E07", "C-F11", "C-G02", "C-H10", "C-H11", "C-L02",
  "L-B01", "L-B03", "L-B05", "L-D04", "L-F04", "L-F05", "L-J03", "L-L05",
  "R-C02", "R-C05"
];