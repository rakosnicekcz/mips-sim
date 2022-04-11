import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Memory {
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private memory: M.Memory
    private program: Prg.Program
    private registers: R.Registers

    private setOutput: (output: string) => void

    constructor(pipeline: Pip.Pipeline, memory: M.Memory, program: Prg.Program, registers: R.Registers, setOutput: (output: string) => void) {
        this.pipeline = pipeline;
        this.memory = memory;
        this.program = program
        this.registers = registers
        this.setOutput = setOutput;
    }

    runRisingEdge(input: string) {
        this.data = this.pipeline.getMem(Pip.EPipelineMem.ex_mem);

        // TODO: cond jump
        if (this.data.instruction.description.isBranchInstruction && this.data.res === 1) {
            if (typeof this.data.instruction.imm === "string") {
                this.program.setPCofLabel(this.data.instruction.imm);
                this.pipeline.setMem(Pip.EPipelineMem.if_id, Pip.NOP);
                this.pipeline.setMem(Pip.EPipelineMem.id_ex, Pip.NOP);
                this.pipeline.stallIF();
            }
        }

        this.data = this.data.instruction.description.executeMem(this.data, this.memory, this.registers, input, this.setOutput);
        console.log("MEM:", this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.mem_wb, this.data);
    }
}