import test from 'node:test';
import assert from 'node:assert/strict';

const model = await import('../dist/app-data.mjs').catch(() => ({}));

test('route catalog exposes the four requested sailings with the correct vessels', () => {
  assert.equal(typeof model.getRouteCatalog, 'function');
  const routes = model.getRouteCatalog();

  assert.equal(routes.length, 4);
  assert.deepEqual(
    routes.map(({ from, to, departure, arrival, vessel }) => ({ from, to, departure, arrival, vessel })),
    [
      { from: '포항(영일만)', to: '울릉(사동)', departure: '23:00', arrival: '06:00', vessel: '뉴씨다오펄호' },
      { from: '포항', to: '울릉(도동)', departure: '09:50', arrival: '12:40', vessel: '엘도라도EX호' },
      { from: '울릉(사동)', to: '포항(영일만)', departure: '12:00', arrival: '18:30', vessel: '뉴씨다오펄호' },
      { from: '울릉(도동)', to: '포항', departure: '14:20', arrival: '17:10', vessel: '엘도라도EX호' },
    ],
  );
});

test('base map always returns exactly five points including departure and arrival', () => {
  assert.equal(typeof model.buildRoutePoints, 'function');
  const route = model.getRouteCatalog()[1];
  const points = model.buildRoutePoints(route, { expanded: false, dayIndex: 0 });

  assert.equal(points.length, 5);
  assert.equal(points[0].time, '09:50');
  assert.equal(points.at(-1).time, '12:40');
  assert.deepEqual(points[0].position, route.start);
  assert.deepEqual(points.at(-1).position, route.end);
});

test('overnight route marks arrival as next day and preserves the final time', () => {
  const route = model.getRouteCatalog()[0];
  const points = model.buildRoutePoints(route, { expanded: false, dayIndex: 0 });

  assert.equal(points.length, 5);
  assert.equal(points.at(-1).time, '다음날 06:00');
  assert.equal(points.at(-1).minutesFromStart, 420);
});

test('manual departure time preserves sailing duration and calculates arrival', () => {
  assert.equal(typeof model.getRouteSchedule, 'function');
  const daytimeRoute = model.getRouteCatalog()[1];
  const overnightRoute = model.getRouteCatalog()[0];

  assert.deepEqual(model.getRouteSchedule(daytimeRoute, '10:30'), {
    departure: '10:30',
    arrival: '13:20',
    durationMinutes: 170,
  });
  assert.deepEqual(model.getRouteSchedule(overnightRoute, '23:30'), {
    departure: '23:30',
    arrival: '다음날 06:30',
    durationMinutes: 420,
  });
});

test('changing departure time updates point times and weather samples', () => {
  const route = model.getRouteCatalog()[1];
  const morning = model.buildRoutePoints(route, { departureTime: '06:00', dayIndex: 0 });
  const afternoon = model.buildRoutePoints(route, { departureTime: '15:00', dayIndex: 0 });

  assert.equal(morning[0].time, '06:00');
  assert.equal(morning.at(-1).time, '08:50');
  assert.equal(afternoon[0].time, '15:00');
  assert.equal(afternoon.at(-1).time, '17:50');
  assert.notEqual(morning[2].windSpeed, afternoon[2].windSpeed);
  assert.notEqual(morning[2].waveHeight, afternoon[2].waveHeight);
});

test('expanded map adds half-hour route points without removing endpoints', () => {
  const route = model.getRouteCatalog()[2];
  const base = model.buildRoutePoints(route, { expanded: false, dayIndex: 0 });
  const expanded = model.buildRoutePoints(route, { expanded: true, dayIndex: 0 });

  assert.equal(base.length, 5);
  assert.ok(expanded.length > base.length);
  assert.equal(expanded[0].time, '12:00');
  assert.equal(expanded.at(-1).time, '18:30');
});

test('forecast calendar provides six days and lowers precision after day three', () => {
  assert.equal(typeof model.buildForecastDays, 'function');
  const days = model.buildForecastDays(new Date('2026-10-19T00:00:00+09:00'));

  assert.equal(days.length, 6);
  assert.deepEqual(days.map((day) => day.precision), ['상세', '상세', '상세', '전망', '전망', '전망']);
  assert.equal(days[0].label, '오늘');
  assert.equal(days[5].date, '10.24');
});

test('every generated point contains time, wave height, wind speed and wind direction', () => {
  const points = model.buildRoutePoints(model.getRouteCatalog()[3], { expanded: false, dayIndex: 2 });

  for (const point of points) {
    assert.match(point.time, /\d{2}:\d{2}/);
    assert.ok(point.waveHeight > 0);
    assert.ok(point.windSpeed > 0);
    assert.match(point.windDirection, /풍$/);
  }
});

test('eight wind directions map to arrow rotations in 45 degree steps', () => {
  assert.equal(typeof model.getWindDirectionRotation, 'function');
  assert.deepEqual(
    ['북풍', '북동풍', '동풍', '남동풍', '남풍', '남서풍', '서풍', '북서풍']
      .map((direction) => model.getWindDirectionRotation(direction)),
    [0, 45, 90, 135, 180, 225, 270, 315],
  );
});

test('wave height maps to five Lucide face-based motion sickness levels', () => {
  assert.equal(typeof model.getMotionSicknessLevel, 'function');
  const cases = [
    [0, 1, 'face-grinning'],
    [0.8, 1, 'face-grinning'],
    [0.81, 2, 'face-slightly-smiling'],
    [1.6, 2, 'face-slightly-smiling'],
    [1.61, 3, 'face-neutral'],
    [2.4, 3, 'face-neutral'],
    [2.41, 4, 'face-slightly-frowning'],
    [3.19, 4, 'face-slightly-frowning'],
    [3.2, 5, 'face-angry'],
    [3.5, 5, 'face-angry'],
  ];

  for (const [waveHeight, level, icon] of cases) {
    assert.deepEqual(
      { level: model.getMotionSicknessLevel(waveHeight).level, icon: model.getMotionSicknessLevel(waveHeight).icon },
      { level, icon },
    );
  }
});

test('every route links to its official ferry operator', () => {
  const routes = model.getRouteCatalog();
  assert.deepEqual(
    routes.map(({ vessel, operator, operatorUrl }) => ({ vessel, operator, operatorUrl })),
    [
      { vessel: '뉴씨다오펄호', operator: '울릉크루즈', operatorUrl: 'https://www.ulcruise.co.kr/' },
      { vessel: '엘도라도EX호', operator: '대저페리', operatorUrl: 'https://www.daezer.com/' },
      { vessel: '뉴씨다오펄호', operator: '울릉크루즈', operatorUrl: 'https://www.ulcruise.co.kr/' },
      { vessel: '엘도라도EX호', operator: '대저페리', operatorUrl: 'https://www.daezer.com/' },
    ],
  );
});

test('flow particles advance from departure toward arrival and wrap continuously', () => {
  assert.equal(typeof model.buildFlowParticles, 'function');
  const route = model.getRouteCatalog()[1];
  const start = model.buildFlowParticles(route, { phase: 0, count: 4 });
  const later = model.buildFlowParticles(route, { phase: 0.1, count: 4 });

  assert.equal(start.length, 4);
  assert.deepEqual(start[0].position, route.start);
  assert.ok(later[0].progress > start[0].progress);
  assert.deepEqual(start.map(({ progress }) => progress), [0, 0.25, 0.5, 0.75]);
  assert.deepEqual(
    model.buildFlowParticles(route, { phase: 0.9, count: 4 }).map(({ progress }) => progress),
    [0.9, 0.15, 0.4, 0.65],
  );
});

test('route flow defaults to one particle that traverses the full route', () => {
  const route = model.getRouteCatalog()[0];
  const departure = model.buildFlowParticles(route, { phase: 0 });
  const nearArrival = model.buildFlowParticles(route, { phase: 0.99 });

  assert.equal(departure.length, 1);
  assert.deepEqual(departure[0].position, route.start);
  assert.equal(nearArrival.length, 1);
  assert.equal(nearArrival[0].progress, 0.99);
  assert.notDeepEqual(nearArrival[0].position, route.start);
});

test('routes follow the mapped OpenStreetMap ferry ways in both directions', () => {
  const [yeongilmanToSadong, pohangToDodong, sadongToYeongilman, dodongToPohang] = model.getRouteCatalog();

  assert.equal(yeongilmanToSadong.path.length, 103);
  assert.equal(pohangToDodong.path.length, 42);
  assert.deepEqual(yeongilmanToSadong.path[0], yeongilmanToSadong.start);
  assert.deepEqual(yeongilmanToSadong.path.at(-1), yeongilmanToSadong.end);
  assert.deepEqual(pohangToDodong.path[0], pohangToDodong.start);
  assert.deepEqual(pohangToDodong.path.at(-1), pohangToDodong.end);
  assert.deepEqual(sadongToYeongilman.path, [...yeongilmanToSadong.path].reverse());
  assert.deepEqual(dodongToPohang.path, [...pohangToDodong.path].reverse());
});

test('route interpolation follows cumulative mapped path distance', () => {
  const route = model.getRouteCatalog()[1];
  const midpoint = model.buildFlowParticles(route, { phase: 0.5 })[0].position;

  assert.ok(midpoint[0] > 36.61 && midpoint[0] < 36.71);
  assert.ok(midpoint[1] > 130.18 && midpoint[1] < 130.29);
});

test('both marker sizes keep a pointed pin anchored by its tip', () => {
  assert.equal(typeof model.getRouteMarkerLayout, 'function');
  assert.deepEqual(model.getRouteMarkerLayout(false), {
    iconSize: [36, 44],
    iconAnchor: [18, 43],
  });
  assert.deepEqual(model.getRouteMarkerLayout(true), {
    iconSize: [30, 36],
    iconAnchor: [15, 35],
  });
});

test('zoom controls disable only at the fitted minimum and map maximum', () => {
  assert.equal(typeof model.getZoomControlState, 'function');
  assert.deepEqual(model.getZoomControlState({ zoom: 7, minZoom: 7, maxZoom: 12 }), {
    zoomInDisabled: false,
    zoomOutDisabled: true,
  });
  assert.deepEqual(model.getZoomControlState({ zoom: 9, minZoom: 7, maxZoom: 12 }), {
    zoomInDisabled: false,
    zoomOutDisabled: false,
  });
  assert.deepEqual(model.getZoomControlState({ zoom: 12, minZoom: 7, maxZoom: 12 }), {
    zoomInDisabled: true,
    zoomOutDisabled: false,
  });
});
