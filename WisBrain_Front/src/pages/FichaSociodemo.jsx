import React from 'react';
import { Formik } from 'formik';
//import StyledGroupForm from '../components/StyledGroupForm';
import { useNavigate } from 'react-router-dom';

import {Box, FormControl, TextField, InputLabel, Input, Select, MenuItem, Button, FormHelperText, Container } from '@mui/material';


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
    fontSize: 40,
    paddingTop: 20,
    paddingBottom: 30,
    fontFamily: 'Candara',
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
        Información Personal
      </div>

      <Box sx={{
        marginTop: 8,
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
            label="DNI del paciente"
            name="dni"
            autoFocus
            style={{padding:10}}
            variant="filled"
          />
          <TextField
            margin='normal'
            required
            fullWidth 
            id="nombres"
            label="Nombres del paciente"
            name="nombres"
            style={{padding:10}}
            variant="filled"
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            id="apellidos"
            label="Apellidos del paciente"
            name='apellidos'
            style={{padding:10}}
            variant="filled"
          />

          <FormControl fullWidth>
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

          <Box style={{paddingTop: 20}}>
            <Button title="¡Adelante!" />
          </Box>
        </Box>
      </Box>

    </Container>
  );
}
