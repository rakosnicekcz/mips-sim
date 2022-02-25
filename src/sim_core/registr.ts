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

    private registers: IRegister[] = [
        { name: ERegisters.$0, value: new Int32Array(1) },
        { name: ERegisters.$1, value: new Int32Array(1) },
        { name: ERegisters.$2, value: new Int32Array(1) },
        { name: ERegisters.$3, value: new Int32Array(1) },
        { name: ERegisters.$4, value: new Int32Array(1) },
        { name: ERegisters.$5, value: new Int32Array(1) },
        { name: ERegisters.$6, value: new Int32Array(1) },
        { name: ERegisters.$7, value: new Int32Array(1) },
        { name: ERegisters.$8, value: new Int32Array(1) },
        { name: ERegisters.$9, value: new Int32Array(1) },
        { name: ERegisters.$10, value: new Int32Array(1) },
        { name: ERegisters.$11, value: new Int32Array(1) },
        { name: ERegisters.$12, value: new Int32Array(1) },
        { name: ERegisters.$13, value: new Int32Array(1) },
        { name: ERegisters.$14, value: new Int32Array(1) },
        { name: ERegisters.$15, value: new Int32Array(1) },
        { name: ERegisters.$16, value: new Int32Array(1) },
        { name: ERegisters.$17, value: new Int32Array(1) },
        { name: ERegisters.$18, value: new Int32Array(1) },
        { name: ERegisters.$19, value: new Int32Array(1) },
        { name: ERegisters.$20, value: new Int32Array(1) },
        { name: ERegisters.$21, value: new Int32Array(1) },
        { name: ERegisters.$22, value: new Int32Array(1) },
        { name: ERegisters.$23, value: new Int32Array(1) },
        { name: ERegisters.$24, value: new Int32Array(1) },
        { name: ERegisters.$25, value: new Int32Array(1) },
        { name: ERegisters.$26, value: new Int32Array(1) },
        { name: ERegisters.$27, value: new Int32Array(1) },
        { name: ERegisters.$28, value: new Int32Array(1) },
        { name: ERegisters.$29, value: new Int32Array(1) },
        { name: ERegisters.$30, value: new Int32Array(1) },
        { name: ERegisters.$31, value: new Int32Array(1) },]

    setVal(name: ERegisters, value: number): void {
        let index = this.registers.findIndex(x => x.name === name)
        this.registers[index].value[0] = value;
    }

    getVal(name: ERegisters): number {
        let index = this.registers.findIndex(x => x.name === name)
        return this.registers[index].value[0];
    }

    printAllRegisters(): void {
        console.log(this.registers)
    }
}
