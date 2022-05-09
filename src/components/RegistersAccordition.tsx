/*
    Modul: RegisterAccordion.tsx
    Autor: Hůlek Matěj
*/

import { useState } from 'react';
import * as R from '../sim_core/register';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import { FormControlLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


type RegistersAccorditionProps = {
    registers: R.IAllRegister[]
};

const RegistersAccordition: React.FC<RegistersAccorditionProps> = (props) => {
    const [isHexa, setIsHexa] = useState(true)

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

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Registers
            </AccordionSummary>
            <AccordionDetails>
                <FormControlLabel control={
                    <Switch checked={isHexa} onChange={(event) => { setIsHexa(event.target.checked) }} />}
                    label="Hexadecimal" />
                <TableContainer sx={{ maxHeight: "50vh" }}>
                    <Table size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.registers.map((row) => (
                                <TableRow key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{isHexa ? '0x' + getHexaValue(row.value[0]) : row.value[0]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    )
}

export default RegistersAccordition;