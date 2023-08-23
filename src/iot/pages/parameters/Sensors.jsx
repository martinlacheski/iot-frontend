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
  minutesToStored: "",
  typeOfSensorId: "",
  boardId: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio"],
  minutesToStored: [
    (value) => parseInt(value) > 0,
    "El intervalo de almacenado debe ser mayor a 0",
  ],
  typeOfSensorId: [
    (value) => value.trim() !== "",
    "El tipo de sensor es obligatorio",
  ],
  boardId: [(value) => value.trim() !== "", "La placa es obligatoria"],
};

export const Sensors = () => {
  const [sensors, setSensors] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editSensorId, setEditSensorId] = useState(null);

  const {
    formState,
    name,
    nameValid,
    minutesToStored,
    minutesToStoredValid,
    typeOfSensorId,
    typeOfSensorIdValid,
    boardId,
    boardIdValid,
    onInputChange,
    isFormValid,
    setFormState,
  } = useForm(formData, formValidations);

  // Obtener sensores
  const fetchSensors = async () => {
    try {
      const { data } = await iotApi.get("/sensors");
      setSensors(data.sensors);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener tipos de sensores
  const fetchSensorTypes = async () => {
    try {
      const { data } = await iotApi.get("/types-of-sensors");
      setSensorTypes(data.typesOfSensor);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener placas
  const fetchBoards = async () => {
    try {
      const { data } = await iotApi.get("/boards");
      setBoards(data.boards);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.all([fetchSensors(), fetchSensorTypes(), fetchBoards()]);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditSensorId(null);
    setFormSubmitted(false);
    setFormState(formData);
  };

  const handleCreateSensor = async () => {
    try {
      const { data } = await iotApi.post("/sensors", formState);
      showSuccessToast(data.msg);
      fetchSensors();
      handleCloseModal();
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const handleEditSensor = (sensorId) => {
    const sensor = sensors.find((sensor) => sensor._id === sensorId);
    if (!sensor) return;
    setEditSensorId(sensorId);
    setFormState({
      name: sensor.name,
      minutesToStored: sensor.minutesToStored,
      typeOfSensorId: sensor.typeOfSensor._id,
      boardId: sensor.board._id,
    });
    handleOpenModal();
  };

  const updateSensor = async () => {
    try {
      const { data } = await iotApi.put(`/sensors/${editSensorId}`, formState);
      showSuccessToast(data.msg);
      fetchSensors();
      handleCloseModal();
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const handleDeleteSensor = async (sensorId) => {
    try {
      const sensor = sensors.find((sensor) => sensor._id === sensorId);
      if (!sensor) return;
      const confirmation = await showConfirmationAlert(
        "¿Está seguro que desea eliminar este sensor?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await iotApi.delete(`/sensors/${sensorId}`);
      showSuccessToast(data.msg);
      fetchSensors();
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const onSubmit = () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    if (editSensorId) {
      updateSensor();
    } else {
      handleCreateSensor();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200, hide: true },
    { field: "name", headerName: "Nombre", minWidth: 200, flex: 0.6 },
    {
      field: "minutesToStored",
      headerName: "Intervalo de almacenado",
      minWidth: 100,
      flex: 0.4,
      valueGetter: (params) => params.row.minutesToStored + " minutos",
    },
    {
      field: "typeOfSensor.name",
      headerName: "Tipo de sensor",
      minWidth: 250,
      flex: 0.5,
      valueGetter: (params) => params.row.typeOfSensor.name,
    },
    {
      field: "board.name",
      headerName: "Placa",
      minWidth: 250,
      flex: 0.5,
      valueGetter: (params) => params.row.board.name,
    },
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
            title="Editar sensor"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEditSensor(params.row._id)}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            title="Eliminar sensor"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => handleDeleteSensor(params.row._id)}
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
        title="Sensores"
        subtitle="En esta sección podrá administrar los sensores del sistema."
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
            Listado de sensores
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear sensor
          </Button>
        </FlexBetween>
        <DataGrid
          // autoHeight
          maxHeight="100vh"
          loading={!sensors}
          rows={sensors}
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
            {editSensorId ? "Editar sensor" : "Crear nuevo sensor"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del sensor"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Intervalo de almacenado en minutos (default: 5)"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                name="minutesToStored"
                value={minutesToStored}
                onChange={onInputChange}
                fullWidth
                error={!!minutesToStoredValid && formSubmitted}
                helperText={
                  !!minutesToStoredValid && formSubmitted
                    ? minutesToStoredValid
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={!!typeOfSensorIdValid && formSubmitted}
              >
                <InputLabel>Tipo de sensor</InputLabel>
                <Select
                  name="typeOfSensorId"
                  value={typeOfSensorId}
                  onChange={onInputChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar sensor</em>
                  </MenuItem>
                  {sensorTypes.map((typeOfSensor) => (
                    <MenuItem key={typeOfSensor._id} value={typeOfSensor._id}>
                      {typeOfSensor.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!typeOfSensorIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">
                      {typeOfSensorIdValid}
                    </Typography>
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!boardIdValid && formSubmitted}>
                <InputLabel>Placa asociada</InputLabel>
                <Select name="boardId" value={boardId} onChange={onInputChange}>
                  <MenuItem value="">
                    <em>Seleccionar placa</em>
                  </MenuItem>
                  {boards.map((board) => (
                    <MenuItem key={board._id} value={board._id}>
                      {board.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!boardIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">{boardIdValid}</Typography>
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
              {editSensorId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
