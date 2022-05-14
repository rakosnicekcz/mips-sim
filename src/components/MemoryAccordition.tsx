/*
    Modul: MemoryAccordion.tsx
    Autor: Hůlek Matěj
*/

import { useState } from 'react';
import * as M from '../sim_core/memory';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfiniteScroll from 'react-infinite-scroll-component'
import Switch from '@mui/material/Switch';

import { FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

type MemoryAccorditionProps = {
    memory: ArrayBuffer
    setMemoryRange: (start: number, end: number) => void
    base: string,
    setBase: (value: string) => void
    start: number
    setStart: (value: number) => void
    end: number
    setEnd: (value: number) => void
};

const MemoryAccordition: React.FC<MemoryAccorditionProps> = (props) => {
    const [isHexa, setIsHexa] = useState(true)

    const loadMore = async () => {
        if (props.base === "Stack") {
            props.setMemoryRange(props.start - 4 * 10, props.end)
            props.setStart(props.start - 4 * 10);
        } else {
            props.setMemoryRange(props.start, props.end + 4 * 10)
            props.setEnd(props.end + 4 * 10)
        }
    };

    const handleSegmentChange = (event: SelectChangeEvent) => {
        switch (event.target.value) {
            case "Data":
                props.setStart(M.dataRange.from);
                props.setEnd(M.dataRange.from + 4 * 20);
                props.setMemoryRange(M.dataRange.from, M.dataRange.from + 4 * 20)
                break;
            case "Heap":
                props.setStart(M.heapRange.from);
                props.setEnd(M.heapRange.from + 4 * 20);
                props.setMemoryRange(M.heapRange.from, M.heapRange.from + 4 * 20)
                break;
            case "Stack":
                props.setStart(M.stackRange.to - 4 * 20);
                props.setEnd(M.stackRange.to);
                props.setMemoryRange(M.stackRange.to - 4 * 20, M.stackRange.to)
                break;
            default:
                break;
        }
        let cont = document.querySelector("#scrollContainer")
        if (cont) {
            cont.scrollTop = 0
        }
        props.setBase(event.target.value as string);
    };

    const getHexaValue = (value: number) => {
        if (value < 0) {
            value = 0xFFFFFFFF + value + 1;
        }
        let result = value.toString(16)
        if (result.length < 8) {
            result = '0'.repeat(8 - result.length) + result;
        }
        return result
    }

    const getMemAddress = (index: number) => {
        if (props.base === "Stack") {
            return props.end - 4 - index * 4
        } else {
            return props.start + index * 4
        }
    }

    let vals = [...(new Int32Array(props.memory))];
    vals = props.base === "Stack" ? vals.reverse() : vals;

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Memory
            </AccordionSummary>
            <AccordionDetails>
                <FormControl fullWidth>
                    <InputLabel id="memory-segment-select-label">Segment</InputLabel>
                    <Select
                        labelId="memory-segment-select-label"
                        id="memory-segment-select"
                        value={props.base}
                        label="Segment"
                        onChange={handleSegmentChange}
                    >
                        <MenuItem value={"Data"}>Data</MenuItem>
                        <MenuItem value={"Heap"}>Heap</MenuItem>
                        <MenuItem value={"Stack"}>Stack</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel control={
                    <Switch checked={isHexa} onChange={(event) => { setIsHexa(event.target.checked) }} />}
                    label="Hexadecimal" />
                <FormHelperText>Little endian</FormHelperText>
                <div style={{ height: "300px", overflow: "auto" }} id="scrollContainer">
                    <InfiniteScroll
                        dataLength={vals.length}
                        next={loadMore}
                        hasMore={true}
                        loader={<h6>Loading...</h6>}
                        scrollThreshold={0.9}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        scrollableTarget="scrollContainer">

                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Address</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {vals.map((val, index) => (
                                    <TableRow key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {"0x" + getHexaValue(getMemAddress(index))}
                                        </TableCell>
                                        <TableCell align="right">{isHexa ? "0x" + getHexaValue(val) : val}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </InfiniteScroll>
                </div>
            </AccordionDetails>
        </Accordion >
    )
}

export default React.memo(MemoryAccordition);