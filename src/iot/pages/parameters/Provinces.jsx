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
  countryId: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio."],
  countryId: [(value) => value !== "", "Debe seleccionar un país."],
};

export const Provinces = () => {
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editProvinceId, setEditProvinceId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const {
    formState,
    name,
    countryId,
    onInputChange,
    nameValid,
    countryIdValid,
    isFormValid,
    onResetForm,
  } = useForm(formData, formValidations);

  // OBTENER PROVINCIAS
  const fetchProvinces = async () => {
    try {
      const { data } = await iotApi.get("/provinces");
      setProvinces(data.provinces);
    } catch (error) {
      console.log("Error fetching provinces:", error);
    }
  };

  // OBTENER PAÍSES
  const fetchCountries = async () => {
    try {
      const { data } = await iotApi.get("/countries");
      setCountries(data.countries);
    } catch (error) {
      console.log("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchCountries();
  }, []);

  // CREAR PROVINCIA
  const handleCreateProvince = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/provinces", formState);
      setProvinces([...provinces, data.province]);
      fetchProvinces();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // EDITAR PROVINCIA
  const handleEditProvince = async (id) => {
    const provinceToEdit = provinces.find((province) => province._id === id);
    if (provinceToEdit) {
      formState.name = provinceToEdit.name;
      formState.countryId = provinceToEdit.country._id;
      setEditProvinceId(id);
      handleOpenModal();
    }
  };

  const updateProvince = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(
        `/provinces/${editProvinceId}`,
        formState
      );
      setProvinces(
        provinces.map((province) =>
          province._id === editProvinceId ? data.province : province
        )
      );
      fetchProvinces();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR PROVINCIA
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación de la provincia?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/provinces/${id}`);
        setProvinces(provinces.filter((province) => province._id !== id));
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
    setEditProvinceId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    setIsModalOpen(false);
    formState.name = "";
    formState.countryId = "";
  };

  const onSubmit = () => {
    if (editProvinceId) {
      updateProvince();
    } else {
      handleCreateProvince();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Nombre", flex: 0.5 },
    {
      field: "country.name", // Esto debe cambiarse a:
      headerName: "País",
      flex: 0.5,
      valueGetter: (params) => params.row.country.name, // Utiliza valueGetter para acceder a propiedades anidadas
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
            onClick={() => handleEditProvince(params.row._id)}
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
        title="Provincias"
        subtitle="En esta sección podrá administrar las provincias del sistema."
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
            Listado de provincias
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear provincia
          </Button>
        </FlexBetween>
        <DataGrid
          loading={!provinces}
          rows={provinces}
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
            {editProvinceId ? "Editar provincia" : "Crear nueva provincia"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!countryIdValid && formSubmitted}>
                <InputLabel>País al que pertenece</InputLabel>
                <Select
                  name="countryId"
                  value={countryId}
                  onChange={onInputChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar país</em>
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!countryIdValid && formSubmitted && (
                  <Alert severity="error" sx={{mt: ".5rem"}}>
                    <Typography variant="body2">{countryIdValid}</Typography>
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la provincia"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
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
              {editProvinceId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
