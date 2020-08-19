import React from 'react';

const CounterControls = () => {
    return (
        <div className="countdown__controls l-row l-row--justify-center l-row--spacing-sm">
            <div className="countdown__speed l-row__item">
                <button
                    className="countdown__button-speed c-button c-button--color-text c-button--outlined c-button--square"
                    type="button"
                >
                    1X
                </button>
            </div>
            <div className="countdown__speed l-row__item">
                <button
                    className="countdown__button-speed c-button c-button--color-text c-button--outlined c-button--square"
                    type="button"
                >
                    1.5X
                </button>
            </div>
            <div className="countdown__speed l-row__item">
                <button
                    className="countdown__button-speed c-button c-button--color-text c-button--outlined c-button--square"
                    type="button"
                >
                    2X
                </button>
            </div>
        </div>
    );
}

export default CounterControls;