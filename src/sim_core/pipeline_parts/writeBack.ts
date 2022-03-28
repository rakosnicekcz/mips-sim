import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class WriteBack {
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private registers: R.Registers

    constructor(pipeline: Pip.Pipeline, registers: R.Registers) {
        this.pipeline = pipeline;
        this.registers = registers;
    }

    runRisingEdge() {
        this.data = this.pipeline.getMem(Pip.EPipelineMem.mem_wb);
        if (this.data.instruction.description.writeBack) {
            if (this.data.instruction.arg0 && this.data.res) { //TS to be happy
                this.registers.setVal(this.data.instruction.arg0, this.data.res)
            }
        }
        this.registers.printAllRegisters()
    }
}