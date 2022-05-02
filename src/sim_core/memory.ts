import deepcopy from "deepcopy";
import { setError } from "../App"

export enum EMemBitLenOperation {
    byte = 1,
    halfword = 2,
    word = 4
}

export enum EMemStaticOperations {
    word = ".word",
    half = ".half",
    byte = ".byte",
    ascii = ".ascii",
    asciiz = ".asciiz",
    space = ".space",
    align = ".align"
}

export interface IMemStaticData {
    address: number;
    name: string;
    type: EMemStaticOperations;
    value: Int8Array;
    align?: number
}

const dataRange = { from: 0x10010000, to: 0x1003ffff } as const
const heapRange = { from: 0x10040000, to: 0x1FFFFFFF } as const
export const stackRange = { from: 0x70000000, to: 0x7ffffffc } as const

export class Memory {
    private heap: ArrayBuffer;
    private heapPointer: number = heapRange.from;

    private data: IMemStaticData[];
    private dataBuffer: ArrayBuffer;

    private stack: ArrayBuffer;

    constructor() {
        this.heap = new ArrayBuffer(heapRange.to - heapRange.from);
        this.stack = new ArrayBuffer(stackRange.to - stackRange.from);
        this.dataBuffer = new ArrayBuffer(dataRange.to - dataRange.from);
    }

    load(oplen: EMemBitLenOperation, address: number, label?: string): number {
        console.log("load", address, label)
        if (label) {
            let data = this.data.find(e => e.name === label)
            if (data) {
                address += data.address
            }
        }
        if (heapRange.from <= address && address <= heapRange.to) {
            return this.loadFromBuffer(oplen, this.heap, address, heapRange.from)
        } else if (stackRange.from <= address && address <= stackRange.to) {
            return this.loadFromBuffer(oplen, this.stack, address, stackRange.from)
        } else if (dataRange.from <= address && address <= dataRange.to) {
            return this.loadFromBuffer(oplen, this.dataBuffer, address, dataRange.from)
        }
        console.log(dataRange, address)
        setError(`memory load: address ${address} out of boundary`);
        throw new Error("");
    }

    private loadFromBuffer(oplen: EMemBitLenOperation, buffer: ArrayBuffer, address: number, rangeFrom: number) {
        const addShort = address - rangeFrom
        let view = new DataView(buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                return deepcopy(view.getInt8(addShort));
            case EMemBitLenOperation.halfword:
                if (address % 2 !== 0) {
                    setError(`memory load: address ${address} not halfword aligned`);
                }
                return deepcopy(view.getInt16(addShort, true));
            case EMemBitLenOperation.word:
                if (address % 4 !== 0) {
                    setError(`memory load: address ${address} not word aligned`);
                }
                return deepcopy(view.getInt32(addShort, true));
        }
    }

    store(oplen: EMemBitLenOperation, address: number, value: number, label?: string): void {
        if (label) {
            let data = this.data.find(e => e.name === label)
            if (data) {
                address += data.address
            }
        }

        if (heapRange.from <= address && address <= heapRange.to) {
            this.storeToBuffer(oplen, this.heap, address, value, heapRange.from)
        } else if (stackRange.from <= address && address <= stackRange.to) {
            this.storeToBuffer(oplen, this.stack, address, value, stackRange.from)
        } else if (dataRange.from <= address && address <= dataRange.to) {
            this.storeToBuffer(oplen, this.dataBuffer, address, value, dataRange.from)
        } else {
            setError("Wrong operation with memory: " + address);
        }
    }

    private storeToBuffer(oplen: EMemBitLenOperation, buffer: ArrayBuffer, address: number, value: number, rangeFrom: number) {
        const addShort = address - rangeFrom
        let view = new DataView(buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                view.setInt8(addShort, value)
                return;
            case EMemBitLenOperation.halfword:
                if (address % 2 !== 0) {
                    setError(`memory store: address ${address} not halfword aligned`);
                }
                view.setInt16(addShort, value, true)
                return;
            case EMemBitLenOperation.word:
                if (address % 4 !== 0) {
                    setError(`memory store: address ${address} not word aligned`);
                }
                view.setInt32(addShort, value, true)
                return;
        }
    }

    setData(data: IMemStaticData[]) {
        console.log("data:", data)
        let add: number = dataRange.from;
        let view = new DataView(this.dataBuffer)
        data.forEach(e => {
            if (e.align) {
                let pow = Math.pow(2, e.align)
                if (add % pow !== 0) {
                    add += (pow - (add % pow))
                }
            } else if (e.type === EMemStaticOperations.word) {
                if (add % 4 !== 0) {
                    add += (4 - (add % 4))
                }
            } else if (e.type === EMemStaticOperations.half) {
                if (add % 2 !== 0) { add++ }
            }
            e.address = add

            e.value.forEach(v => {
                view.setInt8(add - dataRange.from, v)
                add++
            })
        })
        this.data = data;
        console.log(view)
    }

    allocateHeap(size: number): number {
        let address = this.heapPointer + this.heapPointer % 4;
        this.heapPointer = address + size;
        return address;
    }

    getLabel(label: string): IMemStaticData {
        let e = this.data.find(e => e.name === label)
        if (e) {
            return e
        }
        setError(`Label ${label} not found`);
        throw new Error("");
    }

    printBuffers() {
        console.log("dynamicBuffer:", this.heap)
        console.log("staticBuffer:", this.dataBuffer)
        console.log("stack:", this.stack)
    }
}