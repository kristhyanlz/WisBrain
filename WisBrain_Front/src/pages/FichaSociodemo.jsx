import React, { useEffect, useState } from 'react';
import { useFormik, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import {Box, FormControl, TextField, InputLabel, Input, Select, MenuItem, Button, FormHelperText, Container, Grid } from '@mui/material';

//DATE
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//TOAST
import { toast } from 'react-toastify';

//BACK URL
import BACK_URL from './backURL';

const EDAD_MINIMA = 15
const EDAD_MAXIMA = 21

const styles = {
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingHorizontal: 0,
  },
  title:{
    textAlign: 'center',
    fontSize: 32,
    paddingTop: 20,
    paddingBottom: 20,
    fontFamily: 'Candara',
  },
  formEle: {
    paddingHorizontal: 10,
    paddingTop: 10,
  }
};

const FormSchema = Yup.object().shape({
  dni_paciente: Yup.string().matches(/^\d{8}$/, 'Debe ingresar los 8 dígitos del DNI').required('Campo requerido'),
  nombres: Yup.string().matches(/^[a-zA-Z]+[\'\-a-zA-Z ]*$/, 'Solo letras, se admite \' y -').required('Campo requerido'),
  ape_paterno: Yup.string().matches(/^[a-zA-Z]+[\'\-a-zA-Z ]*$/, 'Solo letras, se admite \' y -').required('Campo requerido'),
  ape_materno: Yup.string().matches(/^[a-zA-Z]+[\'\-a-zA-Z ]*$/, 'Solo letras, se admite \' y -').required('Campo requerido'),
  sexo: Yup.string().required('Por favor, seleccione una opción'),
  fecha_nacimiento: Yup.date().required('Campo requerido'),
  fecha_evaluacion: Yup.date().required('Campo requerido'),
})

const sexoOptions = [
  { key: 'Hombre', value: 'Hombre' },
  { key: 'Mujer', value: 'Mujer' },
];

export default function FichaSociodemo () {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues:{
      dni_paciente: '',
      nombres: '',
      ape_paterno: '',
      ape_materno: '',
      sexo: '',
      fecha_nacimiento: null,
      fecha_evaluacion: dayjs(),
    },
    onSubmit: async (values)=>{
      console.log(`SUBMIT: \n${JSON.stringify(values)}`)
      toast.info('Enviando información...')
      try {
        const submitForm = await fetch(`${BACK_URL}/insertar_paciente`, {
          method: 'POST',
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dni_paciente: values.dni_paciente,
            nombres: values.nombres,
            ape_paterno: values.ape_paterno,
            ape_materno: values.ape_materno,
            sexo: values.sexo,
            fecha_nacimiento: values.fecha_nacimiento,
            fecha_evaluacion: values.fecha_evaluacion
          })
        })

        if (!submitForm.ok) {
          if (submitForm.status === 500) {
            const errorData = await submitForm.json();
            toast.error('El paciente ya realizo el test');
          } else {
            toast.error('Error en la solicitud');
          }
        } else {
          const result = await submitForm.json();
          console.log(result);
          localStorage.setItem('testEnable', 'true')
          toast.success('Información guardada correctamente');
          navigate('/Test')
        }

      } catch (error) {
        toast.error('Error al enviar la información')
      }
    },
    validationSchema: FormSchema
  })

  const [edadCalculada, setEdadCalculada] = useState(null)
  useEffect(() => {
    if (localStorage.getItem('testEnable') === 'true'){
      navigate('/Test')
    }
    setEdadCalculada(null)
  }, [])
  
  const [fechaEvaluacion, setFechaEvaluacion] = useState(dayjs())



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
            onBlur={formik.handleBlur}
            error={formik.touched.dni_paciente && Boolean(formik.errors.dni_paciente)}
            helperText={formik.touched.dni_paciente && formik.errors.dni_paciente}
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
            onBlur={formik.handleBlur}
            error={formik.touched.nombres && Boolean(formik.errors.nombres)}
            helperText={formik.touched.nombres && formik.errors.nombres}
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
            onBlur={formik.handleBlur}
            error={formik.touched.ape_paterno && Boolean(formik.errors.ape_paterno)}
            helperText={formik.touched.ape_paterno && formik.errors.ape_paterno}
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
            onBlur={formik.handleBlur}
            error={formik.touched.ape_materno && Boolean(formik.errors.ape_materno)}
            helperText={formik.touched.ape_materno && formik.errors.ape_materno}
          />

          <Box fullWidth style={{...styles.formEle, paddingTop: 25}}>
            <FormControl fullWidth >
              <InputLabel id="lbl-sexo">Sexo</InputLabel>        
              <Select
                labelId="lbl-sexo"
                label="Sexo"
                name='sexo'
                required
                onChange={formik.handleChange("sexo")}
                onBlur={formik.handleBlur}
                error={formik.touched.sexo && Boolean(formik.errors.sexo)}
                helperText={formik.errors.sexo}
              >
                {
                  sexoOptions.map((ele) => 
                    <MenuItem key={ele.key} value={ele.key}>{ele.value}</MenuItem>
                  )
                }
              </Select>
              <FormHelperText error={formik.touched.sexo && Boolean(formik.errors.sexo)}>{formik.touched.sexo && formik.errors.sexo}</FormHelperText>
            </FormControl>
          </Box>

          <Grid container spacing={2} style={{paddingTop: 29, paddingBottom:20, flex: 1}}>
            <Grid item xs={9}>
              <FormControl fullWidth >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
                  
                  <DatePicker
                    label="Fecha de Nacimiento"
                    format='DD-MM-YYYY'
                    required
                    onChange={(newValue) =>{
                      console.log(`FECHA NACIMIENTO: ${newValue}`)
                      formik.setFieldValue("fecha_nacimiento", newValue)
                      setEdadCalculada(dayjs().diff(dayjs(newValue), 'year'))
                    }}
                    onBlur={formik.handleBlur}
                    slotProps={{ textField: { required: true }}}
                    disableFuture
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Edad"
                
                value={`${edadCalculada == null ? '' : edadCalculada}`}
                disabled
                fullWidth
              >
              </TextField>
            </Grid>
          </Grid>

          <FormControl fullWidth style={styles.formEle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
              
              <DatePicker 
                label="Fecha de evaluacion"
                format='DD-MM-YYYY'
                value={fechaEvaluacion}
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
    </Container>
  );
}
