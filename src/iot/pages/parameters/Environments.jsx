import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import iotApi from "../../../api/iotApi";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Divider,
  Modal,
  Grid,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import { FlexBetween } from "../../components/FlexBetween";
import {
  showSuccessToast,
  showErrorAlert,
  showConfirmationAlert,
} from "../../../utils";
import { useNavigate } from "react-router-dom";

export const Environments = () => {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    typeOfEnvironment: "",
    branch: "",
    floor: "",
    room: "",
    capacity: "",
    surface: "",
    equipments: [],
    observations: "",
  });

  const fetchEnvironments = async () => {
    try {
      const { data } = await iotApi.get("/environments");
      setEnvironments(data.environments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const showDetails = (id) => {
    handleOpenModal();
    const environment = environments.find((env) => env._id === id);
    setFormValues(environment);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({
      name: "",
      typeOfEnvironment: "",
      branch: "",
      floor: "",
      room: "",
      capacity: "",
      surface: "",
      equipments: [],
      observations: "",
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Está seguro que desea eliminar el ambiente?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/environments/${id}`);
        showSuccessToast(data.msg);
        fetchEnvironments();
      }
    } catch (error) {
      showErrorAlert("Error al eliminar el ambiente");
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Ambiente", width: 220 },
    {
      field: "typeOfEnvironment.name",
      headerName: "Tipo",
      width: 100,
      valueGetter: (params) => params.row.typeOfEnvironment.name,
    },
    {
      field: "branch.name",
      headerName: "Sede",
      width: 180,
      valueGetter: (params) => params.row.branch.name,
    },
    {
      field: "floor",
      headerName: "Piso",
      width: 75,
    },
    {
      field: "room",
      headerName: "Salón",
      width: 75,
    },
    {
      field: "capacity",
      headerName: "Capacidad",
      width: 120,
      renderCell: (params) => (
        <Box>
          {params.row.capacity ? params.row.capacity + " personas" : ""}{" "}
        </Box>
      ),
    },
    {
      field: "surface",
      headerName: "Superficie",
      width: 100,
      renderCell: (params) => (
        <Box>{params.row.surface ? params.row.surface + " m²" : ""}</Box>
      ),
    },
    {
      field: "equipments",
      headerName: "Equipamiento",
      width: 150,
      renderCell: (params) => (
        <Box>
          {params.row.equipments.length > 0
            ? params.row.equipments.length + " items"
            : ""}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button variant="outlined" color="primary" onClick={() => {}}>
            Editar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Eliminar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => showDetails(params.row._id)}
          >
            Ver
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
        title="Ambientes"
        subtitle="En esta sección podrá administrar los distintos ambientes del sistema."
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
            Listado de ambientes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/parameters/environments/create")}
          >
            Crear AMBIENTE
          </Button>
        </FlexBetween>
        <DataGrid
          // autoHeight
          maxHeight="60vh"
          loading={!environments}
          rows={environments}
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
            maxWidth: 800,
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
            Detalles del ambiente
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={2}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Nombre: </Typography>
                <Typography>{formValues.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Tipo:</Typography>
                <Typography>{formValues.typeOfEnvironment.name}</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Sede:</Typography>
                <Typography>{formValues.branch.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Piso:</Typography>
                <Typography>{formValues.floor}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Salón:</Typography>
                <Typography>{formValues.room}</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Capacidad: </Typography>
                <Typography>{formValues.capacity} personas</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Superficie:{" "}
                </Typography>
                <Typography>
                  {formValues.surface} m<sup>2</sup>
                </Typography>
              </Box>
            </Grid>
            <Typography sx={{ fontWeight: "bold" }}>Equipamiento: </Typography>
            <Grid item xs={12} gap={1}>
              <List dense sx={{ maxHeight: 200, overflow: "auto", p: 0 }}>
                {formValues.equipments.map((item) => (
                  <ListItem key={item._id}>
                    <Typography>
                      ({item.quantity}) {item.equipment.typeOfEquipment.name} -{" "}
                      {item.equipment.description}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: "bold" }}>
                Observaciones:{" "}
              </Typography>
              <Typography>{formValues.observations}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ float: "right" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
              style={{ marginTop: "1rem", marginRight: ".5rem" }}
            >
              Listo
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
