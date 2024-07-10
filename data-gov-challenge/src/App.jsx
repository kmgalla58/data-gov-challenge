import { useState, useEffect } from 'react'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Button,
  FormControl,
  styled,
  TableBody,
  Table,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import Select from "react-select";
import {abs} from 'mathjs';
import employeeInfo from './static/employee-info.json';

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
  backgroundColor: theme.vars.palette.primary.main
});

const StyledTableCell = styled(TableCell)({ 
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.vars.palette.background.main,
  borderColor: theme.vars.palette.secondary.main
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.$(tableCellClasses.root)`]: {
    backgroundColor: theme.vars.palette.background.main,
    color: theme.vars.palette.primary.main
  },
}))

function App() {
  const [month, setMonth] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState(10);

  const calcAge = (birthday) => {
    let diff = Date.now() - birthday.getTime();
    return abs(new Date(diff).getUTCFullYear() - 1970);
  }

  const getCurrMonth = () => {
    let d = new Date();
    return months[d.getMonth()];
  }

  useEffect(() => {
    let r = employeeInfo.map((employee, i) => ({
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
    setMonth(getCurrMonth());
  }, []);

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

  const months = [
    {value: 1, label: "January"},
    {value: 2, label: "February"},
    {value: 3, label: "March"},
    {value: 4, label: "April"},
    {value: 5, label: "May"},
    {value: 6, label: "June"},
    {value: 7, label: "July"},
    {value: 8, label: "August"},
    {value: 9, label: "September"},
    {value: 10, label: "October"},
    {value: 11, label: "November"},
    {value: 12, label: "December"},
    {value: "All", label: "All"}
  ]

  const handleChangePage = (e, newPage) => { setPage(newPage); }

  const changePagination = (e) => {
    setPagination(+e.target.value);
    setPage(0);
  }

  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{display: 'block', backgroundColor: theme.vars.palette.background.main}}>
        <Box sx={{width: '100%', height: '75px', display: 'flex', backgroundColor: theme.vars.palette.secondary.main}}>
          <Typography sx={{
            color: theme.vars.palette.main,
            fontSize: 'XX-Large',
            paddingTop: '10px',
            marginLeft: '15px'
            }}>Employee Information</Typography>
          <Box sx={{marginLeft: '50%'}}>
            <Button variant="outlined" sx={{marginTop: '15px'}}>Apply Filter</Button>
            <FormControl sx={{m: 1, minWidth: 120}}>
              <Select
                labelId="month-filter-label"
                id="month-filter"
                onChange={e => setMonth(e.value)}
                autoWidth
                label="Month"
                options={months}
                value={months.value}
                defaultValue={getCurrMonth}
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
      </Box>
    </CssVarsProvider>
  )
}

export default App
