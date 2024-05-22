import React from 'react';
import { Formik } from 'formik';
//import StyledGroupForm from '../components/StyledGroupForm';
import { useNavigate } from 'react-router-dom';

import {Box, FormControl, TextField, InputLabel, Input, Select, MenuItem, Button, FormHelperText, Container, Grid } from '@mui/material';

//DATE
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


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
                    <MenuItem value={ele.key}>{ele.value}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker label="Fecha de Nacimiento"/>
            </LocalizationProvider>
          </FormControl>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker label="Fecha de evaluacion"/>
            </LocalizationProvider>
          </FormControl>

          <Grid container justifyContent='space-around'>
            <Grid item>
              <Button
                type='submit'
                variant='outlined'
                sx={{ mt: 3, mb: 2}}
              >
                Guardar
              </Button>
            </Grid>
            <Grid item>
              <Button
                type='submit'
                variant='outlined'
                sx={{ mt: 3, mb: 2}}
              >
                ¡Ir al test!
              </Button>
            </Grid>
          </Grid>
          
        </Box>
      </Box>

    </Container>
  );
}
