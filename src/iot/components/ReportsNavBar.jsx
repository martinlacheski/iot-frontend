import React from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { FlexBetween } from "../components/FlexBetween";
import {
  EditNoteOutlined,
  RestartAltOutlined,
  PictureAsPdfOutlined,
} from "@mui/icons-material";

export const ReportsNavBar = ({
  environments,
  setSelectedEnvironment,
  selectedEnvironment,
  fromDate,
  handleChangeFromDate,
  toDate,
  handleChangeToDate,
  handleSubmit,
  handleReset,
}) => {
  return (
    <Box
      sx={{
        p: "0.5rem 2rem 1.25rem 2rem",
        backgroundColor: "white",
      }}
    >
      <FlexBetween>
        <Grid container spacing={1} sx={{ width: "100%" }}>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel>Seleccione un ambiente de la lista</InputLabel>
              <Select
                name="environment"
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
                placeholder="Seleccione un ambiente de la lista"
                sx={{
                  backgroundColor: "white"
                }}
              >
                {environments.map((environment) => (
                  <MenuItem key={environment._id} value={environment._id}>
                    {environment.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <DateTimePicker
              format="DD/MM/YYYY HH:mm:ss"
              ampm={false}
              value={fromDate}
              onChange={handleChangeFromDate}
              label="Desde fecha"
              sx={{
                width: "100%",
                backgroundColor: "white",
                // "& .MuiInputBase-input": {
                //   height: "1rem",
                // },
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <DateTimePicker
              format="DD/MM/YYYY HH:mm:ss"
              ampm={false}
              value={toDate}
              onChange={handleChangeToDate}
              label="Hasta fecha"
              sx={{
                width: "100%",
                backgroundColor: "white",
                // "& .MuiInputBase-input": {
                //   height: "1rem",
                // },
              }}
            />
          </Grid>
          <Grid item xs={4} md={1}>
            <Button
              title="Generar reporte"
              variant="contained"
              onClick={handleSubmit}
              sx={{ height: "100%", width: "100%", gap: 0.5 }}
              size="small"
            >
              <EditNoteOutlined fontSize="small" />
              Generar
            </Button>
          </Grid>
          <Grid item xs={4} md={1}>
            <Button
              title="Limpiar campos"
              variant="contained"
              onClick={handleReset}
              color="secondary"
              sx={{ height: "100%", width: "100%", gap: 0.5 }}
              size="small"
            >
              <RestartAltOutlined fontSize="small" />
              Limpiar
            </Button>
          </Grid>
          <Grid item xs={4} md={1}>
            <Button
              title="Exportar reporte"
              variant="contained"
              color="error"
              sx={{ height: "100%", width: "100%", gap: 0.5 }}
              size="small"
            >
              <PictureAsPdfOutlined fontSize="small" />
              Exportar
            </Button>
          </Grid>
        </Grid>
      </FlexBetween>
    </Box>
  );
};
