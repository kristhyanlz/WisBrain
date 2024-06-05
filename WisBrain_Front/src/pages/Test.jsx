import * as React from 'react';
import {useState, useEffect} from 'react'
import {Grid, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { red } from '@mui/material/colors';

//import {movimientos} from './dataMovimientos'

import correctoAudio from  '../assets/correcto.mp3'
import incorrectoAudio from '../assets/incorrecto.mp3'

import CropSquareIcon from '@mui/icons-material/CropSquare';

const BACK_URL = "http://localhost:5000"

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
  {id: 'id', label: '# Tarjeta', align: 'center'},
  {id: 'resultado', label: 'Respuesta', minWidth: 170, align: 'center'  },
  {id: 'categoria', label: 'Categoría', minWidth: 100, align: 'center' },
];

export default function Test() {
  const [correctoPlayer] = useState(new Audio( correctoAudio ))
  const [incorrectoPlayer] = useState(new Audio( incorrectoAudio ))


  const [movimientos, setMovimientos] = useState([
    {
      "categoria": "",
      "datos_tarjeta": {
        "categoria": "",
        "color": "",
        "forma": "",
        "numero": 0
      },
      "id": "",
      "resultado": ""
    }
  ])
  
  const [flag, setFlag] = useState(false)
  useEffect(()=> {
    const interval = setInterval( ()=> {
      fetch(`${BACK_URL}/getUpdate`)
        .then((res) => res.json())
        .then(async(movs) => {
          await console.log(JSON.stringify(movs) )
          if (movs.length > 0){
            setMovimientos(movs)
            if (flagPlayer < movs.length){
              setFlagPlayer(movs.length)
            }
          }
        })
    }, 1000)
  }, [flag])

  const [flagPlayer, setFlagPlayer] = useState(0)
  useEffect(()=> {
    if (movimientos[0].categoria != ""){
      if (movimientos[movimientos.length - 1].resultado == "CORRECTO"){
        correctoPlayer.play()
      }else{
        incorrectoPlayer.play()
      }
    }
  }, [flagPlayer])

  return (
    <Paper fixed fullWidth>
      <Box style={styles.title}>
        Categoría Esperada
      </Box>
      <Grid container  justifyContent='center'>
        <Grid style={styles.catEsperadas}>
          <Button disabled={(movimientos[movimientos.length - 1].categoria == 'Color') ? false : true} style={styles.cat}>COLOR</Button>
        </Grid>
        <Grid style={styles.catEsperadas}>
          <Button disabled={(movimientos[movimientos.length - 1].categoria == 'Forma') ? false : true} style={styles.cat}>FORMA</Button>
        </Grid>
        <Grid style={styles.catEsperadas}>
          <Button disabled={(movimientos[movimientos.length - 1].categoria == 'Número') ? false : true} style={styles.cat}>NÚMERO</Button>
        </Grid>
      </Grid>
      <Box style={{textAlign: 'center', paddingBottom: 20}}>
        <Button
          variant='contained'
          endIcon={<CropSquareIcon/>}
          onClick={() => {
            fetch(`${BACK_URL}/resume`);
          }}  
        >
          Dispensar
        </Button>
      </Box>

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
              {
              movimientos.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {
                      columns.map((column) => {
                        const value = (column.id == 'categoria')? row.datos_tarjeta.categoria :row[column.id];
                        let es_incorrecto = ((column.id == 'resultado') && (row.resultado == 'INCORRECTO')) ? true : false
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Box sx={es_incorrecto && {color:red[500]}}>
                              {value}
                            </Box>
                          </TableCell>
                        );
                      })
                      }
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Paper>
  );
}
