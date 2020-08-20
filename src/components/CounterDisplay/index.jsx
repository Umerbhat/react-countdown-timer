import React from 'react';
import Player from './Player';

const CounterDisplay = (props) => {
    const { minutes, seconds, isPause, onPauseToggle, hasFlash, hasDanger } = props
    const flashClass = hasFlash ? "flash" : "";
    const dangerClass = hasDanger ? "countdown__digits--danger" : ""

    return (
        <div className="countdown__display">
            <h1 className={`countdown__digits ${flashClass} ${dangerClass}`}>{`${minutes}:${seconds}`}</h1>
            <Player isPause={isPause} onPauseToggle={onPauseToggle} />
        </div>
    );
}

export default CounterDisplay;