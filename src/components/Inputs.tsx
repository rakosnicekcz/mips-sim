import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HandymanIcon from '@mui/icons-material/Handyman';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

type ButtonsProps = {
    run: () => void,
    pause: () => void,
    stop: () => void,
    step: () => void,
    Assemble: () => void,
    running: boolean,
    assembled: boolean,
};

export const Buttons: React.FC<ButtonsProps> = (props) => {
    return (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} margin={"10px"}>
            <Button variant="contained" onClick={props.run} startIcon={<PlayArrowIcon />} disabled={!props.assembled} >
                RUN
            </Button>
            <Button variant="contained" onClick={props.step} startIcon={<MoveDownIcon />} disabled={!props.assembled || props.running} >
                STEP
            </Button>
            <Button variant="outlined" onClick={props.Assemble} startIcon={<HandymanIcon />} disabled={props.assembled}>
                ASSEMBLE
            </Button>
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

export const Inputs: React.FC<InputProps> = (props) => {
    return (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} margin={"10px"}>
            <TextField
                label="Output"
                value={props.outputValue}
                sx={{ maxWidth: { xs: "200px" } }}
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

type CheckboxesProps = {
    assembled: boolean,
    isHazard: boolean,
    isForwarding: boolean,
    setIsForwarding: (value: boolean) => void,
    setIsHazard: (value: boolean) => void,
};


export const Checkboxes: React.FC<CheckboxesProps> = (props) => {
    return (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ display: { xs: 'none', sm: 'block' } }} margin={"10px"}>
            <FormControlLabel control={
                <Checkbox
                    checked={props.isForwarding}
                    onChange={(event) => {
                        props.setIsForwarding(event.target.checked)
                    }}
                    disabled={props.assembled}
                />
            } label="Forwarding" />

            <FormControlLabel control={
                <Checkbox
                    checked={props.isHazard}
                    onChange={(event) => {
                        props.setIsHazard(event.target.checked)
                    }}
                    disabled={props.assembled}
                />
            } label="Hazard Unit" />
        </Stack>
    )
}