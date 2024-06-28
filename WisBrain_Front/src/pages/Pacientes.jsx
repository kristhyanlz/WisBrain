import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { dataPacientes } from "./dataPacientes";
import { red } from "@mui/material/colors";
import { movimientos } from "./dataMovimientos";

const centerCols = {
  setCellHeaderProps: () => ({ align: 'center' }),
  setCellProps: () => ({ align: 'center' })
};

const columns = (handleEdit, handleDelete, handleTest) => [
  { name: "dni", options: { filter: true } },
  { name: "nombres", options: { filter: true } },
  { name: "apellidos", options: { filter: false } },
  { name: "sexo", options: { filter: true } },
  { name: "fecha de nacimiento", options: { filter: true } },
  { name: "fecha de evaluación", options: { filter: true } },
  {
    name: "ACCIÓN",
    options: {
      filter: false,
      sort: false,
      empty: true,
      ...centerCols,
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
  const [data, setData] = useState(dataPacientes);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentRow, setCurrentRow] = useState(null);
  const [editValues, setEditValues] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    sexo: "",
    "fecha de nacimiento": "",
  });

  const [showTest, setShowTest] = useState(false);

  const handleClose = () => setOpen(false);

  const handleEdit = (e, tableMeta) => {
    e.stopPropagation();
    setCurrentRow(tableMeta.rowData);
    const [dni, nombres, apellidos, sexo, fechaNacimiento, fechaEvaluacion] = tableMeta.rowData;
    setEditValues({ dni, nombres, apellidos, sexo, "fecha de nacimiento": fechaNacimiento });
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditValues({ ...editValues, [name]: value });
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
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogContent>
              <TextField disabled margin="dense" name="dni" label="DNI" type="text" fullWidth value={editValues.dni} onChange={handleInputChange} />
              <TextField margin="dense" name="nombres" label="Nombres" type="text" fullWidth value={editValues.nombres} onChange={handleInputChange} />
              <TextField margin="dense" name="apellidos" label="Apellidos" type="text" fullWidth value={editValues.apellidos} onChange={handleInputChange} />
              <TextField margin="dense" name="sexo" label="Sexo" type="text" fullWidth value={editValues.sexo} onChange={handleInputChange} />
              <TextField margin="dense" name="fecha de nacimiento" label="Fecha de Nacimiento" type="date" fullWidth value={editValues["fecha de nacimiento"]} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleUpdate} color="primary">Actualizar</Button>
            </DialogActions>
          </Dialog>
        );
      case "test":
        return (
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent>
              <Box sx={{ padding: 1, textAlign: "center" }}>
              <Typography textAlign="center" fontFamily='fantasy' letterSpacing='.2rem' fontSize={25} marginBottom={1}>Resumen</Typography>
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
                <Resultados/>
              </Box>
              <Box mt={2}>
                <Test showTest={showTest} setShowTest={setShowTest} />
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

  const handleUpdate = () => {
    const updatedData = data.map((row) => {
      if (row === currentRow) {
        return [
          editValues.dni,
          editValues.nombres,
          editValues.apellidos,
          editValues.sexo,
          editValues["fecha de nacimiento"],
          row[5], // Aquí debes ajustar según la estructura real de tus datos
        ];
      }
      return row;
    });
    setData(updatedData);
    handleClose();
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
        data={data}
        columns={columns(handleEdit, handleDelete, handleTest)}
        options={options}
      />
      {renderDialog()}
    </Container>
  );
};

const Test = ({ showTest, setShowTest }) => {
  const randomMovements = movimientos;

  const toggleTest = () => {
    setShowTest(!showTest);
  };

  return (
    <Container maxWidth='sm'> {/* Añadido para ajustar el ancho */}
      <Paper>
        {showTest && (
          <TableContainer>
            <Grid item>
            <Typography textAlign="center" fontFamily='fantasy' letterSpacing='.2rem' fontSize={25} marginBottom={3}>Historial de movimientos</Typography>
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
                  <TableRow hover key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center" sx={row.resultado === "INCORRECTO" ? { color: red[500] } : {}}>
                      {row.resultado}
                    </TableCell>
                    <TableCell align="center">{row.categoria}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Grid container style={{ marginTop: 5 }} justifyContent="center">
        <Grid item>
          <Button variant='text' size='medium' onClick={toggleTest} style={{ fontStyle: 'italic' }}>
            más detalles
          </Button>
        </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};


const Resultados = () => {
  const rows = [
    { calificacion: 'Número de categorías correctas', puntaje: 10 },
    { calificacion: 'Número de errores perseverativos', puntaje: 20 },
    { calificacion: 'Número de errores NO perseverativos', puntaje: 25 },
    { calificacion: 'Número total de errores', puntaje: 40 },
    { calificacion: 'Porcentaje de errores de perseverativos', puntaje: '30%' },
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
            {rows.map((row) => (
              <TableRow key={row.calificacion}>
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
  value={`Durante el WCST, el paciente mostró habilidades iniciales para identificar patrones, aunque encontró desafíos al adaptarse a nuevas reglas. A medida que avanzaba la prueba, demostró una progresiva flexibilidad al ajustar sus estrategias según la retroalimentación proporcionada.`}
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
