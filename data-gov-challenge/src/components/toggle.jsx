import React from "react";
import {
    Switch,
    FormControlLabel,
    useColorScheme
} from '@mui/material';

function Toggle({theme}) {
    const {mode, setMode} = useColorScheme();

    return (
        <>
            <FormControlLabel
                value="Dark Mode"
                control={<Switch color={theme.vars.palette.secondary.main} />}
                onClick={() => {
                    if(mode === 'light') {
                    setMode('dark');
                    } else {
                    setMode('light');
                    }
                }}
                label="Dark Mode"
                labelPlacement="start"
                sx={{color: theme.vars.palette.primary.main}}
                />
        </>
    )
}

export default Toggle;