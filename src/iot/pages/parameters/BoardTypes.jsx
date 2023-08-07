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

export const BoardTypes = () => {
  const [boardTypes, setBoardTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editBoardTypeId, setEditBoardTypeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    formState,
    name,
    specs,
    onInputChange,
    isFormValid,
    nameValid,
    specsValid,
    onResetForm,
  } = useForm(formData, formValidations);

  useEffect(() => {
    fetchBoardTypes();
  }, []);

  // OBTENER TIPOS DE PLACAS
  const fetchBoardTypes = async () => {
    try {
      const { data } = await iotApi.get("/types-of-boards");
      setBoardTypes(data.typeOfBoards);
    } catch (error) {
      console.log("Error fetching typeOfBoards:", error);
    }
  };

  // CREAR TIPO DE PLACA
  const handleCreateBoardType = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/types-of-boards", formState);
      setBoardTypes([...boardTypes, data.typeOfBoard]);
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // EDITAR TIPO DE PLACA
  const handleEditBoardType = async (id) => {
    const boardTypeToEdit = boardTypes.find((type) => type._id === id);
    if (boardTypeToEdit) {
      formState.name = boardTypeToEdit.name;
      formState.specs = boardTypeToEdit.specs;
      setEditBoardTypeId(id);
      handleOpenModal();
    }
  };

  const updateTypeOfBoard = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(
        `/types-of-boards/${editBoardTypeId}`,
        formState
      );
      setBoardTypes(
        boardTypes.map((type) =>
          type._id === editBoardTypeId ? data.typeOfBoard : type
        )
      );
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR TIPO DE PLACA
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación del tipo de placa?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/types-of-boards/${id}`);
        setBoardTypes(boardTypes.filter((type) => type._id !== id));
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
    setEditBoardTypeId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    formState.name = "";
    formState.specs = "";
  };

  const onSubmit = () => {
    if (editBoardTypeId) {
      updateTypeOfBoard();
    } else {
      handleCreateBoardType();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Nombre", flex: 0.5 },
    { field: "specs", headerName: "Especificaciones", flex: 1 },
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
            onClick={() => handleEditBoardType(params.row._id)}
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
        title="Tipos de placas"
        subtitle="En esta sección podrá administrar los tipos de placas del sistema."
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
            Listado de tipos de placas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear tipo de placa
          </Button>
        </FlexBetween>
        <DataGrid
          loading={!boardTypes}
          rows={boardTypes}
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
            {editBoardTypeId
              ? "Editar tipo de placa"
              : "Crear nuevo tipo de placa"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del tipo de placa"
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
              {editBoardTypeId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
