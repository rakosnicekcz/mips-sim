import * as I from "./instruction";
import * as R from "./registr";
import * as M from "./memory";
import * as P from "./pipeline"

export interface Ilabel {
    line: number,
    address: number,
    name: string
}

const textSegmentStart: number = 0x04000000
const textSegmentEnd: number = 0x0ffffffc

export class Program {
    private Instructions: I.IInstruction[];
    private LabelsT: Ilabel[];
    private PC: number = textSegmentStart;
    constructor() {
        this.Instructions = [{
            description: I.instruction_set.add,
            address: textSegmentStart,
            line: 1,
            paramType: I.instruction_set.add.paramTypes[0],
            arg0: R.ERegisters.$10, arg1: R.ERegisters.$11, arg2: R.ERegisters.$12
        }]
    }

    setProgram(program: I.IInstruction[], labels: Ilabel[]): void {
        let address = textSegmentStart
        program.forEach(e => { e.address = address; address += 4 })

        labels.forEach(e => {
            let index = program.findIndex(x => x.line >= e.line);
            e.address = index === -1 ? program[program.length - 1].address + 4 : program[index].address
        });
        this.Instructions = program
        this.LabelsT = labels
    }

    getLabel(name: string): Ilabel {
        let label = this.LabelsT.find(x => x.name === name)
        if (label === undefined) {
            throw new Error(`Label ${name} not found`)
        }
        return label
    }

    setPCofLabel(name: string): void {
        this.PC = this.getLabel(name).address
    }

    getPC(): number {
        return this.PC
    }

    setPC(address: number): void {
        console.log("setPC", address)
        if (address < textSegmentStart || address > textSegmentEnd) {
            throw new Error(`PC out of range`)
        }
        this.PC = address
    }

    getNextInstruction(): P.IPipelineIns {
        let instruction = this.Instructions.find(x => x.address === this.PC)
        if (instruction === undefined) {
            return P.NOP
        }
        let ins: P.IPipelineIns = { instruction: instruction, pc: this.PC + 4 }
        this.PC += 4
        return ins
    }
}