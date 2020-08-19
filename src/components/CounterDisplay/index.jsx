import React from 'react';
import Player from './Player';

const CounterDisplay = (props) => {
    const { minutes, seconds, isPause } = props
    return (
        <div className="countdown__display">
            <h1 className="countdown__digits">{`${minutes}:${seconds}`}</h1>
            <Player isPause={isPause} />
        </div>
    );
}

export default CounterDisplay;