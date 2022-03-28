import * as R from "./registr";
import * as P from "./pipeline";
import * as M from "./memory"


export enum EInstructionName {
    noop = "noop",
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
    jal = "jal"
}

export const memoryInstructions: EInstructionName[] = [EInstructionName.lw];

export interface IInstructionDescription {
    name: EInstructionName;
    isJumpInstruction: boolean;
    isBranchInstruction: boolean;
    isMemoryInstruction: boolean;
    writeBack: boolean;
    paramTypes: EInstructionParamType[][];
    execute(ins: P.IPipelineIns): P.IPipelineIns;
    executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns;
}

export enum EInstructionParamType {
    register,
    immidiate,
    adress,
    labelT,
    labelD
}

export interface IInstruction {
    line: Number;
    description: IInstructionDescription;
    paramType: EInstructionParamType[];
    arg0?: R.ERegisters;
    arg1?: R.ERegisters;
    arg2?: R.ERegisters;
    imm?: number | string
}

export type TInstruction_set = Record<EInstructionName, IInstructionDescription>;

export const instruction_set: TInstruction_set = {
    [EInstructionName.noop]: {
        name: EInstructionName.noop, isJumpInstruction: false, isMemoryInstruction: false, writeBack: false, isBranchInstruction: false,
        paramTypes: [],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    // Arithmetic instructions
    [EInstructionName.add]: {
        name: EInstructionName.add, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] + array32[1];
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins }
    },
    [EInstructionName.sub]: {
        name: EInstructionName.sub, isJumpInstruction: false, isMemoryInstruction: false, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] - array32[1];
            }
            ins.res = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins }
    },
    [EInstructionName.addi]: {
        name: EInstructionName.addi, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.addu]: {
        name: EInstructionName.addu, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.subu]: {
        name: EInstructionName.subu, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.addiu]: {
        name: EInstructionName.addiu, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.mul]: {
        name: EInstructionName.mul, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.mult]: {
        name: EInstructionName.mult, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.div]: {
        name: EInstructionName.div, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    // Logical instructions
    [EInstructionName.and]: {
        name: EInstructionName.and, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.or]: {
        name: EInstructionName.or, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.andi]: {
        name: EInstructionName.and, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.ori]: {
        name: EInstructionName.ori, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.sll]: {
        name: EInstructionName.sll, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    [EInstructionName.srl]: {
        name: EInstructionName.srl, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins },
    },
    // Data transfer instructions
    [EInstructionName.lw]: {
        name: EInstructionName.lw, isJumpInstruction: false, isMemoryInstruction: true, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns {
            if (ins.val0 && ins.instruction.imm) {
                let address = ins.val0 + Number(ins.instruction.imm);
                ins.res = mem.load(M.EMemBitLenOperation.word, address)
            }
            return ins;
        }
    },
    [EInstructionName.sw]: {
        name: EInstructionName.sw, isJumpInstruction: false, isMemoryInstruction: true, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.lh]: {
        name: EInstructionName.lh, isJumpInstruction: false, isMemoryInstruction: true, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.sh]: {
        name: EInstructionName.sh, isJumpInstruction: false, isMemoryInstruction: true, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.lb]: {
        name: EInstructionName.lb, isJumpInstruction: false, isMemoryInstruction: true, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.sb]: {
        name: EInstructionName.sb, isJumpInstruction: false, isMemoryInstruction: true, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.lui]: {
        name: EInstructionName.lui, isJumpInstruction: false, isMemoryInstruction: true, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.labelD, EInstructionParamType.register],
        [EInstructionParamType.register, EInstructionParamType.adress], [EInstructionParamType.register, EInstructionParamType.labelD]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.la]: {
        name: EInstructionName.la, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.li]: {
        name: EInstructionName.li, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.mfhi]: {
        name: EInstructionName.mfhi, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.mflo]: {
        name: EInstructionName.mflo, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.move]: {
        name: EInstructionName.move, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    // Conditional Branch instructions
    [EInstructionName.beq]: {
        name: EInstructionName.beq, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.bne]: {
        name: EInstructionName.bne, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.bgt]: {
        name: EInstructionName.bgt, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.bge]: {
        name: EInstructionName.bge, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.blt]: {
        name: EInstructionName.blt, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.ble]: {
        name: EInstructionName.ble, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: true,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.adress],
        [EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.labelT]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.slt]: {
        name: EInstructionName.slt, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.slti]: {
        name: EInstructionName.slti, isJumpInstruction: false, isMemoryInstruction: false, writeBack: true, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register, EInstructionParamType.register, EInstructionParamType.immidiate]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    // Unconditional jump instructions
    [EInstructionName.j]: {
        name: EInstructionName.j, isJumpInstruction: true, isMemoryInstruction: false, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.labelT], [EInstructionParamType.adress]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.jr]: {
        name: EInstructionName.jr, isJumpInstruction: true, isMemoryInstruction: false, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.register]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    },
    [EInstructionName.jal]: {
        name: EInstructionName.jal, isJumpInstruction: true, isMemoryInstruction: false, writeBack: false, isBranchInstruction: false,
        paramTypes: [[EInstructionParamType.labelT], [EInstructionParamType.adress]],
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins; }
    }
}