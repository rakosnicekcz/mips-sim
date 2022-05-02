import * as I from "./instruction"
import * as R from "./register"
import * as M from "./memory"
import * as P from "./program"
import deepcopy from "deepcopy";
import { setError } from "../App"

enum ParsingArea {
    text,
    data
}

export interface IParsed {
    instructions: I.IInstruction[];
    labels: P.Ilabel[]
    data: M.IMemStaticData[]
}

export class Parser {
    private parsingArea: ParsingArea = ParsingArea.text
    private globl: string
    private labels: P.Ilabel[] = [];
    private Instructions: I.IInstruction[] = [];
    private staticData: M.IMemStaticData[] = [];
    private staticDataAdd: number = 0;
    private alignNext: number = -1; // -1 = no align

    reset() {
        this.parsingArea = ParsingArea.text
        this.Instructions = [];
        this.labels = [];
        this.staticData = [];
        this.staticDataAdd = 0;
        this.alignNext = -1;
    }

    parse(code: string): IParsed {
        console.log(code)
        let codeLines = code.split("\n").map((e) => { return e.split(/#(?![^"]*")/g)[0].trim() }); // split for comments
        for (let i = 0; i < codeLines.length; i++) {
            let lineParts = this.getLineParts(codeLines[i])
            console.log(lineParts);

            if (lineParts.length === 0) {
                continue;
            } else if (lineParts[0] === ".text" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.text
            } else if (lineParts[0] === ".data" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.data
            } else if (lineParts[0] === ".globl" && lineParts.length === 2) {
                if (this.globl) {
                    setError(".globl can be set only once")
                }
                this.globl = lineParts[1];
            } else {
                this.parseData(lineParts, i);
            }
        }
        this.parsingArea = ParsingArea.text;

        for (let i = 0; i < codeLines.length; i++) {
            let lineParts = this.getLineParts(codeLines[i])
            console.log(lineParts);

            if (lineParts.length === 0) {
                continue;
            } else if (lineParts[0] === ".text" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.text
            } else if (lineParts[0] === ".data" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.data
            } else if (lineParts[0] === ".globl" && lineParts.length === 2) {
                if (this.globl) {
                    setError(".globl can be set only once");
                }
                this.globl = lineParts[1];
            } else {
                this.parseText(lineParts, i);
            }
        }

        console.log(this.Instructions, this.labels, this.staticData)
        return { instructions: this.Instructions, labels: this.labels, data: this.staticData }
    }

    private getLineParts(line: string): string[] {
        let lineParts = line.split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
        lineParts = lineParts.filter(e => { return !["", ","].includes(e.trim()) })
        return lineParts.map(e => { return e.trim().replace(/^,+|,+$/g, '') })
    }

    private parseData(lineParts: string[], i: number) {
        if (this.parsingArea !== ParsingArea.data) {
            if (lineParts[0].endsWith(":")) {
                if (Object.values(I.EInstructionName).includes(lineParts[0].slice(0, -1) as unknown as I.EInstructionName)) {
                    setError("Label cant have same name as instruction");
                }
                this.labels.push({ line: i + 1, address: i + 1, name: lineParts[0].slice(0, -1) })
            }
            return;
        }

        let align = this.alignNext !== -1 ? this.alignNext : undefined
        this.alignNext = -1;
        let con: M.IMemStaticData = { address: this.staticDataAdd, name: "", type: M.EMemStaticOperations.byte, value: new Int8Array(1), align: align };

        if (lineParts[0] === M.EMemStaticOperations.align) {
            if (lineParts.length !== 2 || isNaN(Number(lineParts[1]))) {
                setError("Align must have one number parameter");
            }
            this.alignNext = Number(lineParts[1]);
            return;
        }

        if (/^_?[a-zA-Z][a-zA-Z0-9_]*:$/.test(lineParts[0])) {
            con.name = lineParts[0].slice(0, -1);
            if (Object.values(I.EInstructionName).includes(con.name as unknown as I.EInstructionName)) {
                setError("Label cant have same name as instruction");
            } else if (this.staticData.some(e => e.name === con.name)) {
                setError("Label cant have same name as other label");
            }
        } else {
            setError("Wrong name of static value: " + lineParts[0]);
        }

        let directiveId = Object.keys(M.EMemStaticOperations).indexOf(lineParts[1].substring(1))
        if (directiveId === -1) {
            setError("Wrong Directive");
        } else {
            con.type = Object.values(M.EMemStaticOperations)[directiveId]
        }

        if (con.type === M.EMemStaticOperations.space) {
            if (isNaN(Number(lineParts[2])) || lineParts.length !== 3) {
                setError("Wrong Space definition");
            } else {
                con.value = new Int8Array(Number(lineParts[2]))
            }
        } else if (con.type === M.EMemStaticOperations.ascii || con.type === M.EMemStaticOperations.asciiz) {
            lineParts.slice(2).join(" ");
            if (lineParts.length !== 3 || !/^".*"$/.test(lineParts[2])) {
                setError("Wrong ascii/z definition");
            }
            let enc = new TextEncoder();
            let txt = lineParts[2].slice(1, -1)
            txt = txt.replace(/\\n/g, '\n');
            if (con.type === M.EMemStaticOperations.asciiz) {
                con.value = new Int8Array([...enc.encode(txt), 0x00])
            } else {
                con.value = new Int8Array([...enc.encode(txt)]);
            }
        } else {
            let vals = lineParts.slice(2).map(e => {
                if (isNaN(Number(e))) {
                    if (!/^'.'$/.test(e)) {
                        setError("Wrong number definition");
                    }
                    return e.charCodeAt(1);
                }
                return Number(e);
            })
            if (vals.filter(e => isNaN(e)).length > 0) {
                setError("Wrong elements in array");
            }
            if (con.type === M.EMemStaticOperations.byte) {
                con.value = new Int8Array(vals)
            } else if (con.type === M.EMemStaticOperations.half) {
                con.value = new Int8Array(new Int16Array(vals).buffer)
            } else {
                con.value = new Int8Array(new Int32Array(vals).buffer)
            }
        }
        this.staticDataAdd += con.value.byteLength
        this.staticData.push(con)
    }

    private parseText(lineParts: string[], i: number) {
        if (this.parsingArea !== ParsingArea.text) {
            return;
        }

        if (lineParts[0].endsWith(":")) {
            lineParts.shift()
        }

        if (lineParts.length === 0) {
            return
        }

        if (Object.values(I.EInstructionName).includes(lineParts[0] as unknown as I.EInstructionName)) {
            let insName = I.EInstructionName[lineParts[0] as keyof typeof I.EInstructionName]
            let ins: I.IInstruction = {
                description: I.instruction_set[insName], address: 0, line: i + 1, paramType: [],
                originalNotation: lineParts.join(", ").replace(",", "")
            };
            ins = this.parseInstruction(insName, ins, lineParts);
            ins = ins.description.checkParsed(ins)
            this.Instructions.push(ins)
        } else {
            setError(`Instruction ${lineParts[0]} do not exist;`);
        }
    }

    private parseInstruction(insName: I.EInstructionName, ins: I.IInstruction, lineParts: string[]): I.IInstruction {
        paramTypeLoop:
        for (const paramType of I.instruction_set[insName].paramTypes) {
            let instr = deepcopy(ins);
            instr.paramType = paramType;

            if (instr.description.isMemoryInstruction && lineParts.length === 3 && /^\w+\([a-zA-Z0-9_$]+\)$/.test(lineParts[2])) { //instr rt, imm(rs)
                let parts = lineParts[2].split("(");
                lineParts[2] = parts[0];
                lineParts.push(parts[1].slice(0, -1))
                console.log("new lineParts", lineParts)
            }

            if (lineParts.length !== paramType.length + 1) {
                continue;
            }

            for (let i = 0; i < paramType.length; i++) {
                const type = paramType[i];
                const param = lineParts[i + 1];

                let assignParams = (reg: R.ERegisters) => {
                    if (!instr.arg0 && !instr.description.noRDparam) {
                        instr.arg0 = reg
                    } else if (!instr.arg1) {
                        instr.arg1 = reg
                    } else {
                        instr.arg2 = reg
                    }
                }

                if (type === I.EInstructionParamType.adress || type === I.EInstructionParamType.immidiate) {
                    if (/^'.'$/.test(param)) {
                        instr.imm = param.charCodeAt(1);
                    } else if (isNaN(Number(param))) {
                        continue paramTypeLoop;
                    } else {
                        instr.imm = Number(param)
                    }
                } else if (type === I.EInstructionParamType.labelT) {
                    if (this.labels.some(e => e.name === param)) {
                        instr.imm = param
                    } else {
                        continue paramTypeLoop;
                    }
                } else if (type === I.EInstructionParamType.labelD) {
                    if (this.staticData.some(e => e.name === param)) {
                        instr.imm = param
                    } else {
                        continue paramTypeLoop;
                    }
                } else if (Object.values(R.ERegisters).includes(param as unknown as R.ERegisters)) { // instruction name
                    const regId = Object.values(R.ERegisters).indexOf(param as unknown as R.ERegisters);
                    let reg = Object.values(R.ERegisters)[regId]
                    assignParams(reg)
                } else if (Object.keys(R.ERegisters).includes(param as unknown as R.ERegisters)) { // instruction alternative name
                    const regId = Object.keys(R.ERegisters).indexOf(param as unknown as R.ERegisters);
                    let reg = Object.values(R.ERegisters)[regId]
                    assignParams(reg)
                } else {
                    continue paramTypeLoop;
                }
            }
            return instr;
        }
        setError(`Wrong Instruction format on line ${ins.line}`);
        throw new Error("");
    }
}