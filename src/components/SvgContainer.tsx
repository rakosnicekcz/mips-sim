/*
    Modul: SvgContainer.tsx
    Autor: Hůlek Matěj
*/

import { useEffect, useRef } from "react";
import React from "react";

import { SvgLoader, SvgProxy } from 'react-svgmt';
import { StagesState } from '../sim_core/pipeline';
import * as R from '../sim_core/register';

import pipelineSvg from '../images/pipeline-all.svg';


import RegistersAccordition from './RegistersAccordition'
import MemoryAccordition from './MemoryAccordition'

type SvgContainerProps = {
    isForwarding: boolean,
    isHazard: boolean,
    stagesState: StagesState,
    registers: R.IAllRegister[],
    memory: ArrayBuffer,
    setMemoryRange: (start: number, end: number) => void
    base: string,
    setBase: (value: string) => void
    start: number,
    setStart: (value: number) => void
    end: number,
    setEnd: (value: number) => void
};

const SvgContainer: React.FC<SvgContainerProps> = (props) => {
    const container = useRef(null);
    const maxSvgTextLen = 17;

    useEffect(() => {
        setSvgContentById("id_readData1", getHexaValue(props.stagesState.id.val0), true)
        setSvgContentById("id_readData2", getHexaValue(props.stagesState.id.val1), true)
        let ex_resultNum = props.stagesState.ex.instruction.description.isBranchInstruction ? undefined : props.stagesState.ex.res
        setSvgContentById("ex_result", getHexaValue(ex_resultNum), true)
        setSvgContentById("mem_address", getHexaValue(props.stagesState.mem.logs?.memUsedAddress), true)
        let mem_writeData: number | undefined = undefined;
        if (props.stagesState.mem.instruction.description.isMemoryInstruction &&
            !props.stagesState.mem.instruction.description.isMemoryLoadInstruction) {
            mem_writeData = props.stagesState.mem.val0
        }
        setSvgContentById("mem_writeData", getHexaValue(mem_writeData), true)
        let mem_readData = props.stagesState.mem.instruction.description.isMemoryLoadInstruction ? props.stagesState.mem.res : undefined
        setSvgContentById("mem_readData", getHexaValue(mem_readData), true)
        let wb_writeData = props.stagesState.wb.instruction.description.writeBack ? props.stagesState.wb.res : undefined
        setSvgContentById("wb_writeData", getHexaValue(wb_writeData))
        setSvgContentById("mem_forward_result", getHexaValue(props.stagesState.mem.res))
        let ex_zero = props.stagesState.ex.instruction.description.isBranchInstruction ? props.stagesState.ex.res : 0
        setSvgContentById("ex_zero", String(ex_zero))
        let forwarding_val0 = props.stagesState.ex.logs?.forwardedVal0
        setSvgContentById("forwarding_val0", String(forwarding_val0 === undefined ? 2 : forwarding_val0))
        let forwarding_val1 = props.stagesState.ex.logs?.forwardedVal1
        setSvgContentById("forwarding_val1", String(forwarding_val1 === undefined ? 2 : forwarding_val1))
    }, [props.stagesState])

    let setSvgContentById = (id: string, content: string, isVertical: boolean = false) => {

        let createVerticalContent = (ele: Element): string => {
            if (content.length !== 8) {
                throw new Error("content must have 8 characters");
            }
            let tspan = ele.querySelector("tspan");
            if (tspan) {
                let tspanXpos = tspan.x.baseVal[0].value
                let html = content[0]
                for (let i = 1; i < content.length; i++) {
                    html += `<tspan x="${tspanXpos}" dy="0.8em">&ZeroWidthSpace;</tspan>${content[i]}`
                }
                return html
            }
            return ""
        }

        if (container.current) {
            let cont: Element = container.current
            let svg = cont.querySelector("svg")
            let ele = svg?.querySelector("#" + id)
            if (ele) {
                ele.innerHTML = isVertical ? createVerticalContent(ele) : content
            }
        }
    }

    const getHexaValue = (value: number | undefined): string => {
        if (value === undefined) {
            return " ".repeat(8)
        }
        if (value < 0) {
            value = 0xffffffff + value + 1;
        }
        let result = value.toString(16)
        if (result.length < 8) {
            result = '0'.repeat(8 - result.length) + result;
        }
        return result

    }

    let justifySVGtextlength = (text: string) => {
        if (text.length > maxSvgTextLen) {
            return text.substring(0, maxSvgTextLen - 3) + "..."
        }
        return text
    }

    return (
        <div className="svgLoaderContainer" ref={container}>
            <SvgLoader path={pipelineSvg} className="svgLoader">
                <SvgProxy selector="#if_instr" children={justifySVGtextlength(props.stagesState.if.instruction.originalNotation)} />
                <SvgProxy selector="#id_instr" children={justifySVGtextlength(props.stagesState.id.instruction.originalNotation)} />
                <SvgProxy selector="#ex_instr" children={justifySVGtextlength(props.stagesState.ex.instruction.originalNotation)} />
                <SvgProxy selector="#mem_instr" children={justifySVGtextlength(props.stagesState.mem.instruction.originalNotation)} />
                <SvgProxy selector="#wb_instr" children={justifySVGtextlength(props.stagesState.wb.instruction.originalNotation)} />
                <SvgProxy selector=".noForwardingUnit" class={props.isForwarding ? "displayNone" : "displayBlock"} />
                <SvgProxy selector=".forwardingUnit" class={!props.isForwarding ? "displayNone" : "displayBlock"} />
                <SvgProxy selector=".noHazardUnit" class={props.isHazard ? "displayNone" : "displayBlock"} />
                <SvgProxy selector=".hazardUnit" class={!props.isHazard ? "displayNone" : "displayBlock"} />
            </SvgLoader>
            <div className='regMemContainer'>
                <RegistersAccordition
                    registers={props.registers}
                />
                <MemoryAccordition
                    memory={props.memory}
                    setMemoryRange={props.setMemoryRange}
                    base={props.base}
                    setBase={props.setBase}
                    start={props.start}
                    setStart={props.setStart}
                    end={props.end}
                    setEnd={props.setEnd}
                />
            </div>
        </div>
    )
}

export default React.memo(SvgContainer);