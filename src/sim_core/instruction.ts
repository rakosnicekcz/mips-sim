import * as R from "./registr";
import * as P from "./pipeline";
import * as M from "./memory"
import * as Prg from "./program";
import Long from "long"
import compare from 'just-compare';

export enum EInstructionName {
    nop = "nop",
    add = "add",
    sub = "sub",
    lw = "lw",
    addi = "addi",
    addu = "addu",
    subu = "subu",
    addiu = "addiu",
    mul = "mul",
    mult = "mult",
    div = "div",
    and = "and",
    sll = "sll",
    or = "or",
    andi = "andi",
    ori = "ori",
    srl = "srl",
    sw = "sw",
    lh = "lh",
    sh = "sh",
    lb = "lb",
    sb = "sb",
    lui = "lui",
    mflo = "mflo",
    mfhi = "mfhi",
    li = "li",
    la = "la",
    move = "move",
    ble = "ble",
    blt = "blt",
    bge = "bge",
    bgt = "bgt",
    bne = "bne",
    beq = "beq",
    slt = "slt",
    slti = "slti",
    j = "j",
    jr = "jr",
    jal = "jal",
    syscall = "syscall",
}

enum ERDval {
    RD = "RD"
}

export type TEditableValue = R.ERegisters | R.EHiLoRegisters | ERDval
export const editableValues = { ...R.ERegisters, ...R.EHiLoRegisters, ...ERDval } as const

export enum EPipelineStages {
    fetch,
    decode,
    execute,
    memory,
    writeBack,
}

export interface IInstructionDescription {
    name: EInstructionName;
    isJumpInstruction: boolean;
    isBranchInstruction: boolean;
    isMemoryInstruction: boolean;
    isMemoryLoadInstruction: boolean;
    mainExecutionStage: EPipelineStages;
    writeBack: boolean;
    noRDparam: boolean;
    changedValues: TEditableValue[];
    requireSpecial: TEditableValue[]; // required values which is not part of syntax (mfhi, mflo)
    paramTypes: EInstructionParamType[][];
    execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns;
    executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns;
    checkParsed(ins: IInstruction): IInstruction;
}

export enum EInstructionParamType {
    register,
    immidiate,
    adress,
    labelT,
    labelD
}

export interface IInstruction {
    line: number;
    address: number;
    description: IInstructionDescription;
    paramType: EInstructionParamType[];
    arg0?: R.ERegisters;
    arg1?: R.ERegisters;
    arg2?: R.ERegisters;
    imm?: number | string
}

export type TInstruction_set = Record<EInstructionName, IInstructionDescription>;

export const instruction_set: TInstruction_set = {
    [EInstructionName.nop]: {
        name: EInstructionName.nop, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.fetch, writeBack: false, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[]], changedValues: [], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    // Arithmetic instructions
    [EInstructionName.add]: {
        name: EInstructionName.add, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] + array32[1];

                if (array32[0] !== ins.val0 + ins.val1) {
                    //TODO overflow
                }
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.sub]: {
        name: EInstructionName.sub, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] - array32[1];

                if (array32[0] !== ins.val0 - ins.val1) {
                    //TODO overflow
                }
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.addi]: {
        name: EInstructionName.addi, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.instruction.imm;
                array32[2] = array32[0] + array32[1];
                if (array32[2] !== ins.instruction.imm + ins.val0) {
                    // TODO overflow
                }
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.addu]: {
        name: EInstructionName.addu, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] + array32[1];
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.subu]: {
        name: EInstructionName.subu, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] - array32[1];
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.addiu]: {
        name: EInstructionName.addiu, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.instruction.imm;
                array32[2] = array32[0] + array32[1];
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.mul]: {
        name: EInstructionName.mul, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] * array32[1];
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.mult]: {
        name: EInstructionName.mult, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.$hi, editableValues.$lo], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                let val0 = new Long(ins.val0)
                let res = val0.mul(ins.val1);
                ins.resHiLo = { hi: res.getHighBits(), lo: res.getLowBits() };
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.div]: {
        name: EInstructionName.div, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.$hi, editableValues.$lo], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.resHiLo = { hi: ins.val0 % ins.val1, lo: Math.floor(ins.val0 / ins.val1) };
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    // Logical instructions
    [EInstructionName.and]: {
        name: EInstructionName.and, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = ins.val0 & ins.val1;
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.or]: {
        name: EInstructionName.or, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = ins.val0 | ins.val1;
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.andi]: {
        name: EInstructionName.and, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
                ins.res = ins.val0 & ins.instruction.imm;
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.ori]: {
        name: EInstructionName.ori, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
                ins.res = ins.val0 | ins.instruction.imm;
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.sll]: {
        name: EInstructionName.sll, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
                ins.res = ins.val0 << ins.instruction.imm;
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction {
            if (typeof ins.imm === "number") {
                if (ins.imm < 0 || ins.imm > 31) {
                    throw new Error("SLL immidiate must be between 0 and 31")
                }
            }
            return ins
        }
    },
    [EInstructionName.srl]: {
        name: EInstructionName.srl, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
                ins.res = ins.val0 >> ins.instruction.imm;
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins },
        checkParsed(ins: IInstruction): IInstruction {
            if (typeof ins.imm === "number") {
                if (ins.imm < 0 || ins.imm > 31) {
                    throw new Error("SLL immidiate must be between 0 and 31")
                }
            }
            return ins
        }
    },
    // Data transfer instructions
    [EInstructionName.lw]: {
        name: EInstructionName.lw, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: true,
        mainExecutionStage: EPipelineStages.memory, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            return doLoadOp(ins, mem, M.EMemBitLenOperation.word, this.paramTypes)
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.sw]: {
        name: EInstructionName.sw, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.memory, writeBack: false, isBranchInstruction: false, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            doStoreOp(ins, mem, M.EMemBitLenOperation.word, this.paramTypes)
            return ins;
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.lh]: {
        name: EInstructionName.lh, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: true,
        mainExecutionStage: EPipelineStages.memory, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            return doLoadOp(ins, mem, M.EMemBitLenOperation.halfword, this.paramTypes)
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.sh]: {
        name: EInstructionName.sh, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.memory, writeBack: false, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            doStoreOp(ins, mem, M.EMemBitLenOperation.halfword, this.paramTypes)
            return ins;
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.lb]: {
        name: EInstructionName.lb, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: true,
        mainExecutionStage: EPipelineStages.memory, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            return doLoadOp(ins, mem, M.EMemBitLenOperation.byte, this.paramTypes)
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.sb]: {
        name: EInstructionName.sb, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.memory, writeBack: false, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            doStoreOp(ins, mem, M.EMemBitLenOperation.byte, this.paramTypes)
            return ins;
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.lui]: {
        name: EInstructionName.lui, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (typeof ins.instruction.imm === 'number') {
                if (ins.instruction.imm > 0xffff) {
                    throw new Error("LUI immidiate value is too big");
                }
                ins.res = ins.instruction.imm << 16
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.la]: {
        name: EInstructionName.la, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.labelT],
        [EInstructionParamType.register, EInstructionParamType.labelD],
        [EInstructionParamType.register, EInstructionParamType.adress]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (compare(ins.instruction.paramType, this.paramTypes[0])) {
                if (typeof ins.instruction.imm == "string") {
                    ins.res = prg.getLabel(ins.instruction.imm).address
                }
            } else if (compare(ins.instruction.paramType, this.paramTypes[1])) {
                if (typeof ins.instruction.imm == "string") {
                    ins.res = mem.getLabel(ins.instruction.imm).address
                }
            } else if (typeof ins.instruction.imm == "number") {
                ins.res = ins.instruction.imm
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.li]: {
        name: EInstructionName.li, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (typeof ins.instruction.imm === 'number') {
                ins.res = ins.instruction.imm
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.mfhi]: {
        name: EInstructionName.mfhi, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register]], changedValues: [editableValues.RD], requireSpecial: [editableValues.$hi],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined) {
                ins.res = ins.val0
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.mflo]: {
        name: EInstructionName.mflo, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register]], changedValues: [editableValues.RD], requireSpecial: [editableValues.$lo],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined) {
                ins.res = ins.val0
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.move]: {
        name: EInstructionName.move, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined) {
                ins.res = ins.val0
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    // Conditional Branch instructions
    [EInstructionName.beq]: {
        name: EInstructionName.beq, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: true, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 === ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.bne]: {
        name: EInstructionName.bne, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: true, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 !== ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.bgt]: {
        name: EInstructionName.bgt, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: true, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 > ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.bge]: {
        name: EInstructionName.bge, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: true, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 >= ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.blt]: {
        name: EInstructionName.blt, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: true, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 < ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.ble]: {
        name: EInstructionName.ble, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: true, noRDparam: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 <= ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.slt]: {
        name: EInstructionName.slt, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && ins.val1 !== undefined) {
                ins.res = Number(ins.val0 < ins.val1)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.slti]: {
        name: EInstructionName.slti, isJumpInstruction: false, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.execute, writeBack: true, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        changedValues: [editableValues.RD], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
                ins.res = Number(ins.val0 < ins.instruction.imm)
            }
            return ins
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    // Unconditional jump instructions
    [EInstructionName.j]: {
        name: EInstructionName.j, isJumpInstruction: true, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.decode, writeBack: false, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.labelT]], changedValues: [], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.jr]: {
        name: EInstructionName.jr, isJumpInstruction: true, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.decode, writeBack: false, isBranchInstruction: false, noRDparam: true,
        paramTypes: [[EInstructionParamType.register]], changedValues: [], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.jal]: {
        name: EInstructionName.jal, isJumpInstruction: true, isMemoryInstruction: false, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.decode, writeBack: false, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[EInstructionParamType.labelT]], changedValues: [editableValues.$31], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns { return ins; },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    },
    [EInstructionName.syscall]: {
        name: EInstructionName.syscall, isJumpInstruction: false, isMemoryInstruction: true, isMemoryLoadInstruction: false,
        mainExecutionStage: EPipelineStages.memory, writeBack: false, isBranchInstruction: false, noRDparam: false,
        paramTypes: [[]], changedValues: [editableValues.$2], requireSpecial: [],
        execute(ins: P.IPipelineIns, prg: Prg.Program, mem: M.Memory): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory, reg: R.Registers, inputString: string, setOutput: P.TSetOutput): P.IPipelineIns {
            let regV0 = reg.getVal(R.ERegisters.$2)
            let regA0 = reg.getVal(R.ERegisters.$4)
            let regA1 = reg.getVal(R.ERegisters.$4)

            let add: number
            let str: string

            switch (regV0) {
                case 1: // print_int
                    setOutput(String(regA0))
                    break;
                case 4: // print_string
                    add = regA0;
                    str = "";
                    while (1) {
                        let byte = mem.load(M.EMemBitLenOperation.byte, add);
                        if (byte === 0) {
                            break;
                        }
                        add++;
                        str += String.fromCharCode(byte);
                    }
                    setOutput(str);
                    break;
                case 5: // read_int
                    let num = Number(inputString);
                    if (isNaN(num) || inputString.length === 0) {
                        throw new Error("Invalid input")
                    }
                    reg.setVal(R.ERegisters.$2, num)
                    break;
                case 8: // read_string
                    let enc = new TextEncoder();
                    let wholeString = enc.encode(inputString);
                    let substring = wholeString.slice(0, regA1 - 1)
                    let data = Int8Array.from([...substring, 0])

                    add = regA0;
                    for (let i = 0; i < data.length; i++) {
                        mem.store(M.EMemBitLenOperation.byte, add, data[i]);
                        add++;
                    }
                    break;
                case 9: // sbrk
                    add = mem.allocateHeap(regA0);
                    reg.setVal(R.ERegisters.$2, add)
                    break;
                case 10: // exit
                    throw new Error("Exit :D")
                case 11: // print_char
                    let char = String.fromCharCode(regA0);
                    setOutput(char);
                    break;
                case 12: // read_char
                    let val = inputString.length > 0 ? inputString.charCodeAt(0) : 0;
                    reg.setVal(R.ERegisters.$2, val);
                    break;
                default:
                    throw new Error("Unknown syscall")
            }

            return ins
        },
        checkParsed(ins: IInstruction): IInstruction { return ins }
    }
}

let doLoadOp = (ins: P.IPipelineIns, mem: M.Memory, memOp: M.EMemBitLenOperation, paramType: EInstructionParamType[][]) => {
    console.log("doLoadOp", ins.instruction.paramType, paramType[2])
    if (compare(ins.instruction.paramType, paramType[0])) {
        if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
            let address = ins.val0 + Number(ins.instruction.imm);
            ins.res = mem.load(memOp, address)
        }
    } else if (compare(ins.instruction.paramType, paramType[1])) {
        if (ins.val0 !== undefined && typeof ins.instruction.imm === "string") {
            ins.res = mem.load(memOp, ins.val0, ins.instruction.imm)
        }
    } else if (compare(ins.instruction.paramType, paramType[2])) {
        if (typeof ins.instruction.imm === "number") {
            ins.res = mem.load(memOp, ins.instruction.imm)
        }
    } else if (compare(ins.instruction.paramType, paramType[3])) {
        if (typeof ins.instruction.imm === "string") {
            console.log("executing load op with label")
            ins.res = mem.load(memOp, 0, ins.instruction.imm)
        }
    }
    return ins;
}

let doStoreOp = (ins: P.IPipelineIns, mem: M.Memory, memOp: M.EMemBitLenOperation, paramType: EInstructionParamType[][]) => {
    if (compare(ins.instruction.paramType, paramType[0])) {
        if (ins.val0 !== undefined && ins.val1 !== undefined && typeof ins.instruction.imm === "number") {
            let address = ins.val1 + Number(ins.instruction.imm);
            mem.store(memOp, address, ins.val0)
        }
    } else if (compare(ins.instruction.paramType, paramType[1])) {
        if (ins.val0 && ins.val1 !== undefined && typeof ins.instruction.imm === "string") {
            mem.store(memOp, ins.val1, ins.val0, ins.instruction.imm)
        }
    } else if (compare(ins.instruction.paramType, paramType[2])) {
        if (ins.val0 !== undefined && typeof ins.instruction.imm === "number") {
            mem.store(memOp, ins.instruction.imm, ins.val0)
        }
    } else if (compare(ins.instruction.paramType, paramType[3])) {
        if (ins.val0 !== undefined && typeof ins.instruction.imm === "string") {
            mem.store(memOp, 0, ins.val0, ins.instruction.imm)
        }
    }
}