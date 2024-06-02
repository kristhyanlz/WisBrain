import ErrorPage from "./pages/errorPage";
import Contact from "./pages/contact";
import FichaSociodemo from "./pages/FichaSociodemo";
import Resultados from './pages/Resultados'
import Pacientes from "./pages/Pacientes";

import Barra from "./components/Barra";

import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';

import Test from './pages/Test'

export default function Main() {
  const navigate = useNavigate();
  return (
      <>
        <Barra>
          <Routes>
            <Route path="/" element={<Navigate to='/FichaSociodemografica'/> } />
            <Route path='/Test'    element={<Test/>} />
            <Route path='/FichaSociodemografica'    element={<FichaSociodemo/>} />
            <Route path='/Resultados'    element={<Resultados/>} />
            <Route path='/Pacientes'    element={<Pacientes/>} />
            <Route path="/contacts/:name/:lastname" element={<Contact/>}/>
            <Route path="/error" element={<ErrorPage/>} />
            <Route path="*" element={<ErrorPage/> } />
          </Routes>
        </Barra>
      </>
  );
}