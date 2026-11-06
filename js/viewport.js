const MAX_SCALE = 3;       
const MIN_FIT_RATIO = 0.6;  
const MAX_FIT_SCALE = 2;    
const ZOOM_FACTOR = 1.25;   
const PAN_STEP = 80;        
const PAN_SLACK = 0.5;   
const DRAG_THRESHOLD = 5; 

const view = { scale: 1, x: 0, y: 0, isFit: true };

const MOVES = {
  "move-up": { dx: 0, dy: PAN_STEP },
  "move-down": { dx: 0, dy: -PAN_STEP },
  "move-left": { dx: PAN_STEP, dy: 0 },
  "move-right": { dx: -PAN_STEP, dy: 0 }
};

function mapElements() {
  return {
    viewport: document.getElementById("map-viewport"),
    canvas: document.getElementById("map-canvas")
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getFitScale() {
  const { viewport, canvas } = mapElements();
  if (!canvas.offsetWidth || !canvas.offsetHeight) return 1;
  return Math.min(
    viewport.clientWidth / canvas.offsetWidth,
    viewport.clientHeight / canvas.offsetHeight,
    MAX_FIT_SCALE
  );
}

function getMinScale() {
  return getFitScale() * MIN_FIT_RATIO;
}

function clampPosition(x, y, scale) {
  const { viewport, canvas } = mapElements();
  const slackX = viewport.clientWidth * PAN_SLACK;
  const slackY = viewport.clientHeight * PAN_SLACK;
  const minX = viewport.clientWidth - canvas.offsetWidth * scale - slackX;
  const minY = viewport.clientHeight - canvas.offsetHeight * scale - slackY;
  return { x: clamp(x, minX, slackX), y: clamp(y, minY, slackY) };
}

function setLimit(action, atLimit) {
  const button = document.querySelector(`[data-action="${action}"]`);
  if (!button) return;
  button.setAttribute("aria-disabled", String(atLimit));
  button.classList.toggle("is-limit", atLimit);
}

function updateMapControls() {
  setLimit("zoom-in", view.scale >= MAX_SCALE - 0.001);
  setLimit("zoom-out", view.scale <= getMinScale() + 0.001);
  Object.entries(MOVES).forEach(([action, move]) => {
    const next = clampPosition(view.x + move.dx, view.y + move.dy, view.scale);
    setLimit(action, Math.abs(next.x - view.x) < 0.5 && Math.abs(next.y - view.y) < 0.5);
  });
}

function applyView() {
  view.scale = clamp(view.scale, getMinScale(), MAX_SCALE);
  const position = clampPosition(view.x, view.y, view.scale);
  view.x = position.x;
  view.y = position.y;
  mapElements().canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  updateMapControls();
}

function zoomAt(factor, pointX, pointY) {
  const newScale = clamp(view.scale * factor, getMinScale(), MAX_SCALE);
  const ratio = newScale / view.scale;
  view.x = pointX - (pointX - view.x) * ratio;
  view.y = pointY - (pointY - view.y) * ratio;
  view.scale = newScale;
  view.isFit = false;
  applyView();
}

function zoomBy(factor) {
  const { viewport } = mapElements();
  zoomAt(factor, viewport.clientWidth / 2, viewport.clientHeight / 2);
}

function moveBy(dx, dy) {
  view.x += dx;
  view.y += dy;
  view.isFit = false;
  applyView();
}

function resetView() {
  const { viewport, canvas } = mapElements();
  const fit = getFitScale();
  view.scale = fit;
  view.x = (viewport.clientWidth - canvas.offsetWidth * fit) / 2;
  view.y = (viewport.clientHeight - canvas.offsetHeight * fit) / 2;
  view.isFit = true;
  applyView();
}

function initMapControls() {
  document.querySelector(".map-toolbar").addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "zoom-in") zoomBy(ZOOM_FACTOR);
    else if (action === "zoom-out") zoomBy(1 / ZOOM_FACTOR);
    else if (action === "reset-view") resetView();
    else if (MOVES[action]) moveBy(MOVES[action].dx, MOVES[action].dy);
  });
   window.addEventListener("resize", () => {
    if (view.isFit) resetView();
    else applyView();
  });
  window.addEventListener("load", () => {
    if (view.isFit) resetView();
  });
    resetView();
  requestAnimationFrame(() => mapElements().canvas.classList.add("is-ready"));
}

function viewportPoint(event) {
  const { viewport } = mapElements();
  const rect = viewport.getBoundingClientRect();
  return {
    x: event.clientX - rect.left - viewport.clientLeft,
    y: event.clientY - rect.top - viewport.clientTop
  };
}

function initMouseNavigation() {
  const { viewport } = mapElements();
  let drag = null;          
  let suppressClick = false; 

  viewport.addEventListener("wheel", (event) => {
    event.preventDefault(); 
    const lineHeight = event.deltaMode === 1 ? 16 : 1;
    const factor = Math.exp(-event.deltaY * lineHeight * 0.0015);
    const point = viewportPoint(event);
    zoomAt(factor, point.x, point.y);
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.pointerType === "touch") return;
    drag = { startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y, active: false };
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return; 
      drag.active = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
    }
    view.x = drag.originX + dx;
    view.y = drag.originY + dy;
    view.isFit = false;
    applyView();
  });

  function endDrag() {
    if (drag && drag.active) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      viewport.classList.remove("is-dragging");
    }
    drag = null;
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  viewport.addEventListener("click", (event) => {
    if (suppressClick) {
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);
}