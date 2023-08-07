import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import iotApi from "../../../api/iotApi";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { useForm } from "../../../hooks/useForm";

const formData = {
  name: "",
  typeOfEnvironmentId: "",
  branchId: "",
  floor: "",
  room: "",
  capacity: "",
  surface: "",
  observations: "",
  equipments: [],
};

export const CreateEnvironment = () => {
  const [typesOfEnvironment, setTypesOfEnvironment] = useState([]);
  const [branches, setBranches] = useState([]);
  const [equipmentsList, setEquipmentsList] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);

  const {
    formState,
    name,
    typeOfEnvironmentId,
    branchId,
    floor,
    room,
    capacity,
    surface,
    observations,
    equipments,
    onInputChange,
    isFormValid,
  } = useForm(formData);

  const fetchTypesOfEnvironment = async () => {
    try {
      const { data } = await iotApi.get("/types-of-environments");
      setTypesOfEnvironment(data.typeOfEnvironments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await iotApi.get("/branches");
      setBranches(data.branches);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEquipments = async () => {
    try {
      const { data } = await iotApi.get("/equipments");
      setEquipmentsList(data.equipments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchTypesOfEnvironment(),
      fetchBranches(),
      fetchEquipments(),
    ]);
  }, []);

  const handleEquipmentChange = (index, equipmentId) => {
    const updatedSelectedEquipments = [...selectedEquipments];
    updatedSelectedEquipments[index].equipmentId = equipmentId;
    setSelectedEquipments(updatedSelectedEquipments);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedSelectedEquipments = [...selectedEquipments];
    updatedSelectedEquipments[index].quantity = quantity;
    setSelectedEquipments(updatedSelectedEquipments);
  };

  const handleAddEquipment = () => {
    setSelectedEquipments([
      ...selectedEquipments,
      { equipmentId: "", quantity: "" },
    ]);
  };

  return (
    <Fragment>
      <Header
        title="Crear ambiente"
        subtitle="En esta sección podrá registrar un nuevo ambiente en el sistema."
      />

      {/* CUERPO DE LA PÁGINA */}
      <Box m={3} width={{ xs: "90vw", lg: "60vw" }} mx="auto">
        <Typography sx={{ mb: "1rem", fontWeight: "bold" }}>
          Información del ambiente
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de ambiente</InputLabel>
              <Select
                name="typeOfEnvironmentId"
                value={typeOfEnvironmentId}
                onChange={onInputChange}
              >
                <MenuItem value="">
                  <em>Seleccionar tipo</em>
                </MenuItem>
                {typesOfEnvironment.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="name"
              name="name"
              value={name}
              onChange={onInputChange}
              label="Nombre del ambiente"
              fullWidth
              autoComplete="off"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Sede</InputLabel>
              <Select name="branchId" value={branchId} onChange={onInputChange}>
                <MenuItem value="">
                  <em>Seleccionar sede</em>
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="floor"
              name="floor"
              label="Piso"
              value={floor}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="room"
              name="room"
              label="Salón"
              value={room}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="capacity"
              name="capacity"
              label="Capacidad"
              value={capacity}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="surface"
              name="surface"
              label="Superficie"
              value={surface}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
            />
          </Grid>

          <Grid item xs={12}>
            <TextareaAutosize
              minRows={3}
              placeholder="Observaciones"
              name="observations"
              value={observations}
              onChange={onInputChange}
              style={{
                width: "100%",
                padding: ".5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: ".5rem",
                resize: "none",
                backgroundColor: "transparent",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box mt={1}>
              <Typography sx={{ mb: ".5rem", fontWeight: "bold" }}>
                Equipamientos
              </Typography>
              {selectedEquipments.map((selected, index) => (
                <Grid container spacing={2} key={index} marginBottom={1}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Equipamiento</InputLabel>
                      <Select
                        value={selected.equipmentId}
                        onChange={(event) =>
                          handleEquipmentChange(index, event.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>Seleccionar equipamiento</em>
                        </MenuItem>
                        {equipmentsList
                          .filter(
                            (equip) =>
                              !selectedEquipments.some(
                                (selected) => selected.equipmentId === equip._id
                              )
                          )
                          .map((equip) => (
                            <MenuItem key={equip._id} value={equip._id}>
                              {equip.description}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cantidad"
                      type="number"
                      value={selected.quantity}
                      onChange={(event) =>
                        handleQuantityChange(index, event.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddEquipment}
              >
                Agregar Equipamiento
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box mt={1} textAlign="end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log(formState)}
          >
            Crear ambiente
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
