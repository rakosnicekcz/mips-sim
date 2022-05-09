/*
    Modul: reducer.ts
    Autor: Hůlek Matěj
*/

import { combineReducers } from "redux";
import { StagesState, NOP } from "./sim_core/pipeline";
import * as R from "./sim_core/register"
import { errorState } from "./App"

export const outputValueReducer = (state: string = "", action) => {
    switch (action.type) {
        case 'SET_OUTPUT_VALUE':
            return action.payload;
        case 'EXTEND_OUTPUT_VALUE':
            return state + action.payload;
        default:
            return state;
    }
}

export const inputValueReducer = (state: string = "", action) => {
    switch (action.type) {
        case 'SET_INPUT_VALUE':
            return action.payload;
        default:
            return state;
    }
}

export const stagesStateReducer = (state: StagesState = { if: NOP, id: NOP, ex: NOP, mem: NOP, wb: NOP }, action) => {
    switch (action.type) {
        case 'SET_STAGES_STATE':
            return action.payload;
        case 'CLEAR_STAGE_STATE':
            return { if: NOP, id: NOP, ex: NOP, mem: NOP, wb: NOP };
        default:
            return state;
    }
}

export const registersReducer = (state: R.IAllRegister[] = [], action) => {
    switch (action.type) {
        case 'SET_REGISTERS':
            return action.payload;
        default:
            return state;
    }
}

export const errorReducer = (state: errorState = { isError: false, message: "" }, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return { isError: true, message: action.payload };
        case 'CLEAR_ERROR':
            return { isError: false, message: "" };
        default:
            return state;
    }
}

export const memoryReducer = (state: ArrayBuffer = new ArrayBuffer(0), action) => {
    switch (action.type) {
        case 'SET_MEMORY_BUFFER':
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    outputValue: outputValueReducer,
    inputValue: inputValueReducer,
    stagesState: stagesStateReducer,
    registers: registersReducer,
    error: errorReducer,
    memory: memoryReducer
})

