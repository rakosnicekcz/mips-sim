import React from "react";
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type CheckboxesProps = {
    assembled: boolean,
    isHazard: boolean,
    isForwarding: boolean,
    setIsForwarding: (value: boolean) => void,
    setIsHazard: (value: boolean) => void,
};


const Checkboxes: React.FC<CheckboxesProps> = (props) => {
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

export default React.memo(Checkboxes)