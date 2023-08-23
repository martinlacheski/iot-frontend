import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import iotApi from "../../../api/iotApi";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Grid,
  Typography,
  Alert,
  TextareaAutosize,
} from "@mui/material";
import {
  ModeEditOutlineOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { useForm } from "../../../hooks/useForm";
import { FlexBetween } from "../../components/FlexBetween";
import {
  showSuccessToast,
  showErrorAlert,
  showConfirmationAlert,
} from "../../../utils";

const formData = {
  name: "",
  specs: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio."],
  specs: [
    (value) => value.trim() !== "",
    "Las especificaciones son obligatorias.",
  ],
};

export const SensorTypes = () => {
  const [sensorTypes, setSensorTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editSensorTypeId, setEditSensorTypeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    formState,
    name,
    specs,
    onInputChange,
    isFormValid,
    nameValid,
    specsValid,
  } = useForm(formData, formValidations);

  useEffect(() => {
    fetchSensorTypes();
  }, []);

  // OBTENER TIPOS DE SENSOR
  const fetchSensorTypes = async () => {
    try {
      const { data } = await iotApi.get("/types-of-sensors");
      setSensorTypes(data.typesOfSensor);
    } catch (error) {
      console.log("Error fetching typeOfSensors:", error);
    }
  };

  // CREAR TIPO DE SENSOR
  const handleCreateSensorType = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/types-of-sensors", formState);
      setSensorTypes([...sensorTypes, data.typeOfSensor]);
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // EDITAR TIPO DE SENSOR
  const handleEditSensorType = async (id) => {
    const sensorTypeToEdit = sensorTypes.find((type) => type._id === id);
    if (sensorTypeToEdit) {
      formState.name = sensorTypeToEdit.name;
      formState.specs = sensorTypeToEdit.specs;
      setEditSensorTypeId(id);
      handleOpenModal();
    }
  };

  const updateTypeOfSensor = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(
        `/types-of-sensors/${editSensorTypeId}`,
        formState
      );
      setSensorTypes(
        sensorTypes.map((type) =>
          type._id === editSensorTypeId ? data.typeOfSensor : type
        )
      );
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR TIPO DE SENSOR
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación del tipo de sensor?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/types-of-sensors/${id}`);
        setSensorTypes(sensorTypes.filter((type) => type._id !== id));
        showSuccessToast(data.msg);
      }
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditSensorTypeId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    formState.name = "";
    formState.specs = "";
  };

  const onSubmit = () => {
    if (editSensorTypeId) {
      updateTypeOfSensor();
    } else {
      handleCreateSensorType();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200, hide: true },
    { field: "name", headerName: "Nombre", minWidth: 200, flex: 0.3 },
    { field: "specs", headerName: "Especificaciones", minWidth: 300, flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button
            title = "Editar tipo de sensor"
            size = "small"
            variant="outlined"
            color="primary"
            onClick={() => handleEditSensorType(params.row._id)}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            title = "Eliminar tipo de sensor"
            size = "small"
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteOutlineOutlined />
          </Button>
        </Box>
      ),
    },
  ];

  // Función para obtener el ID de una fila
  const getRowId = (row) => row._id;

  return (
    <Fragment>
      <Header
        title="Tipos de sensores"
        subtitle="En esta sección podrá administrar los tipos de sensores del sistema."
      />

      <Box
        sx={{
          height: "60vh",
          width: "100%",
          padding: "1rem 2rem",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#e5e7eb",
            fontWeight: "bold",
            textTransform: "uppercase",
            borderBottom: "none",
          },
        }}
      >
        <FlexBetween
          sx={{
            alignContent: "center",
            mb: "1rem",
          }}
        >
          <Typography sx={{ mb: "1rem", fontWeight: "bold", m: "0" }}>
            Listado de tipos de sensores
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear tipo de sensor
          </Button>
        </FlexBetween>
        <DataGrid
          autoHeight
          maxHeight="100%"
          loading={!sensorTypes}
          rows={sensorTypes}
          columns={columns}
          getRowId={getRowId}
        />
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: "1.5rem",
            minWidth: 400,
            borderRadius: "1rem",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              textTransform: "uppercase",
              mb: "1rem",
              fontWeight: "bold",
            }}
          >
            {editSensorTypeId
              ? "Editar tipo de sensor"
              : "Crear nuevo tipo de sensor"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del tipo de sensor"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                minRows={3}
                placeholder="Especificaciones"
                name="specs"
                value={specs}
                onChange={onInputChange}
                // WIDTH 100%
                style={{
                  width: "100%",
                  padding: ".5rem",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: ".5rem",
                  resize: "none",
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ float: "right" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
              style={{ marginTop: "1rem", marginRight: ".5rem" }}
            >
              Cancelar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={onSubmit}
              style={{ marginTop: "1rem" }}
              disabled={!isFormValid}
            >
              {editSensorTypeId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
