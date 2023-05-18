import { ACTIONS } from './App';

export function DigitButton({ dispatch, digit }) {
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.ADD, payload: { digit } })}
            className="button-type-2"
        >
            {digit}
        </button>
    );
}

export function OperationButton({ dispatch, operation }) {
    return (
        <button
            onClick={() =>
                dispatch({
                    type: ACTIONS.OPERATION,
                    payload: { operation },
                })
            }
            className="button-type-3"
        >
            {operation}
        </button>
    );
}
