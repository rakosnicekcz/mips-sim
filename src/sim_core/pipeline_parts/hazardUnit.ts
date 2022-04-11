import * as I from "../instruction";
import * as R from "../registr";
import * as M from "../memory";
import * as P from "../pipeline"
import { Fetch } from "./fetch"
import { Decode } from "./decode"

export class HazardUnit {
    private fetch: Fetch
    private decode: Decode
    private pip: P.Pipeline

    constructor(fetch: Fetch, decode: Decode, pip: P.Pipeline) {
        this.fetch = fetch;
        this.decode = decode;
        this.pip = pip;
    }

    run() {
        const ex_mem = this.pip.getMem(P.EPipelineMem.ex_mem)
        const id_ex = this.pip.getMem(P.EPipelineMem.id_ex)
        const if_id = this.pip.getMem(P.EPipelineMem.if_id)
        if (id_ex.instruction.description.isMemoryLoadInstruction) {
            if ((if_id.instruction.arg1 === id_ex.instruction.arg0 && id_ex.instruction.arg0 !== undefined) ||
                (if_id.instruction.arg2 === id_ex.instruction.arg0 && id_ex.instruction.arg0 !== undefined)) {
                this.fetch.setStall();
                this.decode.setStall();
            }
        } else if (if_id.instruction.description.name === I.EInstructionName.jr) {
            if ((id_ex.instruction.arg0 === if_id.instruction.arg1 && if_id.instruction.arg1 !== undefined) ||
                (ex_mem.instruction.arg0 === if_id.instruction.arg1 && if_id.instruction.arg1 !== undefined)) {
                this.fetch.setStall();
                this.decode.setStall();
            }
        }
    }
}