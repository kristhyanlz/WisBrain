import React, { useEffect, useState } from 'react';
import { useFormik, useField } from 'formik';
//import StyledGroupForm from '../components/StyledGroupForm';
import { useFetcher, useNavigate } from 'react-router-dom';

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

const sexoOptions = [
  { key: 'Hombre', value: 'Hombre' },
  { key: 'Mujer', value: 'Mujer' },
];

export default function FichaSociodemo () {

  //const sexoField = useField("sexo")
  const formik = useFormik({
    initialValues:{
      dni_paciente: '',
      nombres: '',
      ape_paterno: '',
      ape_materno: '',
      sexo: '',
      fecha_nacimiento: null,
      fecha_evaluacion: null,
    },
    onSubmit: async (values)=>{
      console.log(`SUBMIT: \n${JSON.stringify(values)}`)
      const submitForm = await fetch(`${BACK_URL}/insertar_paciente`, {
          method: 'POST',
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(null)
        })
      }
  })

  const navigate = useNavigate();

  const [edadCalculada, setEdadCalculada] = useState(null)
  useEffect(() => {
    setEdadCalculada(null)
  }, [])
  
  /*
  const handleFechaNacimiento = (newValue) => {
    console.log(`Fecha nacimiento newValue ${newValue}`)
    setEdadCalculada(dayjs().diff(dayjs(newValue), 'year'))
    set_fecha_nacimiento(newValue)
  }
    */

  return (

    <Container maxWidth='xs' style={styles.form}>
      <div style={styles.title}>
        Información del Paciente
      </div>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'}}>
        <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1}}>

          <TextField 
            margin='normal'
            required
            fullWidth
            label="DNI"
            name="dni_paciente"
            autoFocus
            style={styles.formEle}
            variant="filled"
            //value={dni_paciente}
            onChange={formik.handleChange}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label="Nombres"
            name="nombres"
            style={styles.formEle}
            variant="filled"
            //value={nombres}
            onChange={formik.handleChange}
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            label="Apellido Paterno"
            name='ape_paterno'
            style={styles.formEle}
            variant="filled"
            //value={ape_paterno}
            onChange={formik.handleChange}
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            label="Apellido Materno"
            name='ape_materno'
            style={styles.formEle}
            variant="filled"
            //value={ape_materno}
            onChange={formik.handleChange}
          />

          <Box fullWidth style={styles.formEle}>
            <FormControl fullWidth >
              <InputLabel id="lbl-sexo">Sexo</InputLabel>        
              <Select
                labelId="lbl-sexo"
                label="Sexo"
                onChange={formik.handleChange("sexo")}
              >
                {
                  sexoOptions.map((ele) => 
                    <MenuItem key={ele.key} value={ele.key}>{ele.value}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth style={{...styles.formEle, paddingBottom:20}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker
                label="Fecha de Nacimiento"
                //value={fecha_nacimiento}
                onChange={(newValue) =>{
                  console.log(`FECHA NACIMIENTO: ${newValue}`)
                  formik.setFieldValue("fecha_nacimiento", newValue)
                }}
              />
            </LocalizationProvider>
            <FormHelperText>Edad: {edadCalculada}</FormHelperText>
          </FormControl>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker 
                label="Fecha de evaluacion" 
                value={dayjs(new Date, "MM-DD-YYYY")}
                
                disabled 
              />
            </LocalizationProvider>
          </FormControl>

          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button
              type="submit"
              variant='outlined'
              sx={{ mt: 3, mb: 2}}
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
