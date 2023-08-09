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
  useTheme,
} from "@mui/material";
import { RemoveCircleOutlineOutlined } from "@mui/icons-material";
import { useForm } from "../../../hooks/useForm";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { useNavigate } from "react-router-dom";

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

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio."],
  typeOfEnvironmentId: [
    (value) => value.trim() !== "",
    "El tipo es obligatorio.",
  ],
  branchId: [(value) => value.trim() !== "", "La sede es obligatoria."],
  floor: [
    (value) => /^\d+$/.test(value) && parseInt(value) > 0,
    "El piso debe ser positivo.",
  ],
  room: [
    (value) => /^\d+$/.test(value) && parseInt(value) > 0,
    "El salón debe ser positivo.",
  ],
  capacity: [
    (value) => /^\d+$/.test(value) && parseInt(value) > 0,
    "La capacidad debe ser positiva.",
  ],
  surface: [
    (value) => /^\d+$/.test(value) && parseInt(value) > 0,
    "La superficie debe ser positiva.",
  ],
  equipments: [
    (value) =>
      value.every(
        (equipment) =>
          equipment.equipment.trim() !== "" && equipment.quantity > 0
      ),
    "Verifique que todos los campos de equipamiento tengan un tipo y una cantidad válida.",
  ],
};

export const CreateEnvironment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [typesOfEnvironment, setTypesOfEnvironment] = useState([]);
  const [branches, setBranches] = useState([]);
  const [equipmentsList, setEquipmentsList] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  const {
    formState,
    name,
    nameValid,
    typeOfEnvironmentId,
    typeOfEnvironmentIdValid,
    branchId,
    branchIdValid,
    floor,
    floorValid,
    room,
    roomValid,
    capacity,
    capacityValid,
    surface,
    surfaceValid,
    observations,
    equipments,
    equipmentsValid,
    onInputChange,
    isFormValid,
  } = useForm(formData, formValidations);

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
    updatedSelectedEquipments[index].equipment = equipmentId;
    setSelectedEquipments(updatedSelectedEquipments);
    onInputChange({
      target: {
        name: "equipments",
        value: updatedSelectedEquipments,
      },
    });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedSelectedEquipments = [...selectedEquipments];
    updatedSelectedEquipments[index].quantity = quantity;
    setSelectedEquipments(updatedSelectedEquipments);
    onInputChange({
      target: {
        name: "equipments",
        value: updatedSelectedEquipments,
      },
    });
  };

  const handleAddEquipment = () => {
    setSelectedEquipments([
      ...selectedEquipments,
      { equipment: "", quantity: "" },
    ]);
  };

  const handleRemoveEquipment = (index) => {
    const updatedSelectedEquipments = [...selectedEquipments];
    updatedSelectedEquipments.splice(index, 1);
    setSelectedEquipments(updatedSelectedEquipments);
    onInputChange({
      target: {
        name: "equipments",
        value: updatedSelectedEquipments,
      },
    });
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    const body = {
      name,
      typeOfEnvironmentId,
      branchId,
      floor,
      room,
      capacity,
      surface,
      equipments,
      observations,
    };

    setDisabledButton(true);

    try {
      const { data } = await iotApi.post("/environments", body);
      showSuccessToast(data.msg);
      setTimeout(() => {
        navigate("/parameters/environments");
      }, 2000);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
      setDisabledButton(false);
    }
  };

  return (
    <Fragment>
      <Header
        title="Crear ambiente"
        subtitle="En esta sección podrá registrar un nuevo ambiente en el sistema."
      />

      {/* CUERPO DE LA PÁGINA */}
      <Box m={3} width={{ xs: "90vw", lg: "70vw" }} mx="auto">
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
                error={!!typeOfEnvironmentIdValid && formSubmitted}
              >
                <MenuItem value="" disabled>
                  <em>Seleccionar tipo</em>
                </MenuItem>
                {typesOfEnvironment.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {
                // Si el formulario fue enviado y el campo es inválido, se muestra el mensaje de error
                formSubmitted && !!typeOfEnvironmentIdValid && (
                  <Typography
                    variant="span"
                    fontSize={13}
                    color={theme.palette.error.main}
                  >
                    {typeOfEnvironmentIdValid}
                  </Typography>
                )
              }
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
              error={!!nameValid && formSubmitted}
              helperText={!!nameValid && formSubmitted ? nameValid : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Sede</InputLabel>
              <Select
                name="branchId"
                value={branchId}
                onChange={onInputChange}
                error={!!branchIdValid && formSubmitted}
              >
                <MenuItem value="" disabled>
                  <em>Seleccionar sede</em>
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
              {
                // Si el formulario fue enviado y el campo es inválido, se muestra el mensaje de error
                formSubmitted && !!branchIdValid && (
                  <Typography
                    variant="span"
                    fontSize={13}
                    color={theme.palette.error.main}
                  >
                    {branchIdValid}
                  </Typography>
                )
              }
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="floor"
              name="floor"
              label="Piso"
              value={floor}
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              type="number"
              error={!!floorValid && formSubmitted}
              helperText={!!floorValid && formSubmitted ? floorValid : ""}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="room"
              name="room"
              label="Salón"
              value={room}
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              type="number"
              error={!!roomValid && formSubmitted}
              helperText={!!roomValid && formSubmitted ? roomValid : ""}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="capacity"
              name="capacity"
              label="Capacidad"
              value={capacity}
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              type="number"
              error={!!capacityValid && formSubmitted}
              helperText={!!capacityValid && formSubmitted ? capacityValid : ""}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="surface"
              name="surface"
              label="Superficie"
              value={surface}
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              type="number"
              error={!!surfaceValid && formSubmitted}
              helperText={!!surfaceValid && formSubmitted ? surfaceValid : ""}
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
                Detalle de equipamiento
              </Typography>

              {selectedEquipments.map((selected, index) => (
                <Grid container spacing={2} key={index} marginBottom={2}>
                  <Grid item xs={8} sm={9}>
                    <FormControl fullWidth>
                      <InputLabel>Equipamiento</InputLabel>
                      <Select
                        value={selected.equipment}
                        onChange={(event) =>
                          handleEquipmentChange(index, event.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>Seleccionar equipamiento</em>
                        </MenuItem>
                        {equipmentsList.map((equipment) => (
                          <MenuItem
                            key={equipment._id}
                            value={equipment._id}
                            disabled={selectedEquipments.some(
                              (selectedEquipment) =>
                                selectedEquipment.equipment === equipment._id
                            )}
                          >
                            {equipment.typeOfEquipment.name} -{" "}
                            {equipment.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} sm={2}>
                    <TextField
                      label="Cantidad"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: 100 } }}
                      value={selected.quantity}
                      onChange={(event) =>
                        handleQuantityChange(index, event.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1} display="flex" justifyContent="center">
                    <Button onClick={() => handleRemoveEquipment(index)}>
                      <RemoveCircleOutlineOutlined />
                    </Button>
                  </Grid>
                </Grid>
              ))}

              {
                // Si el formulario fue enviado y el campo es inválido, se muestra el mensaje de error
                formSubmitted && !!equipmentsValid && (
                  <Alert severity="error" sx={{ mb: ".5rem" }}>
                    <Typography variant="body2">{equipmentsValid}</Typography>
                  </Alert>
                )
              }

              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddEquipment}
                disabled={selectedEquipments.length === equipmentsList.length}
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
            onClick={handleSubmit}
            disabled={!isFormValid || disabledButton}
          >
            Crear ambiente
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
