import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import "./App.css";
import { Form, Display, Controls } from "./components";

const progressDeltaMapper = {
  slow: 0.5,
  normal: 1,
  fast: 1.5,
  faster: 2,
};
const statusQuoteMaper = {
  start: "",
  half: "More than halfway there!",
  finish: "Time's up!",
};
const SECONDS_PER_MIN = 60;
const SECOND_IN_MILLISECONDS = 1000;

function prependZero(number) {
  if (number <= 9) return "0" + number;
  else return number;
}

function getSecondsFromMinutes(mins) {
  return mins * SECONDS_PER_MIN;
}
function getTimeFromSeconds(totalSeconds) {
  const minutes = Math.floor(
    (totalSeconds % (SECONDS_PER_MIN * SECONDS_PER_MIN)) / SECONDS_PER_MIN
  );
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MIN);
  return { minutes, seconds };
}

function calculatePercentage(value, total) {
  return (value / total) * 100;
}

function App() {
  const [counterTimeInSeconds, setCounterTimeInSeconds] = useState(0);
  const [playSpeed, setPlaySpeed] = useState("normal");
  const [isPause, setIsPause] = useState(false);
  const [progress, setProgress] = useState(100);
  const [counterStatus, setCounterStatus] = useState("start");

  let intervalRef = useRef();
  let totalTimeInSeconds = useRef();

  useEffect(() => {
    if (Math.floor(progress) < 50) {
      setCounterStatus("half");
    }
    if (progress === 0) {
      setCounterStatus("finish");
      clearInterval(intervalRef.current);
    }
  }, [progress]);

  useEffect(() => {
    const currentTimeInSeconds = counterTimeInSeconds;
    const currentProgressInPercentage = calculatePercentage(
      currentTimeInSeconds,
      totalTimeInSeconds.current
    );
    setProgress(currentProgressInPercentage);
  }, [counterTimeInSeconds]);

  const updateTimer = useCallback(() => {
    setCounterTimeInSeconds((prevTimeInSeconds) => {
      const newTimeInSeconds = prevTimeInSeconds
        ? prevTimeInSeconds - 1
        : prevTimeInSeconds;
      return newTimeInSeconds;
    });
  }, []);

  const onCounterStart = useCallback(
    (isNew = true, mins, speed = playSpeed) => {
      const frequency = progressDeltaMapper[speed];
      const intervalTimeInMilliSeconds = SECOND_IN_MILLISECONDS / frequency;
      const inputTimeInSeconds = getSecondsFromMinutes(mins);

      intervalRef.current && clearInterval(intervalRef.current);
      if (isNew) {
        totalTimeInSeconds.current = inputTimeInSeconds;
        setCounterStatus("start");
        setIsPause(false);
        setCounterTimeInSeconds(inputTimeInSeconds);
      }
      intervalRef.current = setInterval(() => {
        updateTimer();
      }, intervalTimeInMilliSeconds);
    },
    [updateTimer, playSpeed]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const formMinutesValue = e.target.minutes.value;
      formMinutesValue && onCounterStart(true, formMinutesValue);
    },
    [onCounterStart]
  );

  const onSpeedChange = useCallback(
    (speed) => {
      setPlaySpeed(speed);
      !isPause && onCounterStart(false, null, speed);
    },
    [onCounterStart, isPause]
  );

  const handlePause = useCallback(() => {
    if (isPause) {
      setIsPause(false);
      onCounterStart(false);
    } else {
      setIsPause(true);
      clearInterval(intervalRef.current);
    }
  }, [isPause, onCounterStart]);

  const time = useMemo(() => {
    return getTimeFromSeconds(counterTimeInSeconds);
  }, [counterTimeInSeconds]);

  return (
    <div className="countdown-wrapper">
      <div className="countdown">
        <Form onSubmit={handleSubmit} />
        <div className="countdown__body">
          {statusQuoteMaper[counterStatus] && (
            <blockquote className="countdown__quote bounceIn">
              {statusQuoteMaper[counterStatus]}
            </blockquote>
          )}
          <Display
            minutes={prependZero(time.minutes)}
            seconds={prependZero(time.seconds)}
            hasFlash={counterTimeInSeconds && counterTimeInSeconds <= 10}
            hasDanger={counterTimeInSeconds && counterTimeInSeconds < 20}
            isPause={isPause}
            onPauseToggle={handlePause}
          />
          <Controls onSelect={onSpeedChange} active={playSpeed} />
        </div>
      </div>
    </div>
  );
}

export default App;
