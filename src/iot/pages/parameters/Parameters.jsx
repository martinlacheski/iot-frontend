import React, { Fragment } from "react";
import { Header } from "../../components/Header";
import { Box, Typography, Grid, Divider, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const Parameters = () => {
  return (
    <Fragment>

      <Header
        title="Parámetros del sistema"
        subtitle="Desde esta sección podrá administrar los principales parámetros del sistema."
      />


      {/* CUERPO DE LA PÁGINA */}
      <Box sx={{ m: "1.5rem 2rem"}}>
        <Typography variant="h2" sx={{
          fontSize: "1.4rem",
          fontWeight: "bold",
        }}>Listado de módulos parametrizables</Typography>

        <Divider sx={{ my: "1rem" }} />

        {/* ITERAR EL ARREGLO parameters en un GRID de columnas ajustable */}
        <Grid container spacing={2}>
          {parameters.map((param, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link to={param.url} style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary" fullWidth>
                  {param.name}
                </Button>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Fragment>
  );
};

const parameters = [
  {
    name: "Módulo de países",
    url: "/parameters/countries",
  },
  {
    name: "Módulo de provincias",
    url: "/parameters/provinces",
  },
  {
    name: "Módulo de ciudades",
    url: "/parameters/cities",
  },
  {
    name: "Módulo de organización",
    url: "/parameters/organization",
  },
  {
    name: "Módulo de sedes",
    url: "/parameters/branches",
  },
  {
    name: "Módulo de tipos de ambientes",
    url: "/parameters/environment-types",
  },
  {
    name: "Módulo de ambientes",
    url: "/parameters/environments",
  },
  {
    name: "Módulo de tipos de equipamiento",
    url: "/parameters/equipment-types",
  },
  {
    name: "Módulo de equipamientos",
    url: "/parameters/equipments",
  },
  {
    name: "Módulo de tipos de sensores",
    url: "/parameters/sensor-types",
  },
  {
    name: "Módulo de sensores",
    url: "/parameters/sensors",
  },
  {
    name: "Módulo de tipos de placas",
    url: "/parameters/board-types",
  },
  {
    name: "Módulo de placas",
    url: "/parameters/boards",
  },
  {
    name: "Módulo de usuarios",
    url: "/parameters/users",
  },
];