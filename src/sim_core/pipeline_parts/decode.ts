import * as I from "../instruction"
import * as R from "../register";
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Decode {
    private stall = false;
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private registers: R.Registers
    private program: Prg.Program

    constructor(pipeline: Pip.Pipeline, registers: R.Registers, prg: Prg.Program) {
        this.pipeline = pipeline;
        this.registers = registers;
        this.program = prg
    }
    setStall() {
        this.stall = true;
    }

    runRisingEdge() {

        if (this.stall) {
            this.stall = false;
            this.data = { ...Pip.NOP, pc: this.data.pc }
            return;
        }

        this.data = this.pipeline.getMem(Pip.EPipelineMem.if_id);
        this.readRegisters();
        console.log("ID:", this.data);
    }

    runFallingEdge() {
        if (this.data.instruction.description.isJumpInstruction) {
            let noop = { ...Pip.NOP, pc: this.data.pc }
            noop.pc = this.data.pc
            this.pipeline.setMem(Pip.EPipelineMem.if_id, noop)
            if (typeof this.data.instruction.imm === "string") {
                this.program.setPCofLabel(this.data.instruction.imm)
                if (this.data.instruction.description.name === I.EInstructionName.jal) {
                    this.registers.setVal(R.ERegisters.$31, this.data.instruction.address + 4)
                }
            } else if (this.data.val0) {
                this.program.setPC(this.data.val0)
            }
        }
        this.pipeline.setMem(Pip.EPipelineMem.id_ex, this.data)
    }

    private readRegisters(): void {
        if (this.data.instruction.description.name === I.EInstructionName.mfhi) {
            this.data.val0 = this.registers.getHi();
            return;
        }
        if (this.data.instruction.description.name === I.EInstructionName.mflo) {
            this.data.val0 = this.registers.getLo();
            return;
        }
        if (this.data.instruction.arg1) {
            this.data.val0 = this.registers.getVal(this.data.instruction.arg1)
        }
        if (this.data.instruction.arg2) {
            this.data.val1 = this.registers.getVal(this.data.instruction.arg2)
        }
    }
}