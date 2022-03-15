const axios = require('axios').default;

async function handler(req, resp) {
  const weatherApiKey = process.env.OPENSKY_API_KEY || '';
  let response = {};

  await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=39.7707286&lon=-86.0703977&appid=${weatherApiKey}&units=imperial`
  )
  .then((json) => {
    let utc_offset = json.data.timezone / 3600;
    const client_date = new Date();
    const utc = client_date.getTime() + client_date.getTimezoneOffset() * 60000;
    const server_date = new Date(utc + 3600000 * utc_offset);

    calculateResponse(server_date, response);
    calculateCountdown(server_date, response);
  });

  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  resp.json(response);
}

function calculateResponse(today, response) {
  const day = today.getDay();

  if (day === 4) {
    response.days_until = 0;
    response.message = 'IT IS ARMA NIGHT DAY';
  } else if (day === 3) {
    response.days_until = 1;
    response.message = 'IT IS ARMA NIGHT DAY EVE';
  } else if (day !== 4) {
    const days = (4 + (7 - day)) % 7;

    response.days_until = days;
    response.message = `${days} DAYS UNTIL ARMA NIGHT DAY`;
  }

  return response;
}

function nextDay(date, dayOfTheWeek) {
  date.setDate(date.getDate() + (dayOfTheWeek + (7 - date.getDay())) % 7);

  return date;
}

async function calculateCountdown(today, response) {
  let countdown = {};

  const copyOfToday = new Date(today.getTime());

  let nextThursday = nextDay(today, 4);
  nextThursday.setHours(20, 0, 0);

  const distance = nextThursday - (copyOfToday.getTime());

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let hoursZeroPad = (hours < 10) ? '0' : '';
  let minutesZeroPad = (minutes < 10) ? '0' : '';
  let secondsZeroPad = (seconds < 10) ? '0' : '';

  countdown.days = days;
  countdown.hours = hours;
  countdown.hours_display = `${hoursZeroPad}${hours}h`;
  countdown.minutes = minutes;
  countdown.minutes_display = `${minutesZeroPad}${minutes}m`;
  countdown.seconds = seconds;
  countdown.seconds_display = `${secondsZeroPad}${seconds}s`;

  countdown.countdown_text = (distance < 0)
    ? 'SQUAD, ASSEMBLE!'
    : `Squad assembles in ${days}d ${hoursZeroPad}${hours}h ${minutesZeroPad}${minutes}m ${secondsZeroPad}${seconds}s`;

  response.countdown = countdown;

  return response;
}

export default handler;
