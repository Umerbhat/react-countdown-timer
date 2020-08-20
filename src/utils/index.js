export const SECONDS_PER_MIN = 60;
export const SECOND_IN_MILLISECONDS = 1000;

export function prependZero(number) {
  if (number <= 9) return "0" + number;
  else return number;
}

export function getSecondsFromMinutes(mins) {
  return mins * SECONDS_PER_MIN;
}
export function getTimeFromSeconds(totalSeconds) {
  const minutes = Math.floor(
    (totalSeconds % (SECONDS_PER_MIN * SECONDS_PER_MIN)) / SECONDS_PER_MIN
  );
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MIN);
  return { minutes, seconds };
}

export function calculatePercentage(value, total) {
  return (value / total) * 100;
}

export const progressDeltaMapper = {
  slow: 0.5,
  normal: 1,
  fast: 1.5,
  faster: 2,
};

export const statusQuoteMaper = {
  start: "",
  half: "More than halfway there!",
  finish: "Time's up!",
};
