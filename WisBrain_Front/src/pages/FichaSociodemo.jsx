import React from 'react';
import { Formik } from 'formik';
import StyledGroupForm from '../components/StyledGroupForm';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';


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
  const navigate = useNavigate();

  return (

    <div style={styles.form}>
      <div style={styles.title}>
        Información Personal
      </div>

      <Formik
        validate = { validate }
        initialValues = { initialValues }
        onSubmit = {
          (values) => {
            //console.log("Send btn ficha:\n" +JSON.stringify(values, null, 4))//Nombres, edad, sexo
            
          } 
        }
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <StyledGroupForm label='Nombres' placeholder='Nombres' name='nombres' />
            <StyledGroupForm label='Edad' placeholder='123' name='edad' keyboardType="numeric"/>
            <StyledGroupForm label='Sexo' placeholder='Seleccione su sexo' name='sexo' select={sexoOptions}/>

          <div style={{paddingTop: 20}}>
            <Button onPress={handleSubmit} title="¡Adelante!" />
          </div>
          </>
        )}
      </Formik>
    </div>
  );
}
