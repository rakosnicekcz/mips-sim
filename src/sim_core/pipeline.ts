import * as I from "./instruction"
import * as R from "./registr";
import * as M from "./memory"
import * as P from "./program"
import * as IF from "./pipeline_parts/fetch"
import * as ID from "./pipeline_parts/decode"
import * as EX from "./pipeline_parts/execute"
import * as MEM from "./pipeline_parts/memory"
import * as WB from "./pipeline_parts/writeBack"
import * as H from "./pipeline_parts/hazardUnit"
import * as F from "./pipeline_parts/forwardingUnit"
import { IParsed } from "./parser"

import deepcopy from 'deepcopy';


export interface IPipelineIns {
    instruction: I.IInstruction;
    pc: number;
    val0?: number;
    val1?: number;
    res?: number;
    resHiLo?: { hi: number, lo: number }
}

export enum EPipelineMem {
    if_id,
    id_ex,
    ex_mem,
    mem_wb
}

export const NOP: IPipelineIns = {
    instruction: { description: I.instruction_set.nop, address: -1, line: -1, paramType: [] },
    pc: 0,
}

export type TSetOutput = (output: string) => void;

export class Pipeline {
    private reg: R.Registers;
    private mem: M.Memory;
    private prg: P.Program;

    private if_id: IPipelineIns = NOP;
    private id_ex: IPipelineIns = NOP;
    private ex_mem: IPipelineIns = NOP;
    private mem_wb: IPipelineIns = NOP;

    private if_stage: IF.Fetch
    private id_stage: ID.Decode
    private ex_stage: EX.Execute
    private mem_stage: MEM.Memory
    private wb_stage: WB.WriteBack

    private hazardUnit: H.HazardUnit
    private forwarding: F.ForwardingUnit
    private isForwarding: boolean

    private setOutput: TSetOutput

    constructor(setOutput: TSetOutput, isForwarding: boolean = true) {
        this.setOutput = setOutput

        this.reg = new R.Registers();
        this.mem = new M.Memory();
        this.prg = new P.Program();

        this.if_stage = new IF.Fetch(this, this.prg)
        this.id_stage = new ID.Decode(this, this.reg, this.prg);
        this.ex_stage = new EX.Execute(this, this.prg, this.mem)
        this.mem_stage = new MEM.Memory(this, this.mem, this.prg, this.reg, this.setOutput);
        this.wb_stage = new WB.WriteBack(this, this.reg)

        this.hazardUnit = new H.HazardUnit(this.if_stage, this.id_stage, this, isForwarding)
        this.forwarding = new F.ForwardingUnit(this);
        this.isForwarding = isForwarding
    }

    run(input: string) {
        this.hazardUnit.run();
        if (this.isForwarding) { this.forwarding.run(); }
        this.wb_stage.runRisingEdge();
        this.mem_stage.runRisingEdge(input);
        this.ex_stage.runRisingEdge();
        this.id_stage.runRisingEdge();
        this.if_stage.runRisingEdge();
        this.mem_stage.runFallingEdge();
        this.ex_stage.runFallingEdge();
        this.id_stage.runFallingEdge();
        console.log("if_id:", this.if_id, "id_ex:", this.id_ex, "ex_mem:", this.ex_mem, "mem_wb:", this.mem_wb)
    }

    setMem(mem: EPipelineMem, value: IPipelineIns): void {
        switch (mem) {
            case EPipelineMem.if_id:
                this.if_id = deepcopy(value)
                break;
            case EPipelineMem.id_ex:
                this.id_ex = deepcopy(value)
                break;
            case EPipelineMem.ex_mem:
                this.ex_mem = deepcopy(value)
                break;
            case EPipelineMem.mem_wb:
                this.mem_wb = deepcopy(value)
                break;
        }
    }

    getMem(mem: EPipelineMem): IPipelineIns {
        switch (mem) {
            case EPipelineMem.if_id:
                return deepcopy(this.if_id)
            case EPipelineMem.id_ex:
                return deepcopy(this.id_ex)
            case EPipelineMem.ex_mem:
                return deepcopy(this.ex_mem)
            case EPipelineMem.mem_wb:
                return deepcopy(this.mem_wb)
        }
    }

    setProgram(parsed: IParsed, isForwarding: boolean = true) {
        this.prg.setProgram(parsed.instructions, parsed.labels)
        this.mem.setData(parsed.data)
        this.isForwarding = isForwarding
        this.hazardUnit.setForwarding(isForwarding)
    }

    stallIF() {
        this.if_stage.setStall();
    }
}