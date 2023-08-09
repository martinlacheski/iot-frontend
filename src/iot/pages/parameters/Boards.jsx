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
  typeOfBoardId: "",
  environmentId: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio"],
  typeOfBoardId: [
    (value) => value.trim() !== "",
    "El tipo de placa es obligatorio",
  ],
  environmentId: [(value) => value.trim() !== "", "El ambiente es obligatorio"],
};

export const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [boardTypes, setBoardTypes] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editBoardId, setEditBoardId] = useState(null);

  const {
    formState,
    name,
    nameValid,
    typeOfBoardId,
    typeOfBoardIdValid,
    environmentId,
    environmentIdValid,
    onInputChange,
    isFormValid,
    setFormState,
  } = useForm(formData, formValidations);

  // Obtener placas
  const fetchBoards = async () => {
    try {
      const { data } = await iotApi.get("/boards");
      setBoards(data.boards);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener tipos de placas
  const fetchBoardTypes = async () => {
    try {
      const { data } = await iotApi.get("/types-of-boards");
      setBoardTypes(data.typeOfBoards);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener ambientes
  const fetchEnvironments = async () => {
    try {
      const { data } = await iotApi.get("/environments");
      setEnvironments(data.environments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.all([fetchBoards(), fetchBoardTypes(), fetchEnvironments()]);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditBoardId(null);
    setFormSubmitted(false);
    setFormState(formData);
  };

  const handleCreateBoard = async () => {
    try {
      const { data } = await iotApi.post("/boards", formState);
      showSuccessToast(data.msg);
      fetchBoards();
      handleCloseModal();
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const handleEditBoard = (boardId) => {
    const board = boards.find((board) => board._id === boardId);
    if (!board) return;
    setEditBoardId(boardId);
    setFormState({
      name: board.name,
      typeOfBoardId: board.typeOfBoard._id,
      environmentId: board.environment._id,
    });
    handleOpenModal();
  };

  const updateBoard = async () => {
    try {
      const { data } = await iotApi.put(`/boards/${editBoardId}`, formState);
      showSuccessToast(data.msg);
      fetchBoards();
      handleCloseModal();
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      const board = boards.find((board) => board._id === boardId);
      if (!board) return;
      const confirmation = await showConfirmationAlert(
        "¿Está seguro que desea eliminar esta placa?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await iotApi.delete(`/boards/${boardId}`);
      showSuccessToast(data.msg);
      fetchBoards();
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const onSubmit = () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    if (editBoardId) {
      updateBoard();
    } else {
      handleCreateBoard();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200, hide: true },
    { field: "name", headerName: "Nombre", minWidth: 250, flex: 0.5 },
    {
      field: "typeOfBoard.name",
      headerName: "Tipo de placa",
      minWidth: 250,
      flex: 0.5,
      valueGetter: (params) => params.row.typeOfBoard.name,
    },
    {
      field: "environment.name",
      headerName: "Ambiente",
      minWidth: 250,
      flex: 0.5,
      valueGetter: (params) => params.row.environment.name,
    },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 160,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button
            title="Editar placa"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEditBoard(params.row._id)}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            title="Eliminar placa"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => handleDeleteBoard(params.row._id)}
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
        title="Placas"
        subtitle="En esta sección podrá administrar las placas del sistema."
      />

      {/* CUERPO DE LA PÁGINA */}
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
            Listado de placas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear placa
          </Button>
        </FlexBetween>
        <DataGrid
          // autoHeight
          maxHeight="60vh"
          loading={!boards}
          rows={boards}
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
            {editBoardId ? "Editar placa" : "Crear nueva placa"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la placa"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={!!typeOfBoardIdValid && formSubmitted}
              >
                <InputLabel>Tipo de placa</InputLabel>
                <Select
                  name="typeOfBoardId"
                  value={typeOfBoardId}
                  onChange={onInputChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar placa</em>
                  </MenuItem>
                  {boardTypes.map((typeOfBoard) => (
                    <MenuItem key={typeOfBoard._id} value={typeOfBoard._id}>
                      {typeOfBoard.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!typeOfBoardIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">
                      {typeOfBoardIdValid}
                    </Typography>
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={!!environmentIdValid && formSubmitted}
              >
                <InputLabel>Ambiente donde se encuentra</InputLabel>
                <Select
                  name="environmentId"
                  value={environmentId}
                  onChange={onInputChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar ambiente</em>
                  </MenuItem>
                  {environments.map((environment) => (
                    <MenuItem key={environment._id} value={environment._id}>
                      {environment.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!environmentIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">
                      {environmentIdValid}
                    </Typography>
                  </Alert>
                )}
              </FormControl>
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
              {editBoardId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
