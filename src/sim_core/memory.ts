import deepcopy from "deepcopy";

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
            address -= heapRange.from
            return this.loadFromBuffer(oplen, this.heap, address)
        } else if (stackRange.from <= address && address <= stackRange.to) {
            address -= stackRange.from
            return this.loadFromBuffer(oplen, this.stack, address)
        } else if (dataRange.from <= address && address <= dataRange.to) {
            address -= dataRange.from
            return this.loadFromBuffer(oplen, this.dataBuffer, address)
        }
        console.log(dataRange, address)
        throw new Error("Address out of boundary");
    }

    private loadFromBuffer(oplen: EMemBitLenOperation, buffer: ArrayBuffer, address: number) {
        let view = new DataView(buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                return deepcopy(view.getInt8(address));
            case EMemBitLenOperation.halfword:
                if (address % 2 !== 0) {
                    throw new Error("Wrong address alligment");
                }
                return deepcopy(view.getInt16(address, true));
            case EMemBitLenOperation.word:
                if (address % 4 !== 0) {
                    throw new Error("Wrong address alligment");
                }
                return deepcopy(view.getInt32(address, true));
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
            address -= heapRange.from
            this.storeToBuffer(oplen, this.heap, address, value)
        } else if (stackRange.from <= address && address <= stackRange.to) {
            address -= stackRange.from
            this.storeToBuffer(oplen, this.stack, address, value)
        } else if (dataRange.from <= address && address <= dataRange.to) {
            address -= dataRange.from
            this.storeToBuffer(oplen, this.dataBuffer, address, value)
        } else {
            throw new Error("Wrong operation with memory: " + address);
        }
    }

    private storeToBuffer(oplen: EMemBitLenOperation, buffer: ArrayBuffer, address: number, value: number) {
        let view = new DataView(buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                view.setInt8(address, value)
                return;
            case EMemBitLenOperation.halfword:
                if (address % 2 !== 0) {
                    throw new Error("Wrong address alligment " + address);
                }
                view.setInt16(address, value, true)
                return;
            case EMemBitLenOperation.word:
                if (address % 4 !== 0) {
                    throw new Error("Wrong address alligment: " + address);
                }
                view.setInt32(address, value, true)
                return;
        }
    }

    setData(data: IMemStaticData[]) {
        console.log("data:", data)
        let add: number = dataRange.from;
        let view = new DataView(this.dataBuffer)
        data.forEach(e => {
            if (e.align) {
                add = add + add % Math.pow(2, e.align)
            } else if (e.type === EMemStaticOperations.word) {
                add = add + add % 4
            } else if (e.type === EMemStaticOperations.half) {
                add = add + add % 2
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
        throw new Error("Label not found");
    }

    printBuffers() {
        console.log("dynamicBuffer:", this.heap)
        console.log("staticBuffer:", this.dataBuffer)
        console.log("stack:", this.stack)
    }
}