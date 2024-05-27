import * as React from 'react';
import {Grid, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

import {movimientos} from './dataMovimientos'

const styles = {
  title:{
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 20,
    paddingBottom: 20,
    fontFamily: 'Candara',
  },
  catEsperadas:{
    margin: '0px 10px 20px 10px'
  },
  cat:{
    fontSize: 20
  }
}

const columns = [
  {id: 'nTarjeta', label: '# Tarjeta', align: 'center'},
  {id: 'respuesta', label: 'Respuesta', minWidth: 170, align: 'center'  },
  { id: 'categoria', label: 'Categoria', minWidth: 100, align:'center', /*format: (value) => value.toLocaleString('en-US'), format: (value) => value.toFixed(2)*/ },
];

export default function ColumnGroupingTable() {
  return (
    <Paper fixed fullWidth>
      <Box style={styles.title}>
        Categoría Esperada
      </Box>
      <Grid container  justifyContent='center'>
        <Grid style={styles.catEsperadas}>
          <Button disabled style={styles.cat}>COLOR</Button>
        </Grid>
        <Grid style={styles.catEsperadas}>
          <Button disabled style={styles.cat}>FORMA</Button>
        </Grid>
        <Grid style={styles.catEsperadas}>
          <Button style={styles.cat}>NÚMERO</Button>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {movimientos
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Paper>
  );
}
