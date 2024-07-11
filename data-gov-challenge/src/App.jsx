import { useState, useEffect } from 'react'
import { 
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  Typography, 
  Box, 
  Button,
  FormControl,
  FormLabel,
  styled,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import Select from "react-select";
import {abs, round} from 'mathjs';
import Toggle from './components/toggle';
import employeeInfo from './static/employee-info.json';
import './App.css';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#2b2d42'
        },
        secondary: {
          main: '#d90429'
        },
        background: {
          main: '#edf2f4'
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#edf2f4'
        },
        secondary: {
          main: '#d90429'
        },
        background: {
          main: '#2b2d42'
        },
      },
    },
  },
});

const StyledColumnTableCell = styled(TableCell)({ 
  color: theme.vars.palette.background.main,
  backgroundColor: theme.vars.palette.primary.main,
  fontSize: 'Large',
  fontWeight: 'bold'
});

const StyledTableCell = styled(TableCell)({ 
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.vars.palette.background.main,
  borderColor: theme.vars.palette.secondary.main
});

function App() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState(10);
  const [ageDisplay, setAgeDisplay] = useState('Years');

  const months = [
    {value: 0, label: "January"},
    {value: 1, label: "February"},
    {value: 2, label: "March"},
    {value: 3, label: "April"},
    {value: 4, label: "May"},
    {value: 5, label: "June"},
    {value: 6, label: "July"},
    {value: 7, label: "August"},
    {value: 8, label: "September"},
    {value: 9, label: "October"},
    {value: 10, label: "November"},
    {value: 11, label: "December"},
    {value: "All", label: "All"}
  ]

  const getCurrMonth = () => {
    let d = new Date();
    return months[d.getMonth()];
  }

  const [month, setMonth] = useState(getCurrMonth().value);

  const calcAge = (birthday) => {
    console.log(ageDisplay);
    let diff = Date.now() - birthday.getTime();
    if(ageDisplay === 'Years') { //age in years
      return abs(new Date(diff).getUTCFullYear() - 1970);
    } else if(ageDisplay === 'Days') { //age in days
      return round(diff / (1000 * 60 * 60 * 24));
    } else { //age in hours
      return round(diff / (1000 * 60 * 60));
    }
  }

  useEffect(() => { //on page load
    filterResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [ageDisplay])

  const columns = [
    { id: 'first_name', label: "First Name", minWidth: '170px'},
    { id: 'last_name', label: 'Last Name', minWidth: '170px'},
    { id: 'location', label: 'Location', minWidth: '170px'},
    {
      id: 'birthday',
      label: 'Birthday',
      minWidth: '170px'
    },
    { id: 'age', label: 'Age', minWidth: '75px'}
  ]

  const handleChangePage = (e, newPage) => { setPage(newPage); }

  const changePagination = (e) => {
    setPagination(+e.target.value);
    setPage(0);
  }

  const radioSelected = (e) => {
    setAgeDisplay(e.target.value);
  }

  const filterResults = () => {
    let r;
    if(month === "All") {
      r = employeeInfo.map((employee, i) => ({
        id: i,
        first_name: employee['First name'],
        last_name: employee['Last name'],
        location: employee['Location'],
        birthday: new Date(employee['Birthday']).toLocaleDateString('en-us', {
          year:"numeric",
          month:"short",
          day:"numeric"
        }),
        age: calcAge(new Date(employee['Birthday']))
      }))
      setRows(r);
      return;
    }
    
    let filteredList = employeeInfo.filter((employee) => new Date(employee.Birthday).getMonth() === month);
    r = filteredList.map((employee, i) => ({
      id: i,
      first_name: employee['First name'],
      last_name: employee['Last name'],
      location: employee['Location'],
      birthday: new Date(employee['Birthday']).toLocaleDateString('en-us', {
        year:"numeric",
        month:"short",
        day:"numeric"
      }),
      age: calcAge(new Date(employee['Birthday']))
    }))
    setRows(r);
  }

  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{display: 'block', backgroundColor: theme.vars.palette.background.main}}>
        <Box sx={{width: '100%', height: '75px', display: 'flex', backgroundColor: theme.vars.palette.secondary.main}}>
          <Typography sx={{
            color: theme.vars.palette.primary.main,
            fontSize: 'XX-Large',
            marginLeft: '15px',
            paddingTop: '10px',
            fontFamily: '"Russo One", sans-serif',
            WebkitTextStroke: `.5px ${theme.vars.palette.background.main}`,
            fontWeight: 400,
            fontStyle: 'normal'
            }}>Employee Information</Typography>
          <Box sx={{marginLeft: 'auto', marginRight: 0}}>
            <Button variant="outlined" onClick={filterResults} sx={{
              marginTop: '15px',
              color: theme.vars.palette.primary.main,
              borderColor: theme.vars.palette.primary.main,
              fontWeight: 'bold'
              }}>Apply Filter</Button>
            <FormControl sx={{
              minWidth: 170,
              paddingTop: '14px',
              }}>
              <Select
                labelId="month-filter-label"
                id="month-filter"
                onChange={e => setMonth(e.value)}
                autoWidth
                label="Month"
                options={months}
                value={months.value}
                defaultValue={getCurrMonth}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: theme.vars.palette.secondary.main,
                    color: theme.vars.palette.primary.main,
                    borderColor: theme.vars.palette.primary.main
                  }),
                }}
              />
            </FormControl>
          </Box>
        </Box>
        <TableContainer sx={{width: '100%', overflow: 'hidden', marginTop: '30px'}}>
          <Table>
            <TableHead>
              <TableRow sx={{backgroundColor: theme.vars.palette.background.main}}>
                {columns.map((column) => (
                  <StyledColumnTableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </StyledColumnTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * pagination, page * pagination + pagination)
                .map((row, i) => {
                  return (
                    <TableRow key={i}>
                      <StyledTableCell component="th" scope="row">{row.first_name}</StyledTableCell>
                      <StyledTableCell>{row.last_name}</StyledTableCell>
                      <StyledTableCell>{row.location}</StyledTableCell>
                      <StyledTableCell>{row.birthday}</StyledTableCell>
                      <StyledTableCell>{row.age}</StyledTableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={pagination}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={changePagination}
        />
        <Box sx={{display: 'flex'}}>
          <Toggle theme={theme} />
          <FormControl sx={{marginLeft: 'auto', marginRight: 0}}>
              <FormLabel id="age-radio-buttons" sx={{color: theme.vars.palette.primary.main}}>Age Display</FormLabel>
              <RadioGroup
                row
                name='age-buttons-group'
                value={ageDisplay}
                onChange={radioSelected}
              >
                <FormControlLabel value="Years" control={<Radio />} label="Years" sx={{color: theme.vars.palette.primary.main}} />
                <FormControlLabel value="Days" control={<Radio />} label="Days" sx={{color: theme.vars.palette.primary.main}} />
                <FormControlLabel value="Hours" control={<Radio />} label="Hours" sx={{color: theme.vars.palette.primary.main}} />
              </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </CssVarsProvider>
  )
}

export default App
