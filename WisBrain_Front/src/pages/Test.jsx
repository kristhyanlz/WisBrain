import * as React from 'react';
import {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import {Grid, Button, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton, Modal} from '@mui/material';
import { red } from '@mui/material/colors';

//import {movimientos} from './dataMovimientos'


import ContinuarIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';

//const BACK_URL = "http://localhost:5000"
import BACK_URL from './backURL';
import ModalPaciente from '../components/ModalPaciente';

const styles = {
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
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }

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
  
  const [intervalRun, setIntervalRun] = useState(null)
  useEffect(()=> {

    const killIntervals = () => {
      for (var i = 1; i < 99999; i++)
        window.clearInterval(i);
    }

    const interval_init = async () => {
      if (localStorage.getItem('testEnable') == 'false'){
        navigate('/FichaSociodemografica')
      }
      else{
        await killIntervals()
        setInterval( ()=> {
          fetch(`${BACK_URL}/getUpdate`)
            .then((res) => res.json())
            .then(async(movs) => {
              await console.log(JSON.stringify(movs) )
              if (movs.length > 0){
                setMovimientos(movs)
                if (flagPlayer < movs.length){
                  setFlagPlayer(movs.length)
                  tableRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" })
                }
              }
            })
        }, 1000)
        setIntervalRun(true)
      }
    }

    interval_init()
  }, [])

  const siguienteFx = () => {
    console.log("CONTINUAR")
    fetch(`${BACK_URL}/resume`);
  }

  const spaceKeyListener = React.useCallback((event) => {
    if (event.key == " " && !openModal){
      console.log(`Tecla espacio`)
      siguienteFx();
    }
  }, [openModal])

  useEffect(() => {
    if (!openModal) {
      document.addEventListener("keydown", spaceKeyListener, false);
    } else {
      document.removeEventListener("keydown", spaceKeyListener, false);
    }

    return () => {
      document.removeEventListener("keydown", spaceKeyListener, false);
    };
  }, [openModal, spaceKeyListener]);

  useEffect(() => {
    if (tableRef.current) {
      const { scrollHeight, clientHeight } = tableRef.current;
      tableRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [movimientos]);

  let fichaJSON = JSON.parse(localStorage.getItem('testEnable'))

  return (
    <>
      <Container fixed >
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
          <Tooltip title="Atajo: Barra Espaciadora [SPACEBAR]" arrow>
            <Button
              variant='contained'
              endIcon={<ContinuarIcon/>}
              onClick={siguienteFx} 
            >
              Siguiente
            </Button>
          </Tooltip>
        </Box>

        <Grid container justifyContent="center">
          <Grid item>
            <TableContainer sx={{ maxHeight: 440, minWidth:600 }} ref={tableRef}>
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
