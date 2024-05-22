import ErrorPage from "./pages/errorPage";
import Contact from "./pages/contact";
import FichaSociodemo from "./pages/FichaSociodemo";
import Barra from "./components/Barra";

import { useNavigate, Routes, Route } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate();
  return (
      <>
        <Barra>
          <Routes>
            <Route path="/" element={<div>Hola mundo</div>}/>
            <Route path='/FichaSociodemografica'    element={<FichaSociodemo/>} />
            <Route path="/contacts/:name/:lastname" element={<Contact/>}/>
            <Route path="*" element={<ErrorPage/>}/>
          </Routes>
        </Barra>
      </>
  );
}