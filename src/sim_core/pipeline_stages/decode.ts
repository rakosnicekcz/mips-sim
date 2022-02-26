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

    runRisingEdge() {

        //todo stall a flush

        this.data = this.pipeline.getMem(Pip.EPipelineMem.if_id);
        this.readRegisters();
    }

    runFallingEdge() {
        if (this.data.instruction.isJumpInstruction) {
            this.pipeline.setMem(Pip.EPipelineMem.if_id, { instruction: { name: I.EInstructionName.noop, isJumpInstruction: false, }, pc: this.data.pc })
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