import * as I from "./instruction";
import * as R from "./registr";
import * as M from "./memory";
import * as P from "./pipeline"

export interface Ilabel {
    line: number,
    name: string
}

export class Program {
    private Instructions: I.IInstruction[];
    private PC: number = 0;
    constructor() {
        this.Instructions = [{
            description: I.instruction_set.add,
            line: 1,
            paramType: I.instruction_set.add.paramTypes[0],
            arg0: R.ERegisters.$10, arg1: R.ERegisters.$11, arg2: R.ERegisters.$12
        }]
    }

    setProgram(program: I.IInstruction[]) {
        this.Instructions = program;
    }

    getNextInstruction(): P.IPipelineIns {
        if (this.PC >= this.Instructions.length) {
            return P.NOOP
        }
        return { instruction: this.Instructions[this.PC], pc: this.PC++ }
    }
}