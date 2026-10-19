const PORTS = {
  '포항(영일만)': { lat: 36.1118, lng: 129.4384 },
  '포항': { lat: 36.0432, lng: 129.3762 },
  '울릉(도동)': { lat: 37.4847, lng: 130.9126 },
  '울릉(사동)': { lat: 37.4551, lng: 130.8747 },
};

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
    start: [PORTS['포항(영일만)'].lat, PORTS['포항(영일만)'].lng],
    control: [36.74, 130.02],
    end: [PORTS['울릉(사동)'].lat, PORTS['울릉(사동)'].lng],
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
    start: [PORTS['포항'].lat, PORTS['포항'].lng],
    control: [36.73, 130.03],
    end: [PORTS['울릉(도동)'].lat, PORTS['울릉(도동)'].lng],
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
    start: [PORTS['울릉(사동)'].lat, PORTS['울릉(사동)'].lng],
    control: [36.74, 130.02],
    end: [PORTS['포항(영일만)'].lat, PORTS['포항(영일만)'].lng],
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
    start: [PORTS['울릉(도동)'].lat, PORTS['울릉(도동)'].lng],
    control: [36.73, 130.03],
    end: [PORTS['포항'].lat, PORTS['포항'].lng],
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

const WIND_DIRECTIONS = ['북동풍', '동북동풍', '동풍', '동남동풍', '남동풍'];

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
  const inverse = 1 - progress;
  const lat = inverse * inverse * route.start[0]
    + 2 * inverse * progress * route.control[0]
    + progress * progress * route.end[0];
  const lng = inverse * inverse * route.start[1]
    + 2 * inverse * progress * route.control[1]
    + progress * progress * route.end[1];
  return [round(lat, 5), round(lng, 5)];
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
    control: [...route.control],
    end: [...route.end],
  }));
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

export function buildFlowParticles(route, { phase = 0, count = 6 } = {}) {
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
