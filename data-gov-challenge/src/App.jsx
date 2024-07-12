import { useState, useEffect, useRef } from 'react'
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
  FormControlLabel,
  TableSortLabel
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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
          main: '#ce1e1e'
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
          main: '#ce1e1e'
        },
        background: {
          main: '#2b2d42'
        },
      },
    },
  },
});

const StyledColumnTableCell = styled(TableCell)({ //styling for column headers
  color: theme.vars.palette.background.main,
  backgroundColor: theme.vars.palette.primary.main,
  fontSize: 'Large',
  fontWeight: 'bold',
});

const StyledTableCell = styled(TableCell)({ //styling for table cells
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.vars.palette.background.main,
  borderColor: theme.vars.palette.secondary.main
});

function App() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState(10);
  const [ageDisplay, setAgeDisplay] = useState('Years');
  const [orderBy, setOrderBy] = useState('last_name');
  const [order, setOrder] = useState('asc');

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

  const getCurrMonth = () => { //gets the current month
    let d = new Date();
    return months[d.getMonth()];
  }

  const [month, setMonth] = useState(getCurrMonth().value);

  const calcAge = (birthday) => { // calculates age based on option selected
    let diff = Date.now() - birthday.getTime();
    if(ageDisplay === 'Years') { //age in years
      return abs(new Date(diff).getUTCFullYear() - 1970);
    } else if(ageDisplay === 'Days') { //age in days
      return round(diff / (1000 * 60 * 60 * 24));
    } else { //age in hours
      return round(diff / (1000 * 60 * 60));
    }
  }

  let firstRender = useRef(true);
  useEffect(() => { //on page load
    if(firstRender.current){
      filterResults();
      let r = sortRows(rows);
      setRows(r);
      firstRender.current = false;
    }
  }, []);

  useEffect(() => { //when sorting
    if(!firstRender.current) {
      let r = sortRows(rows);
      setRows(r);
    }
  }, [order, orderBy])

  useEffect(() => { //used to update the list to display the new age values
    filterResults();
  }, [ageDisplay])

  const sortRows = (rowList) => { //sorts the rows in ascending or decending order by the column selected
    let r = rowList.slice().sort((objA, objB) => {
      let a = objA[orderBy];
      let b = objB[orderBy];
      if(orderBy === 'birthday') { //fixed issue of birthday value being a string
        a = new Date(a).getTime();
        b = new Date(b).getTime();
      }

      if(a > b) {
        return order === 'desc' ? -1 : 1;
      } else if(a < b) {
        return order === 'desc' ? 1 : -1;
      } else {
        return 0;
      }
    });
    return r;
  }

  const sortTable = (property) => (event) => { //updateds where the table should sort by asc or desc
    const type = orderBy === property && order === 'asc';
    setOrder(type ? 'desc' : 'asc');
    setOrderBy(property);
  }

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
    //+ ensures the value is a number
    setPagination(+e.target.value);
    setPage(0);
  }

  const radioSelected = (e) => {
    setAgeDisplay(e.target.value);
  }

  const filterResults = () => { //filter the table by the month selected
    let r;
    if(month === "All") { //if all, show the full list
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
      let sorted = sortRows(r);
      setRows(sorted);
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
    let sorted = sortRows(r);
    setRows(sorted);
  }

  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{display: 'block', backgroundColor: theme.vars.palette.background.main}}>
        <Box sx={{width: '100%', height: 'auto', display: 'flex', backgroundColor: theme.vars.palette.secondary.main}}>
          <Typography sx={{
            color: theme.vars.palette.primary.main,
            fontSize: 'XX-Large',
            marginLeft: '15px',
            marginBottom: '10px',
            paddingTop: '10px',
            fontFamily: '"Russo One", sans-serif',
            WebkitTextStroke: `1px ${theme.vars.palette.background.main}`,
            fontWeight: 400,
            fontStyle: 'normal'
            }}>Employee Information</Typography>
          <Box sx={{marginLeft: 'auto', marginRight: 0}}>
            <Button variant="outlined" onClick={filterResults} sx={{
              marginTop: '15px',
              color: theme.vars.palette.primary.main,
              borderColor: theme.vars.palette.primary.main,
              marginRight: '5px',
              fontWeight: 'bold',
              ':hover': {
                backgroundColor: theme.vars.palette.background.main
              }
              }}>Apply Filter</Button>
            <FormControl sx={{
              minWidth: 140,
              marginRight: '5px',
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
                    borderColor: theme.vars.palette.primary.main,
                    ':hover': {
                      borderColor: theme.vars.palette.primary.main,
                    }

                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? theme.vars.palette.background.main : theme.vars.palette.secondary.main,
                    color: theme.vars.palette.primary.main,
                    borderColor: theme.vars.palette.primary.main
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: theme.vars.palette.primary.main,
                  })
                }}
              />
            </FormControl>
          </Box>
        </Box>
        <TableContainer sx={{width: '100%', overflow: 'auto', marginTop: '30px'}}>
          <Table>
            <TableHead>
              <TableRow sx={{backgroundColor: theme.vars.palette.background.main}}>
                {columns.map((column) => (
                  <StyledColumnTableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={sortTable(column.id)}
                      sx={{
                        ':hover': { color: theme.vars.palette.secondary.main },
                        '&.Mui-active': {
                          color: theme.vars.palette.background.main,
                          '& path': { color: theme.vars.palette.background.main }
                        },
                      }}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted decending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
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
