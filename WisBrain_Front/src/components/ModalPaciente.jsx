import React, { useEffect, useState } from 'react';
import { useFormik, useField } from 'formik';
import * as Yup from 'yup';

import {Box, FormControl, TextField, InputLabel, Input, Select, MenuItem, Button, FormHelperText, Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

//DATE
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//TOAST
import { toast } from 'react-toastify';

//BACK URL
import BACK_URL from '../pages/backURL';

const NOM_REGEX = /^(?![\' \-])[a-zA-ZÀ-ÿ\u00f1\u00d1 \'\-]*(?<![\' \-])$/

const styles = {
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  title:{
    textAlign: 'center',
    fontSize: 32,
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: 'Candara',
  },
  formEle: {
    paddingHorizontal: 10,
    paddingTop: 0,
  }
};

const FormSchema = Yup.object().shape({
  dni_paciente: Yup.string().matches(/^\d{8}$/, 'Debe ingresar los 8 dígitos del DNI').required('Campo requerido'),
  nombres: Yup.string().matches(NOM_REGEX, 'Revise los espacios o carácteres especiales').required('Campo requerido'),
  ape_paterno: Yup.string().matches(NOM_REGEX, 'Revise los espacios o carácteres especiales').required('Campo requerido'),
  ape_materno: Yup.string().matches(NOM_REGEX, 'Revise los espacios o carácteres especiales').required('Campo requerido'),
  sexo: Yup.string().required('Por favor, seleccione una opción'),
  fecha_nacimiento: Yup.date().required('Campo requerido'),
  fecha_evaluacion: Yup.date().required('Campo requerido'),
})

const sexoOptions = [
  { key: 'Hombre', value: 'Hombre' },
  { key: 'Mujer', value: 'Mujer' },
];

export default function ModalPaciente ({open, handleClose}) {
  let fichaLocalStorage = JSON.parse(localStorage.getItem('testEnable'))

  const formik = useFormik({
    initialValues:{
      dni_paciente: fichaLocalStorage.dni_paciente || '',
      nombres: fichaLocalStorage.nombres || '',
      ape_paterno: fichaLocalStorage.ape_paterno || '',
      ape_materno: fichaLocalStorage.ape_materno || '',
      sexo: fichaLocalStorage.sexo || '',
      fecha_nacimiento: fichaLocalStorage.fecha_nacimiento ? dayjs(fichaLocalStorage.fecha_nacimiento) : null,
      fecha_evaluacion: dayjs(),
    },
    onSubmit: async (values)=>{
      console.log(`SUBMIT: \n${JSON.stringify(values)}`)
      toast.info('Enviando información...')
      
      let fichaJSON = JSON.stringify({
        dni_paciente_nuevo: values.dni_paciente,
        nombres: values.nombres,
        ape_paterno: values.ape_paterno,
        ape_materno: values.ape_materno,
        sexo: values.sexo,
        fecha_nacimiento: values.fecha_nacimiento,
        edad: edadCalculada,
        dni_paciente_antiguo: fichaLocalStorage.dni_paciente
      })

      try {
        
        const submitForm = await fetch(`${BACK_URL}/actualizarPaciente`, {
          method: 'PUT',
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
          },
          body: fichaJSON
        })
        console.log(`STATUS: ${submitForm.status}`)
        if (!submitForm.ok){
          if (submitForm.status === 500) {
            const errorData = await submitForm.json();
            toast.error('No se pudo actualizar los datos del paciente');
          }
        } else if (submitForm.status === 200){
          const result = await submitForm.json();
          console.log(result);
          fichaJSON = JSON.parse(fichaJSON)
          console.log("Entro al 200")
          fichaJSON.dni_paciente = fichaJSON.dni_paciente_nuevo
          delete fichaJSON["dni_paciente_nuevo"]
          delete fichaJSON["dni_paciente_antiguo"]
          localStorage.setItem('testEnable', JSON.stringify(fichaJSON))
          toast.success('Información guardada correctamente');
        }
      } catch (error) {
        toast.error('Falló la conexión con la base de datos')
      }
      handleClose()
    },
    validationSchema: FormSchema
  })

  const [edadCalculada, setEdadCalculada] = useState(null)
  useEffect(() => {
    setEdadCalculada(dayjs().diff(dayjs(fichaLocalStorage.fecha_nacimiento), 'year'))
  }, [])
  
  const [fechaEvaluacion, setFechaEvaluacion] = useState(dayjs())


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Información del Paciente
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt : 1}}
        >
          

            <TextField 
              margin='normal'
              required
              fullWidth
              label="DNI"
              name="dni_paciente"
              autoFocus
              style={{...styles.formEle, marginTop:10}}
              variant="filled"
              value={formik.values.dni_paciente}
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
              value={formik.values.nombres}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombres && Boolean(formik.errors.nombres)}
              helperText={formik.touched.nombres && formik.errors.nombres}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  margin='normal'
                  required
                  fullWidth
                  label="Apellido Paterno"
                  name='ape_paterno'
                  style={styles.formEle}
                  variant="filled"
                  value={formik.values.ape_paterno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ape_paterno && Boolean(formik.errors.ape_paterno)}
                  helperText={formik.touched.ape_paterno && formik.errors.ape_paterno}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  margin='normal'
                  required
                  fullWidth
                  label="Apellido Materno"
                  name='ape_materno'
                  style={styles.formEle}
                  variant="filled"
                  value={formik.values.ape_materno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ape_materno && Boolean(formik.errors.ape_materno)}
                  helperText={formik.touched.ape_materno && formik.errors.ape_materno}
                />
              </Grid>
            </Grid>

            <Box fullWidth style={{...styles.formEle, paddingTop: 25}}>
              <FormControl fullWidth >
                <InputLabel id="lbl-sexo">Sexo *</InputLabel>        
                <Select
                  labelId="lbl-sexo"
                  label="Sexo"
                  name='sexo'
                  required
                  value={formik.values.sexo}
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

            <Grid container spacing={2} style={{marginTop: 11, marginBottom:30, flex: 1}}>
              <Grid item xs={9}>
                <FormControl fullWidth >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* <DatePicker value={value} onChange={(newValue) => setValue(newValue)} /> */}
                    
                    <DatePicker
                      label="Fecha de Nacimiento"
                      format='DD-MM-YYYY'
                      required
                      value={dayjs(formik.values.fecha_nacimiento)}
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

            <DialogActions>
              <Button onClick={handleClose} color="primary" variant='outlined'>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant='outlined'
                color='primary'
              >
                Actualizar
              </Button>
            </DialogActions>
            
        </Box>
      </DialogContent>
    </Dialog>
  );
}
