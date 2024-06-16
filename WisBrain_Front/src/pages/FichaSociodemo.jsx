import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
//import StyledGroupForm from '../components/StyledGroupForm';
import { useNavigate } from 'react-router-dom';

import {Box, FormControl, TextField, InputLabel, Input, Select, MenuItem, Button, FormHelperText, Container, Grid } from '@mui/material';

//DATE
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//TOAST
import { ToastContainer, toast } from 'react-toastify';

//BACK URL
import BACK_URL from './backURL';

const EDAD_MINIMA = 15
const EDAD_MAXIMA = 21

const styles = {
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title:{
    textAlign: 'center',
    fontSize: 32,
    paddingTop: 20,
    paddingBottom: 20,
    fontFamily: 'Candara',
  },
  formEle: {
    padding: 10
  }
};

const validate = (values) => {
  const errors = {};

  if (!values.nombres) {
    errors.nombres = 'Campo requerido';
  }

  if (!values.edad) {
    errors.edad = 'Campo requerido';
  }
  const edad = parseInt(values.edad);
  if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA || edad.toString() !== values.edad){
    errors.edad = 'Edad no permitida';
  }

  if (!values.sexo) {
    errors.sexo = 'Campo requerido';
  }

  return errors;
}

const handleDniPaciente = (e) => {
  set_dni_paciente(e.target.value)
}

const handleNombres = (e) => {
  set_nombres(e.target.value)
}

const handleApePaterno = (e) => {
  set_ape_paterno(e.target.value)
}

const handleApeMaterno = (e) => {
  set_ape_materno(e.target.value)
}

const handleSexo = (e) => {
  set_sexo(e.target.value)
}

const handleFechaNacimiento = (newValue) => {
  setEdadCalculada(dayjs().diff(dayjs(newValue), 'year'))
  set_fecha_nacimiento(newValue)
}

const handleFechaEvaluacion = (newValue) => {
  set_fecha_evaluacion(newValue)
}

const sexoOptions = [
  { key: 'Hombre', value: 'Hombre' },
  { key: 'Mujer', value: 'Mujer' },
];

export default function FichaSociodemo () {
  const [dni_paciente, set_dni_paciente] = useState("")
  const [nombres, set_nombres] = useState("")
  const [ape_paterno, set_ape_paterno] = useState("")
  const [ape_materno, set_ape_materno] = useState("")
  const [sexo, set_sexo] = useState("")
  const [fecha_nacimiento, set_fecha_nacimiento] = useState("")
  const [fecha_evaluacion, set_fecha_evaluacion] = useState(dayjs())
  const navigate = useNavigate();

  const [edadCalculada, setEdadCalculada] = useState(null)
  useEffect(() => {
    setEdadCalculada(null)
  }, [])

  return (

    <Container maxWidth='xs' style={styles.form}>
      <div style={styles.title}>
        Información del Paciente
      </div>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'}}>
        {/*
        <InputLabel htmlFor="nombres">Nombres</InputLabel>
        <Input id="my-input" aria-describedby="helper-nombres" />
  <FormHelperText id="helper-nombres">Nombres del paciente</FormHelperText>*/}
        <Box component='form' sx={{ mt: 1}}>

          <TextField 
            margin='normal'
            required
            fullWidth
            id="dni" 
            label="DNI"
            name="dni"
            autoFocus
            style={styles.formEle}
            variant="filled"
            value={dni_paciente}
            onChange={handleDniPaciente}
          />
          <TextField
            margin='normal'
            required
            fullWidth 
            id="nombres"
            label="Nombres"
            name="nombres"
            style={styles.formEle}
            variant="filled"
            value={nombres}
            onChange={handleNombres}
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            id="apellidoPaterno"
            label="Apellido Paterno"
            name='apellidoPaterno'
            style={styles.formEle}
            variant="filled"
            value={ape_paterno}
            onChange={handleApePaterno}
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            id="apellidoMaterno"
            label="Apellido Materno"
            name='apellidoMaterno'
            style={styles.formEle}
            variant="filled"
            value={ape_materno}
            onChange={handleApeMaterno}
          />

          <Box fullWidth style={styles.formEle}>
            <FormControl fullWidth >
              <InputLabel id="lbl-sexo">Sexo</InputLabel>        
              <Select
                labelId="lbl-sexo"
                id="sexo"
                value={sexo}
                label="Sexo"
                onChange={handleSexo}
              >
                {
                  sexoOptions.map((ele) => 
                    <MenuItem key={ele.key} value={ele.key}>{ele.value}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker label="Fecha de Nacimiento"
                value={fecha_nacimiento}
                onChange={handleFechaNacimiento}
              />
            </LocalizationProvider>
            <FormHelperText>Edad: {edadCalculada}</FormHelperText>
          </FormControl>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker 
                label="Fecha de evaluacion" 
                value={fecha_evaluacion}
                onChange={handleFechaEvaluacion}
                disabled 
              />
            </LocalizationProvider>
          </FormControl>

          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button
              type='submit'
              variant='outlined'
              sx={{ mt: 3, mb: 2}}
              onClick={async()=> {
                const rpta = await fetch(`${BACK_URL}/insertar_paciente`, {
                  method: 'POST',
                  headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(reg)
                })
              }}
            >
              ¡Ir al test!
            </Button>
          </Box>
          
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
}
