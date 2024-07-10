import { useState, useEffect } from 'react'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import {abs} from 'mathjs';
import employeeInfo from './static/employee-info.json';

function App() {
  const [month, setMonth] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState(10);

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

  const calcAge = (birthday) => {
    let diff = Date.now() - birthday.getTime();
    return abs(new Date(diff).getUTCFullYear() - 1970);
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

  const filterList = (e) => { setMonth(e.target.value); }

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
              <InputLabel id="month-filter-label">Birth Month</InputLabel>
              <Select
                labelId="month-filter-label"
                id="month-filter"
                value={month}
                onChange={filterList}
                autoWidth
                label="Month"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="1">January</MenuItem>
                <MenuItem value="2">February</MenuItem>
                <MenuItem value="3">March</MenuItem>
                <MenuItem value="4">April</MenuItem>
                <MenuItem value="5">May</MenuItem>
                <MenuItem value="6">June</MenuItem>
                <MenuItem value="7">July</MenuItem>
                <MenuItem value="8">August</MenuItem>
                <MenuItem value="9">September</MenuItem>
                <MenuItem value="10">October</MenuItem>
                <MenuItem value="11">November</MenuItem>
                <MenuItem value="12">December</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <TableContainer sx={{width: '100%', overflow: 'hidden'}}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * pagination, page * pagination + pagination)
                .map((row, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">{row.first_name}</TableCell>
                      <TableCell align='center'>{row.last_name}</TableCell>
                      <TableCell align='center'>{row.location}</TableCell>
                      <TableCell align='center'>{row.birthday}</TableCell>
                      <TableCell align='center'>{row.age}</TableCell>
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
