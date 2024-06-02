import { Box } from "@mui/material";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  //const error = useRouteError();
  //console.error(error);

  return (
    <Box id="error-page">
      <h1>
        ¡Vaya!
      </h1>
      <p>
        Lo sentimos, la dirección no se encuentra disponible.
      </p>
        {/*<i>{error.statusText || error.message}</i>*/}
    </Box>
  );
}