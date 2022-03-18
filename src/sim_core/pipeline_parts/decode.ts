import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Decode {
    private stall = false;
    private flush = false;
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private registers: R.Registers

    constructor(pipeline: Pip.Pipeline, registers: R.Registers) {
        this.pipeline = pipeline;
        this.registers = registers;
    }

    setFlush() {
        this.flush = true
    }

    setStall() {
        this.stall = true;
    }

    runRisingEdge() {

        if (this.flush || this.stall) {
            this.flush = this.stall = false;
            this.pipeline.setMem(Pip.EPipelineMem.if_id, Pip.NOOP)
            return;
        }

        this.data = this.pipeline.getMem(Pip.EPipelineMem.if_id);
        this.readRegisters();
        console.log("ID:", this.data);
    }

    runFallingEdge() {
        if (this.data.instruction.description.isJumpInstruction) {
            let noop = Pip.NOOP
            noop.pc = this.data.pc
            this.pipeline.setMem(Pip.EPipelineMem.if_id, noop)
            // TODO setPCofLabel
        }
        this.pipeline.setMem(Pip.EPipelineMem.id_ex, this.data)
    }

    private readRegisters(): void {
        if (this.data.instruction.arg1) {
            this.data.val0 = this.registers.getVal(this.data.instruction.arg1)
        }
        if (this.data.instruction.arg2) {
            this.data.val1 = this.registers.getVal(this.data.instruction.arg2)
        }
    }
}