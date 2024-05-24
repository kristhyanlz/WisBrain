import * as React from "react";
import { Button } from "@mui/material";
import MUIDataTable from "mui-datatables";

import {dataPacientes} from "./dataPacientes";

const columns = [
  {
    name: "DNI",
    options: { filter: true }
  },
  {
    name: "Nombres",
    options: { filter: true }
  },
  {
    name: "Apellidos",
    options: { filter: false }
  },
  {
    name: "Sexo",
    options: { filter: true }
  },
  {
    name: "Fecha de Nacimiento",
    options: { filter: true }
  },
  {
    name: "Fecha de Evaluación",
    options: { filter: true }
  },
  {
    name: "ACCIÓN",
    options: {
      filter: false,
      sort: false,
      empty: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.alert("EDIT");
              }}
            >
              Edit
            </Button>
            <Button
              onClick={(e) => {
                const { data } = this.state;
                data.shift();
                this.setState({ data });
              }}
            >
              Delete
            </Button>
          </>
        );
      }
    }
  }
];

const options = {
  filter: true,
  filterType: "dropdown",//checkbox
  responsive: "stacked",
  page: 2,
  onColumnSortChange: (changedColumn, direction) =>
    console.log("changedColumn: ", changedColumn, "direction: ", direction),
  onChangeRowsPerPage: (numberOfRows) =>
    console.log("numberOfRows: ", numberOfRows),
  onChangePage: (currentPage) => console.log("currentPage: ", currentPage),
  onRowClick: (e) => {
    window.alert("ROW clicked");
  }
};

export default function Pacientes(){
  const data = dataPacientes
  return (
    <MUIDataTable
        title={"LISTA DE PACIENTES"}
        data={data}
        columns={columns}
        options={options}
      />
  )
}