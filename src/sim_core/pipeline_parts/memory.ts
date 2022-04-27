import * as I from "../instruction"
import * as R from "../register";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"
import * as IF from "./fetch"

export class Memory {
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private memory: M.Memory
    private program: Prg.Program
    private registers: R.Registers
    private fetch: IF.Fetch

    constructor(pipeline: Pip.Pipeline, memory: M.Memory, program: Prg.Program, registers: R.Registers, fetch: IF.Fetch) {
        this.pipeline = pipeline;
        this.memory = memory;
        this.program = program
        this.registers = registers
        this.fetch = fetch
    }

    runRisingEdge() {
        this.data = this.pipeline.getMem(Pip.EPipelineMem.ex_mem);

        if (this.data.instruction.description.isBranchInstruction && this.data.res === 1) {
            if (typeof this.data.instruction.imm === "string") {
                this.program.setPCofLabel(this.data.instruction.imm);
                this.fetch.setFlush();
                this.pipeline.setMem(Pip.EPipelineMem.if_id, { ...Pip.NOP, pc: this.data.pc });
                this.pipeline.setMem(Pip.EPipelineMem.id_ex, { ...Pip.NOP, pc: this.data.pc });
            }
        }

        this.data = this.data.instruction.description.ExecuteMem(this.data, this.memory, this.registers);
        console.log("MEM:", this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.mem_wb, this.data);
    }
}