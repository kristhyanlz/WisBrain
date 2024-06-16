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

const initialValues = {
  nombres: '',
  edad: '',
  sexo: '',
}

const sexoOptions = [
  { key: 'H', value: 'Hombre' },
  { key: 'M', value: 'Mujer' },
];

export default function FichaSociodemo () {
  const [age, setAge] = React.useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            id="apellidos"
            label="Apellidos"
            name='apellidos'
            style={styles.formEle}
            variant="filled"
          />

          <Box fullWidth style={styles.formEle}>
            <FormControl fullWidth >
              <InputLabel id="lbl-sexo">Sexo</InputLabel>        
              <Select
                labelId="lbl-sexo"
                id="sexo"
                value={age}
                label="Sexo"
                onChange={handleChange}
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
                onChange={(newValue) => {
                  setEdadCalculada(dayjs().diff(dayjs(newValue), 'year'))
                }}
              />
            </LocalizationProvider>
            <FormHelperText>Edad: {edadCalculada}</FormHelperText>
          </FormControl>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker disabled label="Fecha de evaluacion" value={dayjs()}/>
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
