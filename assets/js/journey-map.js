(function() {
  if (typeof L === 'undefined') return; // Leaflet not loaded

  const journey = [
    { period: 'Birth–2012', label: 'Growing up', place: 'Palma Campania, Italy', coords: [40.83, 14.43] },
    { period: '2013–2018', label: 'BSc & MSc Mechanical Eng.', place: 'Politecnico Di Milano', coords: [45.478, 9.227] },
    { period: '2018', label: 'MSc Thesis (Robotics)', place: 'TU Eindhoven', coords: [51.448, 5.489] },
    { period: '2019–2022', label: 'PhD Robotics', place: 'TU Delft', coords: [51.999, 4.373] },
    { period: 'Sep 2022–Feb 2023', label: 'Visiting Researcher', place: 'UCL, London', coords: [51.524, -0.133] },
    { period: '2023–2024', label: 'PhD completion & PostDoc', place: 'TU Delft', coords: [51.999, 4.373] },
    { period: '2025–Present', label: 'Senior Researcher ', place: 'Technology Innovation Institute', coords: [24.4539, 54.3773] }
  ];

  /**
   * Build a journey map instance.
   * @param {Object} opts
   *  - id: container id
   *  - legendId: optional legend container id
   *  - animate: true/false for segment animation
   *  - size: 'full' | 'mini'
   */
  function buildJourneyMap(opts) {
    const cfg = Object.assign({ animate: true, size: 'full' }, opts || {});
    const mapEl = document.getElementById(cfg.id);
    if (!mapEl) return;

    function setHeight() {
      if (cfg.size === 'mini') {
        mapEl.style.height = '230px';
      } else {
        mapEl.style.height = (window.innerWidth < 600) ? '380px' : '480px';
      }
    }
    setHeight();
    if (cfg.size !== 'mini') window.addEventListener('resize', setHeight);

    const map = L.map(cfg.id, { scrollWheelZoom: cfg.size !== 'mini', attributionControl: true, dragging: true, zoomControl: cfg.size !== 'mini' });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 8,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const coords = journey.map(j => j.coords);
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds.pad(cfg.size === 'mini' ? 0.15 : 0.3));

    const markers = [];
    journey.forEach((j, idx) => {
      const m = L.circleMarker(j.coords, {
        radius: cfg.size === 'mini' ? 4 : 6,
        color: '#0d47a1',
        weight: 2,
        fillColor: '#42a5f5',
        fillOpacity: 0.85
      }).addTo(map);
      if (cfg.size !== 'mini') {
        m.bindPopup(`<strong>${idx + 1}. ${j.place}</strong><br>${j.label}<br><em>${j.period}</em>`);
      } else {
        m.bindTooltip(`${idx + 1}`, { permanent: false, direction: 'top', opacity: 0.8 });
      }
      markers.push(m);
    });

    const lineColor = '#ff6f00';
    const segments = [];

    function addSegment(i) {
      const from = journey[i].coords;
      const to = journey[i + 1].coords;
      const poly = L.polyline([from, to], { color: lineColor, weight: cfg.size === 'mini' ? 2 : 3, opacity: 0.9, lineCap: 'round' }).addTo(map);
      if (L.polylineDecorator) {
        L.polylineDecorator(poly, { patterns: [{ offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: cfg.size === 'mini' ? 8 : 12, polygon: false, pathOptions: { stroke: true, color: lineColor, weight: 2 } }) }] });
      }
      segments.push(poly);
    }

    if (cfg.animate && cfg.size !== 'mini') {
      let idx = 0;
      function step() {
        if (idx >= journey.length - 1) return;
        addSegment(idx);
        pulseMarker(markers[idx + 1]);
        idx++;
        setTimeout(step, 1200);
      }
      step();
    } else {
      // Draw all at once
      for (let i = 0; i < journey.length - 1; i++) addSegment(i);
    }

    if (cfg.legendId) {
      const legendEl = document.getElementById(cfg.legendId);
      if (legendEl) {
        legendEl.innerHTML = (cfg.size === 'mini' ? '<strong>Journey</strong>' : '<h3>Timeline</h3>') + journey.map((j,i) => `<div class="j-item"><span class="idx">${i+1}</span><span class="p">${j.period}</span> <span class="l">${j.place}</span></div>`).join('');
      }
    }
  }

  function pulseMarker(marker) {
    const el = marker.getElement();
    if (!el) return;
    el.classList.add('journey-pulse');
    setTimeout(() => el.classList.remove('journey-pulse'), 1600);
  }

  // Auto-init full page map if present
  if (document.getElementById('journey-map')) {
    buildJourneyMap({ id: 'journey-map', legendId: 'journey-legend', animate: true, size: 'full' });
  }
  // Auto-init mini map if present
  if (document.getElementById('journey-map-mini')) {
    buildJourneyMap({ id: 'journey-map-mini', legendId: 'journey-legend-mini', animate: false, size: 'mini' });
  }
})();
