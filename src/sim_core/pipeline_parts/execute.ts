import * as I from "../instruction"
import * as R from "../register";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Execute {
    private flush = false;
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private program: Prg.Program
    private memory: M.Memory

    constructor(pipeline: Pip.Pipeline, program: Prg.Program, memory: M.Memory) {
        this.pipeline = pipeline;
        this.program = program;
        this.memory = memory;
    }

    setFlush() {
        this.flush = true;
    }

    runRisingEdge() {

        if (this.flush) {
            this.flush = false;
            this.data = { ...Pip.NOP, pc: this.data.pc };
            return;
        }

        this.data = this.pipeline.getMem(Pip.EPipelineMem.id_ex);
        this.data = this.data.instruction.description.execute(this.data, this.program, this.memory)
        console.log("EX:", this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.ex_mem, this.data);
    }
}