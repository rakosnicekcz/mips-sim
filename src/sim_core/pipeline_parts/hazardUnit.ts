import * as I from "../instruction";
import * as R from "../register";
import * as M from "../memory";
import * as P from "../pipeline"
import { Fetch } from "./fetch"
import { Decode } from "./decode"

export class HazardUnit {
    private fetch: Fetch
    private decode: Decode
    private pip: P.Pipeline
    private isForwarding: boolean

    constructor(fetch: Fetch, decode: Decode, pip: P.Pipeline, isForwarding: boolean = true) {
        this.fetch = fetch;
        this.decode = decode;
        this.pip = pip;
        this.isForwarding = isForwarding;
    }

    run() {
        const ex_mem = this.pip.getMem(P.EPipelineMem.ex_mem)
        const id_ex = this.pip.getMem(P.EPipelineMem.id_ex)
        const if_id = this.pip.getMem(P.EPipelineMem.if_id)
        if (this.checkDependence(if_id, id_ex) && id_ex.instruction.description.mainExecutionStage !== I.EPipelineStages.decode) {
            if (id_ex.instruction.description.name === I.EInstructionName.syscall) {
                // result of syscall ($v0) cant be forwarded
                this.stall()
            } else if (id_ex.instruction.description.isMemoryInstruction) {
                this.stall();
            } else if (if_id.instruction.description.mainExecutionStage === id_ex.instruction.description.mainExecutionStage) {
                if (!this.isForwarding) {
                    // arithmetic after arithmetic, memory after memory
                    this.stall()
                }
            } else if (if_id.instruction.description.mainExecutionStage < id_ex.instruction.description.mainExecutionStage) {
                // arithmetic after memory
                this.stall()
            } else {
                // memory after arithmetic
                if (!this.isForwarding) {
                    this.stall()
                }
            }
        } else if (this.checkDependence(if_id, ex_mem) && ex_mem.instruction.description.name !== I.EInstructionName.syscall) {
            if (if_id.instruction.description.isJumpInstruction && if_id.instruction.description.mainExecutionStage !== ex_mem.instruction.description.mainExecutionStage) {
                this.stall();
            } else if (!this.isForwarding) {
                this.stall()
            }
        } else if (this.checkJalRewrite(if_id, id_ex)) {
            this.stall();
        } else if (this.checkJalRewrite(if_id, ex_mem)) {
            this.stall();
        } else if (if_id.instruction.description.isJumpInstruction &&
            (id_ex.instruction.description.isBranchInstruction || ex_mem.instruction.description.isBranchInstruction)) {
            this.stall();
        }
    }

    private stall() {
        this.fetch.setStall();
        this.decode.setStall();
    }

    private checkDependence(if_id: P.IPipelineIns, mem: P.IPipelineIns): boolean {
        let if_id_req = this.getRquiredValues(if_id);
        let mem_chng = this.getChangedValues(mem);

        return if_id_req.some(e => {
            return mem_chng.includes(e);
        });
    }

    // when jal instruction change $31, but there is instruction in front of it, which change it too.
    /*
    example:
    
    li $31, 42
    move $10, $31
    jal end
    */
    private checkJalRewrite(if_id: P.IPipelineIns, mem: P.IPipelineIns): boolean {
        let if_id_chng = this.getChangedValues(if_id);
        let mem_chng = this.getChangedValues(mem);

        let change = if_id_chng.some(e => {
            return mem_chng.includes(e);
        });
        return change && if_id.instruction.description.name === I.EInstructionName.jal;
    }

    private getRquiredValues(ins: P.IPipelineIns): I.TEditableValue[] {
        let required = ins.instruction.description.requireSpecial;
        if (ins.instruction.arg1 !== undefined) {
            required.push(ins.instruction.arg1);
        }
        if (ins.instruction.arg2 !== undefined) {
            required.push(ins.instruction.arg2);
        }
        return required
    }

    private getChangedValues(ins: P.IPipelineIns): I.TEditableValue[] {
        return ins.instruction.description.changedValues.map(e => {
            if (e === I.editableValues.RD && ins.instruction.arg0 !== undefined) {
                return ins.instruction.arg0;
            }
            return e
        })
    }

    setForwarding(isForwarding: boolean): void {
        this.isForwarding = isForwarding;
    }
}