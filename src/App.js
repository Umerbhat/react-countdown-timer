import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import "./App.css";
import { Form, Display, Controls } from "./components";

const playSpeedMapper = {
  slow: 2000,
  normal: 1000,
  fast: 750,
  faster: 500,
};

const progressDeltaMapper = {
  slow: 500,
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

function getSecondsFromMinutes(mins) {
  return mins * 60;
}
function getTimeFromSeconds(totalSeconds) {
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { minutes, seconds };
}
function getSecondsFromTime({ minutes = 0, seconds }) {
  const minutesIntoSeconds = minutes * 60;
  return minutesIntoSeconds + seconds;
}
function calculatePercentage(value, total) {
  return (value / total) * 100;
}

function App() {
  const [counterTime, setCounterTime] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [playSpeed, setPlaySpeed] = useState("normal");
  const [isPause, setIsPause] = useState(false);
  const [progress, setProgress] = useState(100);
  const [counterStatus, setCounterStatus] = useState("start");

  let intervalRef = useRef();
  let totalTimeInSeconds = useRef();
  

  useEffect(() => {
    console.log(progress, "progressprogress");
    if (Math.floor(progress) < 50) {
      setCounterStatus("half");
    }
    if (progress === 0) {
      setCounterStatus("finish");
      clearInterval(intervalRef.current);
    }
  }, [progress]);

  useEffect(() => {
    const minutes = counterTime.minutes;
    const seconds = counterTime.seconds;
    const currentTimeInSeconds = getSecondsFromTime({ minutes, seconds });
    console.log(currentTimeInSeconds, totalTimeInSeconds.current, "ttttt")
    const currentProgressInPercentage =
      calculatePercentage(currentTimeInSeconds, totalTimeInSeconds.current);
      setProgress(currentProgressInPercentage);
  }, [counterTime.minutes, counterTime.seconds]);

  const prependZero = useCallback((number) => {
    if (number <= 9) return "0" + number;
    else return number;
  }, []);

  const updateTimer = useCallback(() => {
    setCounterTime((prevTime) => {
      const prevTimeInSeconds = getSecondsFromTime(prevTime);
      const newTimeInSeconds = prevTimeInSeconds - 1;
      const newState = getTimeFromSeconds(newTimeInSeconds)
      console.log(prevTime, "cc")
      return {...prevTime, ...newState};
    });
  }, []);

  const onCounterStart = useCallback(
    (isNew = true, mins, speed = playSpeed) => {
      const frequency = progressDeltaMapper[speed];
      const intervalTimeInMilliSeconds = SECOND_IN_MILLISECONDS / frequency;
      // const deltaInSeconds =  (SECOND_IN_MILLISECONDS / 1000) * frequency;

      const inputTimeInSeconds = getSecondsFromMinutes(mins);
      intervalRef.current && clearInterval(intervalRef.current);
      if (isNew) {
        totalTimeInSeconds.current = inputTimeInSeconds;
        console.log(inputTimeInSeconds,getTimeFromSeconds(inputTimeInSeconds), "tt")
        setCounterTime(getTimeFromSeconds(inputTimeInSeconds));
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
      onCounterStart(false, null, speed);
    },
    [onCounterStart]
  );

  return (
    <div className="countdown-wrapper">
      <div className="countdown">
        <Form onSubmit={handleSubmit} />
        <div className="countdown__body">
          <blockquote className="countdown__quote">
            {statusQuoteMaper[counterStatus]}
          </blockquote>
          <Display
            minutes={prependZero(counterTime.minutes)}
            seconds={prependZero(counterTime.seconds)}
            isPause={isPause}
            onPauseToggle={() => setIsPause((status) => !status)}
          />
          <Controls onSelect={onSpeedChange} active={playSpeed} />
        </div>
      </div>
    </div>
  );
}

export default App;
