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
  name: "",
  postalCode: "",
  provinceId: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio."],
  postalCode: [(value) => value.trim() !== "", "El código postal es obligatorio."],
  provinceId: [(value) => value !== "", "Debe seleccionar una provincia."],
};

export const Cities = () => {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editCityId, setEditCityId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    formState,
    name,
    postalCode,
    provinceId,
    onInputChange,
    nameValid,
    postalCodeValid,
    provinceIdValid,
    isFormValid,
    onResetForm,
  } = useForm(formData, formValidations);

  // OBTENER CIUDADES
  const fetchCities = async () => {
    try {
      const { data } = await iotApi.get("/cities");
      setCities(data.cities);
    } catch (error) {
      console.log("Error fetching cities:", error);
    }
  };

  // OBTENER PROVINCIAS
  const fetchProvinces = async () => {
    try {
      const { data } = await iotApi.get("/provinces");
      setProvinces(data.provinces);
    } catch (error) {
      console.log("Error fetching provinces:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchProvinces();
  }, []);

  // CREAR CIUDAD
  const handleCreateCity = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/cities", formState);
      setCities([...cities, data.city]);
      fetchCities();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
      console.log("Error creating province:", error);
    }
  };

  // EDITAR CIUDAD
  const handleEditCity = async (id) => {
    const cityToEdit = cities.find((city) => city._id === id);
    if (cityToEdit) {
      formState.name = cityToEdit.name;
      formState.postalCode = cityToEdit.postalCode;
      formState.provinceId = cityToEdit.province._id;
      setEditCityId(id);
      handleOpenModal();
    }
  };

  const updateCity = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(
        `/cities/${editCityId}`,
        formState
      );
      setCities(
        cities.map((city) =>
          city._id === editCityId ? data.city : city
        )
      );
      fetchCities();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR CIUDAD
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación de la ciudad?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/cities/${id}`);
        setCities(cities.filter((city) => city._id !== id));
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
    setEditCityId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    setIsModalOpen(false);
    formState.name = "";
    formState.postalCode = "";
    formState.provinceId = "";
  };

  const onSubmit = () => {
    if (editCityId) {
      updateCity();
    } else {
      handleCreateCity();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Ciudad", flex: 0.5 },
    { field: "postalCode", headerName: "Código postal", flex: 0.5 },
    {
      field: "province.name", // Esto debe cambiarse a:
      headerName: "Provincia",
      flex: 0.5,
      valueGetter: (params) => params.row.province.name, // Utiliza valueGetter para acceder a propiedades anidadas
    },
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
            onClick={() => handleEditCity(params.row._id)}
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
        title="Ciudades"
        subtitle="En esta sección podrá administrar las ciudades del sistema."
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
            Listado de ciudades
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear ciudad
          </Button>
        </FlexBetween>
        <DataGrid
          loading={!cities}
          rows={cities}
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
            {editCityId ? "Editar ciudad" : "Crear nueva ciudad"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!provinceIdValid && formSubmitted}>
                <InputLabel>Provincia a la que pertenece</InputLabel>
                <Select
                  name="provinceId"
                  value={provinceId}
                  onChange={onInputChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar provincia</em>
                  </MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province._id} value={province._id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!provinceIdValid && formSubmitted && (
                  <Alert severity="error" sx={{mt: ".5rem"}}>
                    <Typography variant="body2">{provinceIdValid}</Typography>
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la ciudad"
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
                label="Código postal"
                name="postalCode"
                value={postalCode}
                onChange={onInputChange}
                fullWidth
                error={!!postalCodeValid && formSubmitted}
                helperText={!!postalCodeValid && formSubmitted ? postalCodeValid : ""}
              />
            </Grid>
            <Grid item xs={12} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
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
              {editCityId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
