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

function App() {
  const [counterTime, setCounterTime] = useState({
    minutes: "00",
    seconds: "00",
  });
  const [playSpeed, setPlaySpeed] = useState("normal");
  const [isPause, setIsPause] = useState(false);
  const [progress, setProgress] = useState(100);
  const [counterStatus, setCounterStatus] = useState("start");

  let intervalRef = useRef();
  let totalTimeInMins = useRef();

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

  const getIntervalByPlaySpeed = useCallback((speed) => {
    return playSpeedMapper[speed];
  }, []);

  const prependZero = useCallback((number) => {
    if (number <= 9) return "0" + number;
    else return number;
  }, []);

  const updateTimer = useCallback(() => {
    setCounterTime((prevTime) => {
      let minsInInt = parseInt(prevTime.minutes);
      let secondsInInt = parseInt(prevTime.seconds);
      if (minsInInt !== 0 && secondsInInt < 1) {
        return {
          minutes: prependZero(minsInInt - 1),
          seconds: prependZero(SECONDS_PER_MIN - secondsInInt - 1),
        };
      } else if (minsInInt === 0 && secondsInInt < 1) {
        return { ...prevTime, seconds: prependZero(secondsInInt) };
      } else {
        return { ...prevTime, seconds: prependZero(secondsInInt - 1) };
      }
    });
  }, [prependZero]);

  const getPercentageValue = useCallback(
    (value, total) => (value / total) * 100,
    []
  );

  const onCounterStart = useCallback(
    (isNew = true, mins, speed = playSpeed) => {
      const intervalTime = getIntervalByPlaySpeed(speed);
      const progressDecrement = intervalTime * progressDeltaMapper[speed];
      intervalRef.current && clearInterval(intervalRef.current);
      if (isNew) {
        totalTimeInMins.current = mins * 60;
        setCounterTime({ minutes: prependZero(mins), seconds: prependZero(0) });
      }
      intervalRef.current = setInterval(() => {
        updateTimer();
        setProgress(
          (currentProgress) =>
            currentProgress - progressDecrement / totalTimeInMins.current
        );
      }, intervalTime);
    },
    [prependZero, updateTimer, getIntervalByPlaySpeed, playSpeed]
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
            minutes={counterTime.minutes}
            seconds={counterTime.seconds}
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
