import React from 'react';
import { ReactComponent as PauseIcon } from '../.../../../assets/icons/pause.svg'
import { ReactComponent as PlayIcon } from '../.../../../assets/icons/play.svg'

const Player = (props) => {
    const { isPause } = props
    return (
        <div className="countdown__pause">
            <button
                className="countdown__button-pause c-button c-button--color-text c-button--outlined c-button--circular"
                type="button"
            >
                {isPause ? <PlayIcon className="c-button__icon" /> :
                    <PauseIcon className="c-button__icon" />}
            </button>
        </div>
    );
}

export default Player;