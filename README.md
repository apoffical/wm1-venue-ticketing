Interactive Venue Ticketing System
Web & Mobile I student project. A front-end ticket-selection website built with plain HTML, CSS and JavaScript (no backend).

Venue

Tiered auditorium with three seating blocks (left wing, center, right wing), rows A-L, 312 seats, 7 zones and 4 price categories.
VIP - $80
Premium - $60
Standard - $40
Economy - $25

Project Structure
index.html - page structure
css/styles.css - styles
js/data.js - venue data (blocks, zones, categories, unavailable seats)
js/model.js - builds and validates the seat model from the data
js/main.js - page start-up and rendering
js/state.js - application state and seat-state rules
js/render.js - draws the seat map and the seat details panel
js/cart.js - cart rules (add, remove, total) and localStorage saving / loading
js/viewport.js - map zoom, move and reset with limits

Progress:
started design, venue data model, and HTML/CSS skeleton
then generated seat map from data, four seat states, seat inspection (click shows details and price; nothing is added to the cart with just clicking)
later added zoom / move / reset controls with limits, explicit ADD TO CART, removal, duplicate prevention, total, map-cart synchronization, localStorage persistence
lastly made sure responsive layout (sticky seat bar on small screens), storage-blocked warning, manual test checklist, and bonus: mouse-wheel zoom and click-and-drag panning are added.

How it works:
clicking a seat only inspects it; the ADD TO CART button is the only way to add a ticket.
the cart is a list of seat IDs saved in localStorage and restored on page load. Unknown, repeated or unavailable IDs in the saved data are ignored.

Map controls: 
buttons: zoom in, zoom out, move up / down / left / right, reset / center view
mouse (bonus): wheel zooms around the cursor, click and drag pans. the buttons keep working.
touch screens use the buttons (one-finger drag is left to normal page scrolling).

Credits: 
layout inspired by a photo of a tiered auditorium (https://www.metalocus.es/sites/default/files/inline-images/metalocus_mecanoo_doris-duke-theatre_17.jpg) 