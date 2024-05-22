import React from 'react';
import { Formik } from 'formik';
//import StyledGroupForm from '../components/StyledGroupForm';
import { useNavigate } from 'react-router-dom';

import {Box, FormControl, TextField, InputLabel, Select, MenuItem, Button } from '@mui/material';


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

    <div style={styles.form}>
      <div style={styles.title}>
        Información Personal
      </div>

      <FormControl fullWidth>
        {/*<InputLabel htmlFor="my-input">Nombres completos</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
  <FormHelperText id="my-helper-text">Nombres del paciente</FormHelperText>*/}
        <TextField id="dni" label="DNI del paciente" style={{padding:10}} variant="filled"/>
        <TextField id="nombres" label="Nombres del paciente" style={{padding:10}} variant="filled"/>
        <TextField id="apellidos" label="Apellidos del paciente" style={{padding:10}} variant="filled"/>

        
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Edad!"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>

        <Box style={{paddingTop: 20}}>
          <Button title="¡Adelante!" />
        </Box>
      </FormControl>

    </div>
  );
}
