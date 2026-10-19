const PORTS = {
  '포항(영일만)': { lat: 36.1118, lng: 129.4384 },
  '포항': { lat: 36.0432, lng: 129.3762 },
  '울릉(도동)': { lat: 37.4847, lng: 130.9126 },
  '울릉(사동)': { lat: 37.4551, lng: 130.8747 },
};

// OpenStreetMap route=ferry ways 468120800 and 982307255 (ODbL).
// Keeping every mapped vertex makes the forecast line sit on the dashed ferry routes.
const POHANG_DODONG_PATH = [
  [36.05124, 129.378559],
  [36.050257, 129.378101],
  [36.046799, 129.382345],
  [36.044491, 129.385065],
  [36.044664, 129.386166],
  [36.047971, 129.391514],
  [36.052831, 129.400335],
  [36.058754, 129.41129],
  [36.064994, 129.422762],
  [36.068709, 129.429628],
  [36.071506, 129.434751],
  [36.081219, 129.452671],
  [36.102043, 129.49093],
  [36.150105, 129.557749],
  [36.205651, 129.635061],
  [36.279548, 129.73808],
  [36.338753, 129.820863],
  [36.379621, 129.877833],
  [36.463397, 129.994885],
  [36.521911, 130.07666],
  [36.558787, 130.128395],
  [36.574522, 130.15026],
  [36.619468, 130.190579],
  [36.695191, 130.258557],
  [36.789298, 130.343036],
  [36.868545, 130.414211],
  [37.060739, 130.587203],
  [37.123709, 130.64398],
  [37.190199, 130.702709],
  [37.215357, 130.723995],
  [37.270054, 130.770451],
  [37.416066, 130.88768],
  [37.43694, 130.898073],
  [37.475035, 130.912644],
  [37.475707, 130.912803],
  [37.476341, 130.912782],
  [37.477133, 130.912641],
  [37.477869, 130.91228],
  [37.47874, 130.91177],
  [37.479729, 130.910991],
  [37.480259, 130.910516],
  [37.480996, 130.910005],
];

const YEONGILMAN_SADONG_PATH = [
  [36.09599, 129.439667],
  [36.095814, 129.454104],
  [36.095485, 129.455735],
  [36.094843, 129.457237],
  [36.094046, 129.458138],
  [36.092971, 129.458739],
  [36.088913, 129.459469],
  [36.087474, 129.459962],
  [36.08626, 129.461057],
  [36.085671, 129.462623],
  [36.085649, 129.464812],
  [36.086377, 129.467698],
  [36.087591, 129.469829],
  [36.10509, 129.494402],
  [36.113082, 129.505174],
  [36.130726, 129.529635],
  [36.147639, 129.553153],
  [36.163059, 129.574589],
  [36.181351, 129.599802],
  [36.199569, 129.625186],
  [36.208936, 129.638404],
  [36.218994, 129.651944],
  [36.227165, 129.663531],
  [36.232704, 129.671492],
  [36.251412, 129.697434],
  [36.267174, 129.719622],
  [36.279041, 129.735844],
  [36.284283, 129.743375],
  [36.293674, 129.756486],
  [36.302269, 129.769082],
  [36.309584, 129.778609],
  [36.321669, 129.795603],
  [36.331143, 129.8091],
  [36.340529, 129.822168],
  [36.352057, 129.838111],
  [36.362373, 129.85238],
  [36.373068, 129.867551],
  [36.383814, 129.8824],
  [36.394368, 129.897441],
  [36.404973, 129.91214],
  [36.413314, 129.923491],
  [36.423829, 129.938318],
  [36.434482, 129.953553],
  [36.444994, 129.967629],
  [36.454988, 129.981641],
  [36.46536, 129.99619],
  [36.471727, 130.00503],
  [36.478267, 130.014472],
  [36.486841, 130.026381],
  [36.493811, 130.03638],
  [36.504074, 130.050714],
  [36.513491, 130.063889],
  [36.52489, 130.079703],
  [36.534459, 130.092899],
  [36.542648, 130.104315],
  [36.553698, 130.119829],
  [36.564005, 130.134291],
  [36.574862, 130.149333],
  [36.581634, 130.155384],
  [36.590903, 130.163881],
  [36.602446, 130.174288],
  [36.617534, 130.187721],
  [36.628883, 130.197055],
  [36.638509, 130.204758],
  [36.655776, 130.219886],
  [36.676121, 130.240635],
  [36.679528, 130.243833],
  [36.693604, 130.25587],
  [36.706817, 130.267071],
  [36.71774, 130.276835],
  [36.731928, 130.290095],
  [36.740423, 130.297777],
  [36.750396, 130.306382],
  [36.763702, 130.318183],
  [36.773603, 130.32726],
  [36.785668, 130.337667],
  [36.798023, 130.349383],
  [36.815134, 130.364768],
  [36.83894, 130.386226],
  [36.856798, 130.402383],
  [36.876111, 130.419828],
  [36.892965, 130.43487],
  [36.911874, 130.451757],
  [36.933214, 130.470941],
  [36.952696, 130.488321],
  [36.968813, 130.502955],
  [36.984875, 130.517525],
  [37.001705, 130.532631],
  [37.018411, 130.547609],
  [37.028844, 130.557029],
  [37.038453, 130.565977],
  [37.051196, 130.57677],
  [37.060306, 130.584387],
  [37.450914, 130.885443],
  [37.463505, 130.892637],
  [37.464305, 130.89276],
  [37.465126, 130.892443],
  [37.465841, 130.891341],
  [37.466043, 130.889892],
  [37.465931, 130.888218],
  [37.460465, 130.880235],
  [37.460564, 130.879188],
  [37.461306, 130.878093],
];

const ROUTES = [
  {
    id: 'yeongilman-sadong',
    from: '포항(영일만)',
    to: '울릉(사동)',
    departure: '23:00',
    arrival: '06:00',
    durationMinutes: 420,
    vessel: '뉴씨다오펄호',
    vesselType: '대형 카페리',
    operator: '울릉크루즈',
    operatorUrl: 'https://www.ulcruise.co.kr/',
    start: YEONGILMAN_SADONG_PATH[0],
    end: YEONGILMAN_SADONG_PATH.at(-1),
    path: YEONGILMAN_SADONG_PATH,
    weatherBias: 0.12,
  },
  {
    id: 'pohang-dodong',
    from: '포항',
    to: '울릉(도동)',
    departure: '09:50',
    arrival: '12:40',
    durationMinutes: 170,
    vessel: '엘도라도EX호',
    vesselType: '초쾌속선',
    operator: '대저페리',
    operatorUrl: 'https://www.daezer.com/',
    start: POHANG_DODONG_PATH[0],
    end: POHANG_DODONG_PATH.at(-1),
    path: POHANG_DODONG_PATH,
    weatherBias: 0.22,
  },
  {
    id: 'sadong-yeongilman',
    from: '울릉(사동)',
    to: '포항(영일만)',
    departure: '12:00',
    arrival: '18:30',
    durationMinutes: 390,
    vessel: '뉴씨다오펄호',
    vesselType: '대형 카페리',
    operator: '울릉크루즈',
    operatorUrl: 'https://www.ulcruise.co.kr/',
    start: YEONGILMAN_SADONG_PATH.at(-1),
    end: YEONGILMAN_SADONG_PATH[0],
    path: [...YEONGILMAN_SADONG_PATH].reverse(),
    weatherBias: 0.1,
  },
  {
    id: 'dodong-pohang',
    from: '울릉(도동)',
    to: '포항',
    departure: '14:20',
    arrival: '17:10',
    durationMinutes: 170,
    vessel: '엘도라도EX호',
    vesselType: '초쾌속선',
    operator: '대저페리',
    operatorUrl: 'https://www.daezer.com/',
    start: POHANG_DODONG_PATH.at(-1),
    end: POHANG_DODONG_PATH[0],
    path: [...POHANG_DODONG_PATH].reverse(),
    weatherBias: 0.2,
  },
];

const DAY_PROFILES = [
  { wave: 0.2, wind: 1.2, summary: '오후부터 높아짐', state: '주의' },
  { wave: -0.15, wind: -0.8, summary: '대체로 잔잔', state: '양호' },
  { wave: 0.05, wind: 0.4, summary: '중간 해역 주의', state: '주의' },
  { wave: 0.45, wind: 2.3, summary: '풍랑 가능성', state: '위험' },
  { wave: 0.18, wind: 1.1, summary: '예보 변동 가능', state: '주의' },
  { wave: -0.05, wind: -0.1, summary: '오전 비교적 양호', state: '양호' },
];

const WIND_DIRECTIONS = ['북풍', '북동풍', '동풍', '남동풍', '남풍', '남서풍', '서풍', '북서풍'];

function parseTime(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatRouteTime(startMinutes, offsetMinutes) {
  const total = startMinutes + Math.round(offsetMinutes);
  const dayOffset = Math.floor(total / 1440);
  const minuteOfDay = ((total % 1440) + 1440) % 1440;
  const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, '0');
  const minutes = String(minuteOfDay % 60).padStart(2, '0');
  return `${dayOffset > 0 ? '다음날 ' : ''}${hours}:${minutes}`;
}

function round(value, digits = 1) {
  const power = 10 ** digits;
  return Math.round(value * power) / power;
}

function interpolatePosition(route, progress) {
  const path = route.path?.length > 1 ? route.path : [route.start, route.end];
  const clampedProgress = Math.min(1, Math.max(0, Number(progress) || 0));
  const segments = path.slice(1).map((point, index) => {
    const previous = path[index];
    const meanLatitude = ((previous[0] + point[0]) / 2) * Math.PI / 180;
    return Math.hypot(
      point[0] - previous[0],
      (point[1] - previous[1]) * Math.cos(meanLatitude),
    );
  });
  const totalDistance = segments.reduce((sum, length) => sum + length, 0);
  const targetDistance = totalDistance * clampedProgress;
  let distance = 0;

  for (let index = 0; index < segments.length; index += 1) {
    const segmentLength = segments[index];
    if (distance + segmentLength >= targetDistance || index === segments.length - 1) {
      const localProgress = segmentLength === 0
        ? 0
        : (targetDistance - distance) / segmentLength;
      const start = path[index];
      const end = path[index + 1];
      return [
        round(start[0] + (end[0] - start[0]) * localProgress, 6),
        round(start[1] + (end[1] - start[1]) * localProgress, 6),
      ];
    }
    distance += segmentLength;
  }

  return [...route.end];
}

function sampleWeather(route, progress, dayIndex) {
  const profile = DAY_PROFILES[dayIndex] ?? DAY_PROFILES.at(-1);
  const openSea = Math.sin(Math.PI * progress);
  const ripple = Math.sin((progress + route.weatherBias) * Math.PI * 3) * 0.12;
  const waveHeight = Math.max(0.4, 0.7 + profile.wave + openSea * 0.82 + ripple);
  const windSpeed = Math.max(2.5, 4.6 + profile.wind + openSea * 3.9 + ripple * 2.2);
  const directionIndex = Math.min(
    WIND_DIRECTIONS.length - 1,
    Math.floor(progress * WIND_DIRECTIONS.length),
  );
  return {
    waveHeight: round(waveHeight),
    windSpeed: round(windSpeed),
    windDirection: WIND_DIRECTIONS[directionIndex],
  };
}

export function getRouteCatalog() {
  return ROUTES.map((route) => ({
    ...route,
    start: [...route.start],
    end: [...route.end],
    path: route.path.map((position) => [...position]),
  }));
}

export function getRouteMarkerLayout(compact = false) {
  return compact
    ? { iconSize: [30, 36], iconAnchor: [15, 35] }
    : { iconSize: [36, 44], iconAnchor: [18, 43] };
}

export function getZoomControlState({ zoom, minZoom, maxZoom }) {
  return {
    zoomInDisabled: zoom >= maxZoom,
    zoomOutDisabled: zoom <= minZoom,
  };
}

export function getWindDirectionRotation(direction) {
  const index = WIND_DIRECTIONS.indexOf(direction);
  return index < 0 ? 0 : index * 45;
}

export function buildRoutePoints(route, { expanded = false, dayIndex = 0 } = {}) {
  const offsets = expanded
    ? Array.from(
      new Set([
        ...Array.from(
          { length: Math.floor(route.durationMinutes / 30) + 1 },
          (_, index) => index * 30,
        ),
        route.durationMinutes,
      ]),
    ).sort((a, b) => a - b)
    : [0, 0.25, 0.5, 0.75, 1].map((progress) => route.durationMinutes * progress);

  const startMinutes = parseTime(route.departure);
  return offsets.map((minutesFromStart, index) => {
    const progress = minutesFromStart / route.durationMinutes;
    const weather = sampleWeather(route, progress, dayIndex);
    const isEndpoint = index === 0 || index === offsets.length - 1;
    return {
      id: `${route.id}-${dayIndex}-${index}`,
      progress,
      minutesFromStart: Math.round(minutesFromStart),
      time: formatRouteTime(startMinutes, minutesFromStart),
      position: interpolatePosition(route, progress),
      isEndpoint,
      label: index === 0 ? route.from : index === offsets.length - 1 ? route.to : `항로 ${index}`,
      ...weather,
    };
  });
}

export function buildFlowParticles(route, { phase = 0, count = 1 } = {}) {
  const safeCount = Math.max(1, Math.floor(Number(count) || 1));
  const normalizedPhase = ((Number(phase) || 0) % 1 + 1) % 1;
  return Array.from({ length: safeCount }, (_, index) => {
    const progress = round((normalizedPhase + index / safeCount) % 1, 6);
    return {
      progress,
      position: interpolatePosition(route, progress),
    };
  });
}

export function buildForecastDays(baseDate = new Date()) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(baseDate.getTime());
    date.setDate(date.getDate() + index);
    return {
      index,
      label: index === 0 ? '오늘' : index === 1 ? '내일' : `${weekdays[date.getDay()]}요일`,
      date: `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`,
      precision: index < 3 ? '상세' : '전망',
      ...DAY_PROFILES[index],
    };
  });
}

const MOTION_SICKNESS_LEVELS = [
  { max: 0.8, level: 1, label: '편안', icon: 'face-grinning', color: '#0a9b83' },
  { max: 1.6, level: 2, label: '괜찮음', icon: 'face-slightly-smiling', color: '#71ad45' },
  { max: 2.4, level: 3, label: '주의', icon: 'face-neutral', color: '#e2a934' },
  { max: 3.2, exclusive: true, level: 4, label: '힘듦', icon: 'face-slightly-frowning', color: '#e57838' },
  { max: Number.POSITIVE_INFINITY, level: 5, label: '매우 힘듦', icon: 'face-angry', color: '#d84949' },
];

export function getMotionSicknessLevel(waveHeight) {
  const safeWaveHeight = Math.max(0, Number(waveHeight) || 0);
  return {
    ...MOTION_SICKNESS_LEVELS.find(({ max, exclusive }) => (
      exclusive ? safeWaveHeight < max : safeWaveHeight <= max
    )),
  };
}
