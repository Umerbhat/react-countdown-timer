import React from 'react';

const SPEED_2X = "faster"
const SPEED_1_5X = "fast"
const SPEED_1_X = "normal"

const CounterControls = (props) => {
    const { onSelect = () => { }, active } = props
    return (
        <div className="countdown__controls l-row l-row--justify-center l-row--spacing-sm">
            <div className="countdown__speed l-row__item">
                <button
                    className={`countdown__button-speed c-button c-button--color-text c-button--outlined c-button--square ${active === SPEED_1_X ? "c-button--active" : ""}`}
                    type="button"
                    onClick={() => onSelect(SPEED_1_X)}
                >
                    1X
                </button>
            </div>
            <div className="countdown__speed l-row__item">
                <button
                    className={`countdown__button-speed c-button c-button--color-text c-button--outlined c-button--square ${active === SPEED_1_5X ? "c-button--active" : ""}`}
                    type="button"
                    onClick={() => onSelect(SPEED_1_5X)}
                >
                    1.5X
                </button>
            </div>
            <div className="countdown__speed l-row__item">
                <button
                    className={`countdown__button-speed c-button c-button--color-text c-button--outlined c-button--square ${active === SPEED_2X ? "c-button--active" : ""}`}
                    type="button"
                    onClick={() => onSelect(SPEED_2X)}
                >
                    2X
                </button>
            </div>
        </div>
    );
}

export default CounterControls;