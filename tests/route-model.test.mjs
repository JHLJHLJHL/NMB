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
    [3.2, 4, 'face-slightly-frowning'],
    [3.21, 5, 'face-angry'],
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
