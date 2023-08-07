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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "../../../hooks/useForm";
import { FlexBetween } from "../../components/FlexBetween";
import {
  showSuccessToast,
  showErrorAlert,
  showConfirmationAlert,
} from "../../../utils";

const formData = {
  description: "",
  typeOfEquipmentId: "",
};

const formValidations = {
  description: [(value) => value.trim() !== "", "El nombre es obligatorio."],
  typeOfEquipmentId: [
    (value) => value.trim() !== "",
    "El tipo de equipamiento es obligatorio.",
  ],
};

export const Equipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [typesOfEquipments, setTypesOfEquipments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editEquipmentId, setEditEquipmentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    formState,
    description,
    typeOfEquipmentId,
    onInputChange,
    descriptionValid,
    typeOfEquipmentIdValid,
    isFormValid,
    onResetForm,
  } = useForm(formData, formValidations);

  // OBTENER EQUIPAMIENTOS
  const fetchEquipments = async () => {
    try {
      const { data } = await iotApi.get("/equipments");
      setEquipments(data.equipments);
    } catch (error) {
      console.log("Error fetching equipments:", error);
    }
  };

  // OBTENER TIPOS DE EQUIPAMIENTO
  const fetchTypesOfEquipments = async () => {
    try {
      const { data } = await iotApi.get("/types-of-equipments");
      setTypesOfEquipments(data.typeOfEquipments);
    } catch (error) {
      console.log("Error fetching typesOfEquipments:", error);
    }
  };

  useEffect(() => {
    fetchEquipments();
    fetchTypesOfEquipments();
  }, []);

  // CREAR EQUIPAMIENTO
  const handleCreateEquipment = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/equipments", formState);
      setEquipments([...equipments, data.equipment]);
      fetchEquipments();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
      console.log("Error creating equipment:", error);
    }
  };

  // EDITAR EQUIPAMIENTO
  const handleEditEquipment = async (id) => {
    const equipmentToEdit = equipments.find((equipment) => equipment._id === id);
    if (equipmentToEdit) {
      formState.description = equipmentToEdit.description;
      formState.typeOfEquipmentId = equipmentToEdit.typeOfEquipment._id;
      setEditEquipmentId(id);
      handleOpenModal();
    }
  };

  const updateEquipment = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(
        `/equipments/${editEquipmentId}`,
        formState
      );
      setEquipments(
        equipments.map((equipment) =>
          equipment._id === editEquipmentId ? data.equipment : equipment
        )
      );
      fetchEquipments();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR EQUIPAMIENTO
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación del equipamiento?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/equipments/${id}`);
        setEquipments(equipments.filter((equipment) => equipment._id !== id));
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
    setEditEquipmentId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    setIsModalOpen(false);
    formState.description = "";
    formState.typeOfEquipmentId = "";
  };

  const onSubmit = () => {
    if (editEquipmentId) {
      updateEquipment();
    } else {
      handleCreateEquipment();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    {
      field: "typeOfEquipment.name", // Esto debe cambiarse a:
      headerName: "Tipo de equipamiento",
      flex: 0.5,
      valueGetter: (params) => params.row.typeOfEquipment.name, // Utiliza valueGetter para acceder a propiedades anidadas
    },
    { field: "description", headerName: "Descripción", flex: 0.5 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEditEquipment(params.row._id)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Eliminar
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
        title="Equipamientos"
        subtitle="En esta sección podrá administrar los equipamientos del sistema."
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
            Listado de equipamientos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear equipamiento
          </Button>
        </FlexBetween>
        <DataGrid
          loading={!equipments}
          rows={equipments}
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
            {editEquipmentId ? "Editar ciudad" : "Crear nueva ciudad"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={!!typeOfEquipmentIdValid && formSubmitted}
              >
                <InputLabel>Tipo de equipamiento</InputLabel>
                <Select
                  name="typeOfEquipmentId"
                  value={typeOfEquipmentId}
                  onChange={onInputChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar tipo de equipamiento</em>
                  </MenuItem>
                  {typesOfEquipments.map((typeOfEquipment) => (
                    <MenuItem
                      key={typeOfEquipment._id}
                      value={typeOfEquipment._id}
                    >
                      {typeOfEquipment.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!typeOfEquipmentIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">
                      {typeOfEquipmentIdValid}
                    </Typography>
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción del equipamiento"
                name="description"
                value={description}
                onChange={onInputChange}
                fullWidth
                error={!!descriptionValid && formSubmitted}
                helperText={!!descriptionValid && formSubmitted ? descriptionValid : ""}
              />
            </Grid>
            <Grid item xs={12} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
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
              {editEquipmentId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
