import ErrorPage from "./pages/errorPage";
import Contact from "./pages/contact";
import FichaSociodemo from "./pages/FichaSociodemo";
import Resultados from './pages/Resultados'
import Pacientes from "./pages/Pacientes";

import Barra from "./components/Barra";

import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';

import Del from './pages/Del'

export default function Main() {
  const navigate = useNavigate();
  return (
      <>
        <Barra>
          <Routes>
            <Route path="/" element={<Navigate to='/FichaSociodemografica'/>}/>
            <Route path='/del'    element={<Del/>} />
            <Route path='/FichaSociodemografica'    element={<FichaSociodemo/>} />
            <Route path='/Resultados'    element={<Resultados/>} />
            <Route path='/Pacientes'    element={<Pacientes/>} />
            <Route path="/contacts/:name/:lastname" element={<Contact/>}/>
            <Route path="*" element={<ErrorPage/>}/>
          </Routes>
        </Barra>
      </>
  );
}