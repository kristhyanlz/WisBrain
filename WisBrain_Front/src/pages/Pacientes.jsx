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

// Datos aleatorios para movimientos
const generateRandomMovements = () => {
  const categories = ["Color", "Forma", "Número"];
  const results = ["CORRECTO", "INCORRECTO"];
  const randomData = [];

  for (let i = 0; i < 10; i++) {
    randomData.push({
      id: i + 1,
      resultado: results[Math.floor(Math.random() * results.length)],
      categoria: categories[Math.floor(Math.random() * categories.length)],
    });
  }
  return randomData;
};

const centerCols = {setCellHeaderProps: () => ({ align: 'center' }),
setCellProps: () => ({ align: 'center' })}

const columns = (handleEdit, handleDelete, handleTest) => [
  {
    name: "DNI",
    options: { filter: true},
  },
  {
    name: "Nombres",
    options: { filter: true },
  },
  {
    name: "Apellidos",
    options: { filter: false },
  },
  {
    name: "Sexo",
    options: { filter: true },
  },
  {
    name: "Fecha de Nacimiento",
    options: { filter: true},
  },
  {
    name: "Fecha de Evaluación",
    options: { filter: true},
  },
  {
    name: "ACCIÓN",
    options: {
      filter: false,
      sort: false,
      empty: true,
      ...centerCols,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <>
            <IconButton onClick={(e) => handleEdit(e, tableMeta)}><EditIcon/></IconButton>
            <IconButton color="secondary" variant="outlined" onClick={(e) => handleTest(e, tableMeta)}><DescriptionIcon/></IconButton>
          </>
        );
      },
    },
  },
];

export default function Pacientes() {
  const [data, setData] = useState(dataPacientes);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentRow, setCurrentRow] = useState(null);
  const [editValues, setEditValues] = useState({
    DNI: "",
    Nombres: "",
    Apellidos: "",
    Sexo: "",
    "Fecha de Nacimiento": "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (e, tableMeta) => {
    e.stopPropagation();
    setCurrentRow(tableMeta.rowData);
    setEditValues({
      DNI: tableMeta.rowData[0],
      Nombres: tableMeta.rowData[1],
      Apellidos: tableMeta.rowData[2],
      Sexo: tableMeta.rowData[3],
      "Fecha de Nacimiento": tableMeta.rowData[4],
    });
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
    handleClose(); // Agregar esta línea para cerrar el diálogo después de eliminar
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
              <Button
                onClick={handleConfirmDelete}
                color="error"
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        );
      case "edit":
        return (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogContent>
              <TextField disabled margin="dense" name="DNI" label="DNI" type="text" fullWidth value={editValues.DNI} onChange={handleInputChange} />
              <TextField margin="dense" name="Nombres" label="Nombres" type="text" fullWidth value={editValues.Nombres} onChange={handleInputChange} />
              <TextField margin="dense" name="Apellidos" label="Apellidos" type="text" fullWidth value={editValues.Apellidos} onChange={handleInputChange} />
              <TextField margin="dense" name="Sexo" label="Sexo" type="text" fullWidth value={editValues.Sexo} onChange={handleInputChange} />
              <TextField
                margin="dense"
                name="Fecha de Nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                fullWidth
                value={editValues["Fecha de Nacimiento"]}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button
                onClick={() => {
                  const updatedData = data.map((row) => {
                    if (row === currentRow) {
                      return [
                        editValues.DNI,
                        editValues.Nombres,
                        editValues.Apellidos,
                        editValues.Sexo,
                        editValues["Fecha de Nacimiento"],
                        row[5], // Fecha de Evaluación no se edita
                      ];
                    }
                    return row;
                  });
                  setData(updatedData);
                  handleClose();
                }}
                color="primary"
              >
                Actualizar
              </Button>
            </DialogActions>
          </Dialog>
        );
      case "test":
        return (
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
              <Test patientName={`${currentRow[1]} ${currentRow[2]}`} patientDni={currentRow[0]} evaluationDate={currentRow[5]} />
              <Box mt={3}>
                <h2>Resultado del test</h2>
                <Resultados />
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
    <Container maxWidth='lg' sx={{marginTop:3}}>
      <MUIDataTable
        title={"LISTA DE PACIENTES"}
        data={data}
        columns={columns(handleEdit, handleDelete, handleTest)}
        options={options}
      />
      {renderDialog()}
    </Container>
  );
}

const Test = ({ patientName, patientDni, evaluationDate }) => {
  const randomMovements = generateRandomMovements();

  return (
    <>
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography textAlign= "center" fontFamily= 'monospace' letterSpacing='.3rem' fontSize={25} marginBottom={3}>Resultados </Typography>
        <Grid container spacing={2} sx={{justifyContent:'space-between'}}>
          <Grid item>
            <Typography fontFamily='roboto'>{patientName} ({patientDni})</Typography>
          </Grid>
          <Grid item>
            <Typography fontFamily='roboto'>{evaluationDate}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Paper>
        <TableContainer>
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
      </Paper>
    </>
  );
};

const Resultados = () => {
  const rows = [
    { calificacion: 'Número de categorías correctas', puntaje: 10 },
    { calificacion: 'Número de errores perseverativos', puntaje: 20 },
    { calificacion: 'Número de errores NO perseverativos', puntaje: 25 },
    { calificacion: 'Número total de errores', puntaje: 40 },
    { calificacion: 'Porcentaje de errores de perseveraciones', puntaje: '30%' },
  ];
  
  const styles = {
    container: {
      flexDirection: 'row',
      justifyItems: 'center'
    },
    obs:{
      marginTop:20
    },
    button: {
      marginTop: 20
    }
  }

  return (
    <Container style={styles.container}>
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Calificacion</TableCell>
              <TableCell align="center">Puntaje Bruto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
      <Box style={styles.obs}>
        <TextField
          disabled
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
          <Button variant='outlined'> Descargar PDF </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
