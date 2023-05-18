import React, { useReducer, useContext } from 'react';
import { GlobalStateContext } from './index';
import { DigitButton, OperationButton } from './Buttons';

export const ACTIONS = {
    ADD: 'add',
    OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE: 'delete',
    EVALUATE: 'evaluate',
    MEMO: 'save-memo',
};

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD:
            if (state.overwrite) {
                return {
                    ...state,
                    current: payload.digit,
                    overwrite: false,
                };
            }

            // "00" not allowed at the beginning of number
            if (payload.digit === '0' && state.current === '0') {
                return state;
            }

            // Only one "." allowed
            if (payload.digit === '.' && state.current.includes('.')) {
                return state;
            }

            return {
                ...state,
                current: `${state.current || ''}${payload.digit}`,
            };
        case ACTIONS.OPERATION:
            if (state.current == null && state.previous == null) {
                return state;
            }

            if (payload.operation === '^2' || payload.operation === '√') {
                return {
                    ...state,
                    overwrite: true,
                    previous: null,
                    operation: null,
                    current: evaluate({
                        current: 0,
                        previous: state.current,
                        operation: payload.operation,
                    }),
                };
            }

            if (state.current == null) {
                return {
                    ...state,
                    operation: payload.operation,
                };
            }

            if (state.previous == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previous: state.current,
                    current: null,
                };
            }

            return {
                ...state,
                previous: evaluate(state),
                operation: payload.operation,
                current: null,
            };
        case ACTIONS.CLEAR:
            return {};
        case ACTIONS.MEMO:
            if (state.current == null && state.memo == null) {
                return state;
            }
            if (state.memo != null) {
                return { ...state, current: state.memo, memo: null };
            }
            return { ...state, memo: state.current };
        case ACTIONS.DELETE:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    current: null,
                };
            }
            if (state.current == null) {
                return state;
            }
            if (state.current.length === 1) {
                return { ...state, current: null };
            }

            return {
                ...state,
                current: state.current.slice(0, -1),
            };
        case ACTIONS.EVALUATE:
            if (
                state.operation == null ||
                state.current == null ||
                state.previous == null
            ) {
                return state;
            }

            return {
                ...state,
                overwrite: true,
                previous: null,
                operation: null,
                current: evaluate(state),
            };
        default:
            break;
    }
}

function evaluate({ current, previous, operation }) {
    const prevFloat = parseFloat(previous);
    const currentFloat = parseFloat(current);
    if (isNaN(prevFloat) || isNaN(currentFloat)) return '';
    let computation = '';
    // eslint-disable-next-line default-case
    switch (operation) {
        case '+':
            computation = prevFloat + currentFloat;
            break;
        case '-':
            computation = prevFloat - currentFloat;
            break;
        case 'X':
            computation = prevFloat * currentFloat;
            break;
        case '/':
            computation = prevFloat / currentFloat;
            break;
        case '%':
            computation = (prevFloat / 100) * currentFloat;
            break;
        case '^2':
            computation = prevFloat * prevFloat;
            break;
        case '^X':
            computation = prevFloat ** currentFloat;
            break;
        case '√':
            computation = prevFloat ** 0.5;
            break;
    }

    return computation.toString();
}

function format(operand, FORMATER) {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) return FORMATER.format(integer);
    return `${FORMATER.format(integer)}.${decimal}`;
}

export function Calculator() {
    const [{ current, previous, operation, memo }, dispatch] = useReducer(
        reducer,
        {}
    );

    const { language } = useContext(GlobalStateContext);
    const FORMATER = Intl.NumberFormat(language === 'HU' ? 'hu-HU' : 'en-EN', {
        maximumFractionDigits: 0,
    });

    return (
        <div className="calculator">
            <div className="display">
                <div className="previous">
                    {format(previous, FORMATER)} {operation}
                </div>
                <div className="current">{format(current, FORMATER)}</div>
            </div>
            <button
                onClick={() => dispatch({ type: ACTIONS.CLEAR })}
                className="button-type-1"
            >
                AC
            </button>
            <button
                onClick={() => dispatch({ type: ACTIONS.DELETE })}
                className="button-type-1"
            >
                DEL
            </button>
            <button
                onClick={() => dispatch({ type: ACTIONS.MEMO })}
                className="button-type-1 memo"
            >
                {memo == null ? 'M' : memo}
            </button>
            <OperationButton operation="/" dispatch={dispatch} />
            <OperationButton operation="^2" dispatch={dispatch} />
            <OperationButton operation="^X" dispatch={dispatch} />
            <OperationButton operation="√" dispatch={dispatch} />
            <OperationButton operation="%" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="X" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <button
                onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
                className="button-type-3 span-two"
            >
                =
            </button>
        </div>
    );
}
