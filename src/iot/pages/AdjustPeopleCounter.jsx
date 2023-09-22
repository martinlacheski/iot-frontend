import React, { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../helpers";
import iotApi from "../../api/iotApi";
import { Header } from "../components/Header";
import {
  Box,
  Button,
  Divider,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";
import {
  showSuccessToast,
  showErrorAlert,
  showConfirmationAlert,
  showLoadingAlert,
} from "../../utils";

const { VITE_SOCKET_URL } = getEnvVariables();

const formData = {
  counter: "",
};

const formValidations = {
  counter: [
    (value) => /^\d+$/.test(value) && parseInt(value) >= 0,
    "Ingrese un número válido",
  ],
};

export const AdjustPeopleCounter = () => {
  const [countPeople, setCountPeople] = useState(0);
  const [data, setData] = useState(null);
  const [lastValueDB, setLastValueDB] = useState(0);

  const { counter, counterValid, isFormValid, onInputChange } = useForm(
    formData,
    formValidations
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    const confirmation = await showConfirmationAlert(
      `¿Está seguro de actualizar el contador a ${counter} personas?`
    );
    if (!confirmation.isConfirmed) return;

    try {
      const socket = io(VITE_SOCKET_URL);
      socket.emit("setCounter", parseInt(counter));

      showLoadingAlert("Actualizando contador...", "Espere un momento", 3000);

      let localCounter = 0;

      socket.on("countPeople", (data) => {
        if (!data.data.timestamp) return;
        setData(data.sensor.count);
        localCounter = data.sensor.count;
        
        if (data.sensor.count === parseInt(counter)) {
          showSuccessToast(
            `¡Contador actualizado a ${counter} personas con éxito!`
          );
          setCountPeople(counter);
          onInputChange({ target: { name: "counter", value: "" } });
        }
        return () => {
          socket.disconnect();
        }
      });

      setTimeout(() => {
        if (localCounter !== parseInt(counter)) {
          console.log(data);
          showErrorAlert("¡Error al actualizar el contador!");
        }
      }, 3000);

    } catch (error) {
      showErrorAlert("¡Error al actualizar el contador!");
    }
  };

  const getLastValue = async () => {
    try {
      const { data } = await iotApi.get("/data-count-people");
      setCountPeople(data.count.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLastValue();
  }, []);

  return (
    <Fragment>
      <Header
        title="Ajustar contador de personas"
        subtitle="En esta sección podrá ajustar manualmente el contador de personas."
      />

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "2rem",
          margin: "2rem auto",
          width: {
            xs: "100%",
            sm: "80%",
            md: "60%",
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Typography
                variant="h1"
                typography="h1"
                sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: ".5rem" }}
              >
                Ajustar contador de personas
              </Typography>
              <Divider sx={{ mb: ".5rem" }} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: "1rem", display: "flex" }}>
              <Typography variant="h2" sx={{ fontSize: "1.2rem", mr: ".5rem" }}>
                Estado actual del contador:{" "}
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {countPeople === 1 ? "1 persona" : `${countPeople} personas`}
              </Typography>
            </Box>

            <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: ".5rem" }}>
              Actualizar contador
            </Typography>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <TextField
                placeholder="Ingrese la cantidad de personas"
                variant="outlined"
                fullWidth
                type="number"
                name="counter"
                value={counter}
                onChange={onInputChange}
              />
              <Button
                variant="contained"
                sx={{ px: "2rem" }}
                onClick={onSubmit}
                disabled={!isFormValid}
              >
                Actualizar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};
