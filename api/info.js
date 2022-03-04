async function handler(req, resp) {
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  const response = await calculateResponse();

  resp.json(response);
}

async function calculateResponse() {
  let response = {
    days_until: 0,
    message: 'IT IS ARMA NIGHT DAY'
  };

  const day = new Date().getDay();

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

  await calculateCountdown(response);

  return response;
}

function nextDay(date, dayOfTheWeek) {
  date.setDate(date.getDate() + (dayOfTheWeek + (7 - date.getDay())) % 7);

  return date;
}

async function calculateCountdown(response) {
  let countdown = {};

  const nextThursday = nextDay(new Date(), 4);

  nextThursday.setHours(20, 0, 0);

  const now = new Date().getTime();

  const distance = nextThursday - now;

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

  countdown.countdown_text = (distance < 0) ?
    'SQUAD, ASSEMBLE!' :
    `Squad assembles in ${days}d ${hoursZeroPad}${hours}h ${minutesZeroPad}${minutes}m ${secondsZeroPad}${seconds}s`;

  response.countdown = countdown;

  return response;
}

export default handler;
