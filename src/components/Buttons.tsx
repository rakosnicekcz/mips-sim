import React from "react";
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HandymanIcon from '@mui/icons-material/Handyman';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

const example_arithmetic: string = require("../examples/arithmetic.asm");
const example_dataTransfer: string = require("../examples/dataTransfer.asm");
const example_branchesAndJumps: string = require("../examples/branchesAndJumps.asm");
const example_functionCall: string = require("../examples/functionCall.asm");
const example_userInput: string = require("../examples/userInput.asm");

type ButtonsProps = {
    run: () => void,
    pause: () => void,
    stop: () => void,
    step: () => void,
    Assemble: () => void,
    setValue: (value: string) => void,
    running: boolean,
    assembled: boolean,
};

const examples = [
    { text: 'basic arithmetic', link: example_arithmetic },
    { text: 'data transfer', link: example_dataTransfer },
    { text: 'branches and jumps', link: example_branchesAndJumps },
    { text: 'function call using jal', link: example_functionCall },
    { text: 'user input', link: example_userInput },
]

const Buttons: React.FC<ButtonsProps> = (props) => {
    const [value, setValue] = useState({ text: "", link: '' });

    const handleChange = (event: SelectChangeEvent) => {
        if (event.target.value === "") {
            setValue({ text: '', link: '' });
            return;
        }
        let example = examples.find(x => x.text === event.target.value);
        if (example !== undefined) {
            setValue(example);
            fetch(example.link)
                .then(response => response.text())
                .then(data => props.setValue(data));
        }
    };

    return (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} margin={"10px"}>
            <Button variant="contained" onClick={props.run} startIcon={<PlayArrowIcon />} disabled={!props.assembled || props.running} style={{ display: !props.assembled ? "none" : "flex" }} >
                RUN
            </Button>
            <Button variant="contained" onClick={props.step} startIcon={<MoveDownIcon />} disabled={!props.assembled || props.running} style={{ display: !props.assembled ? "none" : "flex" }} >
                STEP
            </Button>
            <Button variant="outlined" onClick={props.Assemble} startIcon={<HandymanIcon />} disabled={props.assembled}>
                ASSEMBLE
            </Button>
            <FormControl sx={{ m: 1, minWidth: 200 }} style={{ display: props.assembled ? "none" : "flex" }}>
                <InputLabel id="example-select-label">Example</InputLabel>
                <Select
                    labelId="example-select-label"
                    id="example-select"
                    value={value.text}
                    label="Example"
                    onChange={handleChange}
                >
                    <MenuItem value={""}>
                        <em>None</em>
                    </MenuItem>
                    {examples.map((example, index) => (
                        <MenuItem key={index} value={example.text}>{example.text}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div>
                <IconButton color="warning" disabled={!props.running} onClick={props.pause}>
                    <PauseCircleOutlineOutlinedIcon fontSize="large" />
                </IconButton>
                <IconButton color="error" disabled={!props.assembled} onClick={props.stop}>
                    <StopCircleOutlinedIcon fontSize="large" />
                </IconButton>
            </div>
        </Stack>
    )
}

export default React.memo(Buttons);