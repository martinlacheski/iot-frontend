import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export const SecurityMovementChart = ({ data }) => {
  const rows = Object.values(data.data);

  return (
    <TableContainer component={Paper} sx={{ pb: "2rem" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#9ca3af" }}>
            <TableCell colSpan={2} sx={{ textAlign: "center" }}>
              PERÍODO
            </TableCell>
            <TableCell colSpan={2} sx={{ textAlign: "center" }}>
              MOVIMIENTO
            </TableCell>
            <TableCell colSpan={4} sx={{ textAlign: "center" }}>
              FLUJO DE PERSONAS
            </TableCell>
            <TableCell colSpan={2} sx={{ textAlign: "center" }}>
              ESTADO DE ABERTURAS
            </TableCell>
          </TableRow>
          <TableRow style={{ backgroundColor: "#d1d5db" }}>
            <TableCell sx={{ textAlign: "center" }}>DESDE</TableCell>
            <TableCell sx={{ textAlign: "center" }}>HASTA</TableCell>

            <TableCell sx={{ textAlign: "center" }}>DETECTADO</TableCell>
            <TableCell sx={{ textAlign: "center" }}>MOVIMIENTOS</TableCell>

            <TableCell sx={{ textAlign: "center" }}>INICIAL</TableCell>
            <TableCell sx={{ textAlign: "center" }}>FINAL</TableCell>
            <TableCell sx={{ textAlign: "center" }}>MÍNIMO</TableCell>
            <TableCell sx={{ textAlign: "center" }}>MÁXIMO</TableCell>

            <TableCell sx={{ textAlign: "center" }}>PUERTAS</TableCell>
            <TableCell sx={{ textAlign: "center" }}>VENTANAS</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} sx={{ backgroundColor: row.warning.showWarning ? 'rgba(185, 28, 28, 0.2)' : '' }}>
              <TableCell
                sx={{ textAlign: "center" }}
              >{`${row.dateRange.initial}`}</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
              >{`${row.dateRange.final}`}</TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                {row.motionDetection.wasDetected ? "Detectado" : "No detectado"}
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                {row.motionDetection.count}
              </TableCell>

              <TableCell
                sx={{ textAlign: "center" }}
              >{`${row.countPeople.initial}`}</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
              >{`${row.countPeople.final}`}</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
              >{`${row.countPeople.min}`}</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
              >{`${row.countPeople.max}`}</TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                {row.windowsStatus.wereOpen ? "Abiertas" : "Cerradas"}
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                {row.doorsStatus.wereOpen ? "Abiertas" : "Cerradas"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
