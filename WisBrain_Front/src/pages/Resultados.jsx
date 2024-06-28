import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Container, Grid, TextField, Box } from '@mui/material';

const rows = [
  {calificacion: 'Número de categorías correctas', puntaje: 10},
  {calificacion: 'Número de errores perseverativos', puntaje: 20},
  {calificacion: 'Número de errores NO perseverativos', puntaje: 25},
  {calificacion: 'Número total de errores', puntaje: 40},
  {calificacion: 'Porcentaje de errores perseverativos', puntaje: '30%'},
];

const styles = {
  container: {
    //display: 'flex',
    //flexDirection: 'row',
    justifyItems: 'center',
    marginTop: 20,
  },
  obs:{
    marginTop:20
  },
  button: {
    marginTop: 20
  }
}

export default function Resultados() {
  console.log(JSON.stringify(rows))
  return (
    <Container maxWidth='sm' style={styles.container}>
      <TableContainer component={Paper}  >
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Calificación</TableCell>
              <TableCell align="center">Puntaje Bruto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.calificacion}
                hover
                //sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.calificacion}
                </TableCell>
                <TableCell align="center">{row.puntaje}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box style={styles.obs} >
        <TextField
            id="filled-multiline-static"
            label="Observaciones y comentarios"
            multiline
            rows={4}
            variant="filled"
            fullWidth
          />
      </Box>
      <Grid container style={styles.button} justifyContent="center">
        <Grid item>
        <Button  variant='outlined'> Descargar PDF </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
