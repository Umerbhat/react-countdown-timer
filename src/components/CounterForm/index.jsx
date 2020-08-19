import React from 'react';

const CounterHeader = (props) => {
    const { onSubmit: handleSubmit = () => { } } = props
    return (
        <div className="countdown__header">
            <form className="countdown__form l-row l-row--align-center l-row--spacing-sm" onSubmit={handleSubmit}>
                <div className="l-row__item">
                    <div className="countdown__input-field c-input l-row l-row--align-center">
                        <label className="c-input__label">Countdown:</label>
                        <input
                            className="c-input__box c-input__box--square c-input__box--primary"
                            type="number"
                            name = "minutes"
                            min="0"
                            max="60"
                            placeholder="(Min)"
                        />
                    </div>
                </div>
                <div className="l-row__item">
                    <button
                        className="countdown__button-start c-button c-button--primary"
                        type="submit"
                    >Start
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CounterHeader;