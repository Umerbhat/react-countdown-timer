import React from 'react';
import Player from './Player';

const CounterDisplay = (props) => {
    const { minutes, seconds, isPause, onPauseToggle } = props
    return (
        <div className="countdown__display">
            <h1 className="countdown__digits">{`${minutes}:${seconds}`}</h1>
            <Player isPause={isPause} onPauseToggle={onPauseToggle} />
        </div>
    );
}

export default CounterDisplay;