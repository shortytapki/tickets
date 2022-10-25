'use strict';

const fromSelect = document.querySelector('#route');
const wayback = document.querySelector('#wayback');
const waybackSelect = wayback.querySelector('select');
const timeSelect = document.querySelector('#time');
const numInput = document.querySelector('#num');
const now = new Date();
const offset = now.getTimezoneOffset();

const fromATOBMoscowTime = [
  '18:00',
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '21:00',
];

const fromBTOAMoscowTime = [
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '19:35',
  '21:50',
  '21:55',
];

const getTimeTemplates = () => {
  let fromTmpl = '';
  let backTmpl = '';

  const setTime = (option) => {
    const [moscowHours, mocowMinutes] = option.split(':');
    const userTime = +moscowHours * 60 + +mocowMinutes + 180 + offset;
    const hours = `${Math.floor(userTime / 60)}`.padStart(2, '0');
    const minutes = `${userTime % 60}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  fromATOBMoscowTime.forEach((option) => {
    fromTmpl += `<option value="${setTime(option)}(из A в B)">${setTime(
      option
    )}(из A в B)</option>`;
  });

  fromBTOAMoscowTime.forEach((option) => {
    backTmpl += `<option value="${setTime(option)}(из B в A)">${setTime(
      option
    )}(из B в A)</option>`;
  });

  timeSelect.innerHTML = fromTmpl;
  return { fromTmpl, backTmpl };
};

const { fromTmpl, backTmpl } = getTimeTemplates();

const renderBackOptions = () => {
  wayback.style.display = 'block';
  waybackSelect.innerHTML = backTmpl;
  waybackSelect.querySelectorAll('option').forEach((option) => {
    const [hours, minutes] = timeSelect.value.split('(').at(0).split(':');
    const minutesTotal = +hours * 60 + +minutes + 50;
    const [departureHours, departureMinutes] = option.value
      .split('(')
      .at(0)
      .split(':');
    const minutesTotalAtDeparture = +departureHours * 60 + +departureMinutes;
    if (minutesTotal >= minutesTotalAtDeparture)
      waybackSelect.removeChild(option);
  });
};
// Count total
document.querySelector('button').addEventListener('click', () => {
  const showArrivingTime = (departureTime) => {
    const [hours, minutes] = departureTime.split(':');
    const travelingTime = +hours * 60 + +minutes + 50;
    return `${Math.floor(travelingTime / 60)}:${String(
      travelingTime % 60
    ).padStart(2, '0')}`;
  };

  const tickets = +numInput.value;

  if (tickets) {
    const route = fromSelect.value;
    const price = route.includes('обратно') ? 1200 : 700;
    const departureTime = timeSelect.value.split('(').at(0);
    const tmplTotal = `Выбрано билетов: ${tickets} по маршруту ${route} общей стоимостью ${
      tickets * price
    }р.`;

    const tmplTime =
      price === 700
        ? `Это путешествие займет у вас 50 минут. Теплоход отправляется в ${departureTime}, а прибудет в ${showArrivingTime(
            departureTime
          )}.`
        : `Путешествие туда и обратно займёт у вас 50 минут. Теплоход отправляется из А в B в ${departureTime}, а прибудет в ${showArrivingTime(
            departureTime
          )}. Обратно в В теплоход отправляется в ${waybackSelect.value
            .split('(')
            .at(0)}, а прибудет в ${showArrivingTime(
            waybackSelect.value.split('(').at(0)
          )}.`;
    alert(tmplTotal + ' ' + tmplTime);
  }
});

timeSelect.addEventListener('change', () => {
  renderBackOptions();
});

//Re-render selects
fromSelect.addEventListener('change', (e) => {
  const routeOption = e.target.value;
  if (routeOption.includes('обратно')) {
    timeSelect.innerHTML = fromTmpl;
    renderBackOptions();
    return;
  }
  wayback.style.display = 'none';
  routeOption === 'из A в B'
    ? (timeSelect.innerHTML = fromTmpl)
    : (timeSelect.innerHTML = backTmpl);
});
