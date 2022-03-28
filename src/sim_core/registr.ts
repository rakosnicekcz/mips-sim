import deepcopy from "deepcopy";

export interface IRegister {
    name: ERegisters;
    value: Int32Array;
}

export enum ERegisters {
    $0 = "$zero",
    $1 = "$at1",
    $2 = "$v0",
    $3 = "$v1",
    $4 = "$a0",
    $5 = "$a1",
    $6 = "$a2",
    $7 = "$a3",
    $8 = "$t0",
    $9 = "$t1",
    $10 = "$t2",
    $11 = "$t3",
    $12 = "$t4",
    $13 = "$t5",
    $14 = "$t6",
    $15 = "$t7",
    $16 = "$s0",
    $17 = "$s1",
    $18 = "$s2",
    $19 = "$s3",
    $20 = "$s4",
    $21 = "$s5",
    $22 = "$s6",
    $23 = "$s7",
    $24 = "$t8",
    $25 = "$t9",
    $26 = "$k0",
    $27 = "$k1",
    $28 = "$gp",
    $29 = "$sp",
    $30 = "$fp",
    $31 = "$ra"
}

export class Registers {

    private registers: IRegister[] = [];

    constructor() {
        Object.keys(ERegisters).forEach(e => {
            this.registers.push({ name: ERegisters[e as keyof typeof ERegisters], value: new Int32Array(1) })
        });
    }

    setVal(name: ERegisters, value: number): void {
        let index = this.registers.findIndex(x => x.name === name)
        this.registers[index].value[0] = deepcopy(value);
    }

    getVal(name: ERegisters): number {
        let index = this.registers.findIndex(x => x.name === name)
        return deepcopy(this.registers[index].value[0]);
    }

    printAllRegisters(): void {
        console.log(this.registers)
    }
}
