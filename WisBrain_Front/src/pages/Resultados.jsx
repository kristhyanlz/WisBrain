import * as React from 'react';
import {useState, useEffect, useRef} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Container, Grid, TextField, Box, Tooltip, IconButton } from '@mui/material';

import ContinuarIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';

//const BACK_URL = "http://localhost:5000"
import BACK_URL from './backURL';
import ModalPaciente from '../components/ModalPaciente';

const rows = [
  {calificacion: 'Número de categorías correctas', puntaje: 10},
  {calificacion: 'Número de errores perseverativos', puntaje: 20},
  {calificacion: 'Número de errores NO perseverativos', puntaje: 25},
  {calificacion: 'Número total de errores', puntaje: 40},
  {calificacion: 'Porcentaje de errores perseverativos', puntaje: '30%'},
  {calificacion: 'Rendimiento cognitivo', puntaje: 'Bajo'},
  {calificacion: 'Flexibilidad cognitiva', puntaje: 'Promedio'},
];

const styles = {
  container: {
    marginTop: 20,
    textAlign: 'center', // Alineación central del contenido
  },
  obs: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
  boldRow: {
    fontWeight: 'bold',
  },
  fichaTexto:{
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 0,
  },
  title:{
    textAlign: 'center',
    fontSize: 23,
    paddingTop: 20,
    paddingBottom: 10,
    fontFamily: 'Roboto',
  },
};



export default function Resultados() {

  let fichaJSON = JSON.parse(localStorage.getItem('testEnable'))
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleClick = () => {
    fetch('http://localhost:5000/descargar_pdf')
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Network response was not ok.');
      })
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'archivo.pdf'; // Nombre del archivo que se descargará
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  };

  return (
    <>
      <Container maxWidth='sm' style={styles.container}>
        <Box style={styles.fichaTexto}>
            {`${fichaJSON.nombres} ${fichaJSON.ape_paterno} ${fichaJSON.ape_materno} (${fichaJSON.edad})`}
            <Tooltip title="Editar Ficha Sociodemográfica" arrow>
              <IconButton
                onClick={handleOpenModal}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Resultado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.calificacion}
                  hover
                  sx={index >= rows.length - 2 ? styles.boldRow : {}}
                >
                  <TableCell component="th" scope="row">
                    {index >= rows.length - 2 ? <b>{row.calificacion}</b> : row.calificacion}
                  </TableCell>
                  <TableCell align="center">
                    {index >= rows.length - 2 ? <b>{row.puntaje}</b> : row.puntaje}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box style={styles.obs}>
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
            <Button variant='outlined' onClick={handleClick}> Descargar PDF </Button>
          </Grid>
        </Grid>
      </Container>
      <ModalPaciente 
        open={openModal} 
        onClose={handleCloseModal} 
        dataFicha={JSON.parse(localStorage.getItem('testEnable'))}
        setDataFicha={(data) => localStorage.setItem('testEnable', JSON.stringify(data))}
      />
    </>
  );
}
