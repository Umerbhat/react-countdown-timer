import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import "./App.css";
import { Form, Display, Controls } from "./components";
import {
  SECOND_IN_MILLISECONDS,
  prependZero,
  getSecondsFromMinutes,
  getTimeFromSeconds,
  calculatePercentage,
  progressDeltaMapper,
  statusQuoteMaper,
} from "./utils";

function App() {
  const [counterTimeInSeconds, setCounterTimeInSeconds] = useState(0);
  const [playSpeed, setPlaySpeed] = useState("normal");
  const [isPause, setIsPause] = useState(false);
  const [progress, setProgress] = useState(100);
  const [counterStatus, setCounterStatus] = useState("start");

  let intervalRef = useRef();
  let totalTimeInSeconds = useRef();

  useEffect(() => {
    if (Math.floor(progress) < 50 && counterStatus !== "half") {
      setCounterStatus("half");
    }
    if (progress === 0) {
      setCounterStatus("finish");
      clearInterval(intervalRef.current);
    }
  }, [progress, counterStatus]);

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

  const freshTickStart = useCallback((inputTimeInSeconds) => {
    totalTimeInSeconds.current = inputTimeInSeconds;
    setCounterStatus("start");
    setIsPause(false);
    setCounterTimeInSeconds(inputTimeInSeconds);
  }, []);

  const tickStart = useCallback(
    (fresh = true, mins, speed = playSpeed) => {
      const frequency = progressDeltaMapper[speed];
      const intervalTimeInMilliSeconds = SECOND_IN_MILLISECONDS / frequency;
      const inputTimeInSeconds = getSecondsFromMinutes(mins);

      intervalRef.current && clearInterval(intervalRef.current);
      fresh && freshTickStart(inputTimeInSeconds);
      intervalRef.current = setInterval(() => {
        updateTimer();
      }, intervalTimeInMilliSeconds);
    },
    [updateTimer, playSpeed, freshTickStart]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const formMinutesValue = e.target.minutes.value;
      formMinutesValue && tickStart(true, formMinutesValue);
    },
    [tickStart]
  );

  const onSpeedChange = useCallback(
    (speed) => {
      setPlaySpeed(speed);
      !isPause && tickStart(false, null, speed);
    },
    [tickStart, isPause]
  );

  const handlePause = useCallback(() => {
    if (isPause) {
      setIsPause(false);
      tickStart(false);
    } else {
      setIsPause(true);
      clearInterval(intervalRef.current);
    }
  }, [isPause, tickStart]);

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
