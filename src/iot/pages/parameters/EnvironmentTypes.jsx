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
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio."],
};

export const EnvironmentTypes = () => {
  const [environmentTypes, setEnvironmentTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editEnvironmentTypeId, setEditEnvironmentTypeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    formState,
    name,
    onInputChange,
    isFormValid,
    nameValid,
    onResetForm,
  } = useForm(formData, formValidations);

  useEffect(() => {
    fetchEnvironmentTypes();
  }, []);

  // OBTENER TIPOS DE AMBIENTE
  const fetchEnvironmentTypes = async () => {
    try {
      const { data } = await iotApi.get("/types-of-environments");
      setEnvironmentTypes(data.typeOfEnvironments);
    } catch (error) {
      console.log("Error fetching typeOfEnvironments:", error);
    }
  };

  // CREAR TIPO DE AMBIENTE
  const handleCreateEnvironmentType = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/types-of-environments", formState);
      setEnvironmentTypes([...environmentTypes, data.typeOfEnvironment]);
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // EDITAR TIPO DE AMBIENTE
  const handleEditEnvironmentType = async (id) => {
    const environmentTypeToEdit = environmentTypes.find((type) => type._id === id);
    if (environmentTypeToEdit) {
      onInputChange({
        target: {
          name: "name",
          value: environmentTypeToEdit.name,
        },
      });
      setEditEnvironmentTypeId(id);
      handleOpenModal();
    }
  };

  const updateEnvironmentType = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(
        `/types-of-environments/${editEnvironmentTypeId}`,
        formState
      );
      setEnvironmentTypes(
        environmentTypes.map((type) =>
          type._id === editEnvironmentTypeId ? data.typeOfEnvironment : type
        )
      );
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR TIPO DE AMBIENTE
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación del tipo de ambiente?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/types-of-environments/${id}`);
        setEnvironmentTypes(environmentTypes.filter((type) => type._id !== id));
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
    setEditEnvironmentTypeId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    formState.name = "";
  };

  const onSubmit = () => {
    if (editEnvironmentTypeId) {
      updateEnvironmentType();
    } else {
      handleCreateEnvironmentType();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200, hide: true },
    { field: "name", headerName: "Nombre", minWidth: 200, flex: 1 },
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
            title="Editar tipo de ambiente"
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEditEnvironmentType(params.row._id)}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            title="Eliminar tipo de ambiente"
            size="small"
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
        title="Tipos de ambientes"
        subtitle="En esta sección podrá administrar los tipos de ambientes del sistema."
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
            Listado de tipos de ambientes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear tipo de ambiente
          </Button>
        </FlexBetween>
        <DataGrid
          loading={!environmentTypes}
          rows={environmentTypes}
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
            {editEnvironmentTypeId ? "Editar tipo de ambiente" : "Crear nuevo tipo de ambiente"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del tipo de ambiente"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
              />
            </Grid>
          </Grid>
         <Box sx={{float: "right"}}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
              style={{ marginTop: "1rem", marginRight: ".5rem"}}
            >
              Cancelar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={onSubmit}
              style={{ marginTop: "1rem"}}
              disabled={!isFormValid}
            >
              {editEnvironmentTypeId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
