/*
    Modul: Inputs.tsx
    Autor: Hůlek Matěj
*/

import React from "react";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type InputProps = {
    outputValue: string,
    inputValue: string
    assembled: boolean,
    isHazard: boolean,
    isForwarding: boolean,
    setInputValue: (value: string) => void,
    setIsForwarding: (value: boolean) => void,
    setIsHazard: (value: boolean) => void,
};

const Inputs: React.FC<InputProps> = (props) => {
    return (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} margin={"10px"}>
            <TextField
                label="Output"
                value={props.outputValue}
                sx={{ maxWidth: { xs: "200px" } }}
                multiline
                maxRows={3}
                InputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                label="Input"
                value={props.inputValue}
                sx={{ maxWidth: { xs: "200px" } }}
                onChange={(event) => {
                    props.setInputValue(event.target.value)
                }}
            />
            <FormControlLabel control={
                <Checkbox
                    checked={props.isForwarding}
                    onChange={(event) => {
                        props.setIsForwarding(event.target.checked)
                    }}
                    disabled={props.assembled}
                />
            } label="Forwarding" sx={{ display: { xs: 'block', sm: 'none' } }} />

            <FormControlLabel control={
                <Checkbox
                    checked={props.isHazard}
                    onChange={(event) => {
                        props.setIsHazard(event.target.checked)
                    }}
                    disabled={props.assembled}
                />
            } label="Hazard Unit" sx={{ display: { xs: 'block', sm: 'none' } }} />
        </Stack>
    )
}

export default React.memo(Inputs)