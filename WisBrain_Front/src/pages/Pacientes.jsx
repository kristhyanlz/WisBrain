import React, { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { red } from "@mui/material/colors";
import ModalPaciente from "../components/ModalPaciente";

let dataFromServer

const columns = (handleEdit, handleDelete, handleTest) => [
  {
    name: "dni_paciente",
    options: { filter: true },
    label: "DNI"
  },
  {
    name: "nombres",
    options: { filter: true },
    label: "NOMBRES"
  },
  {
    name: "ape_paterno",
    options: { filter: true },
    label: "APELLIDO PATERNO"
  },
  {
    name: "ape_materno",
    options: { filter: true },
    label: "APELLIDO MATERNO"
  },
  {
    name: "sexo",
    options: { filter: true },
    label: "SEXO"
  },
  {
    name: "fecha_nacimiento",
    options: { filter: true },
    label: "NACIMIENTO"
  },
  {
    name: "edad",
    options: { filter: true },
    label: "EDAD"
  },
  {
    name: "fecha_evaluacion",
    options: { filter: true },
    label: "EVALUACIÓN"
  },
  {
    name: "ACCIÓN",
    options: {
      filter: false,
      sort: false,
      empty: true,
      setCellHeaderProps: () => ({ align: 'center' }),
      setCellProps: () => ({ align: 'center' }),
      customBodyRender: (value, tableMeta, updateValue) => (
        <>
          <IconButton onClick={(e) => handleEdit(e, tableMeta)}><EditIcon /></IconButton>
          <IconButton color="secondary" variant="outlined" onClick={(e) => handleTest(e, tableMeta)}><DescriptionIcon /></IconButton>
        </>
      ),
    },
  },
];

const Pacientes = () => {
  const [data, setData] = useState([]); 
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentRow, setCurrentRow] = useState(null);
  const [editValues, setEditValues] = useState({
    dni_paciente: "",
    nombres: "",
    ape_paterno: "",
    ape_materno: "",
    sexo: "",
    fecha_nacimiento: "",
    edad: null,
    fecha_evaluacion: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/devolverHistorialTestPacientes');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        dataFromServer = await response.json();
        setData(dataFromServer);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [showTest, setShowTest] = useState(false);
  const [buttonText, setButtonText] = useState("más detalles");

  const handleClose = () => setOpen(false);

  const handleEdit = (e, tableMeta) => {
    e.stopPropagation();
    setCurrentRow(tableMeta.rowData);
    const [dni_paciente, nombres, ape_paterno, ape_materno, sexo, fecha_nacimiento, edad, fecha_evaluacion] = tableMeta.rowData;
    setEditValues({ dni_paciente, nombres, ape_paterno, ape_materno, sexo, fecha_nacimiento, edad, fecha_evaluacion });
    setModalType("edit");
    setOpen(true);
  };

  const handleDelete = (e, tableMeta) => {
    e.stopPropagation();
    setCurrentRow(tableMeta.rowData);
    setModalType("delete");
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    setData(data.filter((row) => row !== currentRow));
    handleClose();
  };

  const handleTest = (e, tableMeta) => {
    e.stopPropagation();
    setCurrentRow(tableMeta.rowData);
    setModalType("test");
    setOpen(true);
    setShowTest(!showTest); 
    setButtonText(showTest ? "más detalles" : "ocultar detalles");
  };

  const renderDialog = () => {
    switch (modalType) {
      case "delete":
        return (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>¿Estás seguro?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleConfirmDelete} color="error">Eliminar</Button>
            </DialogActions>
          </Dialog>
        );
      case "edit":
        return (  
          <ModalPaciente
            open={open}
            onClose={handleClose}
            dataFicha={editValues}
            setDataFicha={setEditValues}
          />
        );
      case "test":
        return (
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent>
              <Box sx={{ padding: 1, textAlign: "center" }}>
                <Typography textAlign="center" fontFamily='roboto' fontWeight='bold' letterSpacing='.2rem' fontSize={25} marginBottom={1.5}>Resumen</Typography>
              </Box>
              <Grid container spacing={1} sx={{ justifyContent: 'space-around' }}>
                <Grid item>
                  <Typography fontFamily='roboto'>{`${currentRow[1]} ${currentRow[2]}`} </Typography>
                </Grid>
                <Grid item>
                  <Typography fontFamily='roboto'>{currentRow[0]}</Typography>
                </Grid>
                <Grid item>
                  <Typography fontFamily='roboto'>{currentRow[5]}</Typography>
                </Grid>
              </Grid>
              <Box mt={3}>
                <Resultados dniCurrent={currentRow[0]} />
              </Box>
              <Box mt={2}>
                <Test showTest={showTest} setShowTest={setShowTest} dniCurrent={currentRow[0]} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Salir</Button>
            </DialogActions>
          </Dialog>
        );
      default:
        return null;
    }
  };

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "stacked",
    page: 0,
    onColumnSortChange: (changedColumn, direction) => console.log("changedColumn: ", changedColumn, "direction: ", direction),
    onChangeRowsPerPage: (numberOfRows) => console.log("numberOfRows: ", numberOfRows),
    textLabels: {
      body: {
        noMatch: "Lo sentimos, no se encontraron registros",
        toolTip: "Ordenar",
      },
      selectedRows: {
        text: "usuario(s) seleccionado(s)",
        delete: "Eliminar",
        deleteAria: "Usuario eliminado",
      },
    },
    onChangePage: (currentPage) => console.log("currentPage: ", currentPage),
    onRowsDelete: (rowsDeleted) => {
      console.log("rowsDeleted: ", rowsDeleted)
      setModalType("delete");
      setOpen(true);
    },
  };

  return (
    <Container maxWidth='lg' sx={{ marginTop: 3 }}>
      <MUIDataTable
        title={"LISTA DE PACIENTES"}
        data={data.map((row) => row.paciente)}
        columns={columns(handleEdit, handleDelete, handleTest)}
        options={options}
      />
      {renderDialog()}
    </Container>
  );
};

const Test = ({ showTest, setShowTest, dniCurrent }) => {

  const dni = dniCurrent
  const patientData = dataFromServer.find(patient => patient.paciente.dni_paciente === dni);
  const randomMovements = patientData.movimientos;

  const toggleTest = () => {
    setShowTest(!showTest);
  };

  return (
    <Container maxWidth='sm'> {/* Añadido para ajustar el ancho */}
      <Paper>
        {!showTest && (
          <TableContainer>
            <Grid container style={{ marginTop: 5 }} justifyContent="center">
          <Grid item>
            <Button variant='text' size='medium' onClick={toggleTest} style={{ fontStyle: 'italic' }}>
              {showTest ? "más detalles" : "ocultar detalles"}
            </Button>
          </Grid>
        </Grid>
            <Grid item>
              <Typography textAlign="center" fontFamily='roboto' fontWeight='bold' letterSpacing='.2rem' fontSize={25} marginBottom={3}>Historial de movimientos</Typography>
            </Grid>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center"># Tarjeta</TableCell>
                  <TableCell align="center">Respuesta</TableCell>
                  <TableCell align="center">Categoría</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {randomMovements.map((row) => (
                  <TableRow hover key={row.numero_tarjeta}>
                    <TableCell align="center">{row.numero_tarjeta}</TableCell>
                    <TableCell align="center" sx={row.resultado === "INCORRECTO" ? { color: red[500] } : {}}>
                      {row.resultado}
                    </TableCell>
                    <TableCell align="center">{row.nombre}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Grid container style={{ marginTop: 5 }} justifyContent="center">
          <Grid item>
            <Button variant='text' size='medium' onClick={toggleTest} style={{ fontStyle: 'italic' }}>
              {showTest ? "más detalles" : "ocultar detalles"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

const Resultados = ({ dniCurrent }) => {
  const dni = dniCurrent;
  const patientData = dataFromServer.find(patient => patient.paciente.dni_paciente === dni);
  const patientHistory = patientData.historial;

  console.log(patientHistory)

  const rows = [
    { calificacion: 'Número de categorías correctas', puntaje: patientHistory.num_cat_correctas },
    { calificacion: 'Número de errores perseverativos', puntaje: patientHistory.num_err_perseverativos },
    { calificacion: 'Número de errores NO perseverativos', puntaje: patientHistory.num_err_no_perseverativos },
    { calificacion: 'Número total de errores', puntaje: patientHistory.num_err_perseverativos + patientHistory.num_err_no_perseverativos },
    { calificacion: 'Porcentaje de errores de perseverativos', puntaje: `${patientHistory.porcentaje_errores_perseverativos}%` },
    { calificacion: 'Rendimiento cognitivo', puntaje: patientHistory.redimiento_cognitivo },
    { calificacion: 'Flexibilidad cognitiva', puntaje: patientHistory.flexibilidad_cognitiva },
  ];

  const styles = {
    container: {
      justifyItems: 'center',
      marginTop: 20,
    },
    obs: {
      marginTop: 20,
    },
    button: {
      marginTop: 20,
    },
  };

  return (
    <Container maxWidth='sm' style={styles.container}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Calificación</TableCell>
              <TableCell align="center">Puntaje Bruto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.calificacion}
                </TableCell>
                <TableCell align="center">{row.puntaje}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box style={styles.obs}>
        <TextField
          disabled
          id="filled-multiline-static"
          label={<Typography variant="h7">Observaciones y comentarios: </Typography>}
          multiline
          rows={5}
          variant="filled"
          fullWidth
          value={patientHistory.observaciones}
        />
      </Box>
      <Grid container style={styles.button} justifyContent="center">
        <Grid item>
          <Button variant='outlined'>Descargar PDF</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Pacientes;
