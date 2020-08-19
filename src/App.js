import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import "./App.css";
import { Form, Display, Controls } from "./components";

const playSpeedMapper = {
  slow: 500,
  normal: 1000,
  fast: 1500,
  faster: 2000,
};
const SECONDS_PER_MIN = 60

function App() {
  const [counterTime, setCounterTime] = useState({ minutes: '00', seconds: '00' })
  const [playSpeed, setPlaySpeed] = useState("normal");
  const [progress, setProgress] = useState(100)

  let intervalRef = useRef();

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
        return { minutes: prependZero(minsInInt - 1), seconds: prependZero(SECONDS_PER_MIN - secondsInInt - 1) };
      } else if (minsInInt === 0 && secondsInInt < 1) {
        return { ...prevTime, seconds: prependZero(secondsInInt) };
      } else {
        return { ...prevTime, seconds: prependZero(secondsInInt - 1) };
      }
    });
  }, [prependZero]);


  // useEffect(() => {
  //   intervalRef.current = setInterval(updateCounter(), getIntervalByPlaySpeed(playSpeed));
  //   return () => clearInterval(intervalRef.current);
  // })

  const onCounterStart = useCallback(
    (mins) => {
      let currentProgress = mins * 60
      intervalRef.current && clearInterval(intervalRef.current)
      setCounterTime({ minutes: prependZero(mins), seconds: prependZero(0) });
      setInterval(updateTimer, getIntervalByPlaySpeed(playSpeed));
    },
    [prependZero, updateTimer, getIntervalByPlaySpeed, playSpeed]
  );

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const formMinutesValue = e.target.minutes.value;
    formMinutesValue && onCounterStart(formMinutesValue);
  }, [onCounterStart]);

  return (
    <div className="countdown-wrapper">
      <div className="countdown">
        <Form onSubmit={handleSubmit} />
        <div className="countdown__body">
          <blockquote className="countdown__quote">
            You are almost there!
          </blockquote>
          <Display minutes={counterTime.minutes} seconds={counterTime.seconds} />
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;
