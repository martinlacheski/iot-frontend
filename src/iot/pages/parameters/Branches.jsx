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
  organizationId: "",
  name: "",
  cityId: "",
  address: "",
  email: "",
  phone: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es obligatorio."],
  cityId: [(value) => value.trim() !== "", "La ciudad es obligatoria."],
  address: [(value) => value.trim() !== "", "La dirección es obligatoria."],
  email: [
    (value) => value.trim() !== "",
    "El correo electrónico es obligatorio.",
  ],
  phone: [(value) => value.trim() !== "", "El teléfono es obligatorio."],
};

export const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [cities, setCities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editBranchId, setEditBranchId] = useState(null);

  const {
    formState,
    name,
    nameValid,
    cityId,
    cityIdValid,
    address,
    addressValid,
    email,
    emailValid,
    phone,
    phoneValid,
    isFormValid,
    onInputChange,
    setFormState,
  } = useForm(formData, formValidations);

  const resetFormData = () => {
    formData.organizationId = "";
    formData.name = "";
    formData.cityId = "";
    formData.address = "";
    formData.email = "";
    formData.phone = "";
    setFormState(formData);
  };

  // OBTENER SEDES
  const fetchBranches = async () => {
    try {
      const { data } = await iotApi.get("/branches");
      setBranches(data.branches);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };

  // OBTENER CIUDADES
  const fetchCities = async () => {
    try {
      const { data } = await iotApi.get("/cities");
      setCities(data.cities);
    } catch (error) {
      console.log("Error fetching cities:", error);
    }
  };

  // OBTENER ORGANIZACION
  const fetchOrganization = async () => {
    try {
      const { data } = await iotApi.get("/organization");
      setOrganization(data.organization);
    } catch (error) {
      console.log("Error fetching organization:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchCities();
    fetchOrganization();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormSubmitted(false);
    resetFormData();
    setEditBranchId(null);
  };

  const createBranch = async () => {
    try {
      // Add organizationId to formState
      formState.organizationId = organization._id;
      const { data } = await iotApi.post("/branches", formState);
      showSuccessToast(data.msg);
      fetchBranches();
      handleCloseModal();
    } catch (error) {
      console.log("Error creating branch:", error);
      showErrorAlert(error.response.data.msg);
    }
  };

  const handleEditBranch = async (branchId) => {
    // Fill form with branch data
    const branch = branches.find((branch) => branch._id === branchId);
    if (!branch) return;
    setEditBranchId(branchId);
    formState.organizationId = branch.organization._id;
    formState.name = branch.name;
    formState.cityId = branch.city._id;
    formState.address = branch.address;
    formState.email = branch.email;
    formState.phone = branch.phone;
    handleOpenModal();
  };

  const deleteBranch = async (branchId) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación de la sede?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/branches/${branchId}`);
        showSuccessToast(data.msg);
        fetchBranches();
      }
    } catch (error) {
      console.log("Error deleting branch:", error);
      showErrorAlert(error.response.data.msg);
    }
  };

  const updateBranch = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.put(`/branches/${editBranchId}`, formState);
      showSuccessToast(data.msg);
      fetchBranches();
      handleCloseModal();
    } catch (error) {
      console.log("Error updating branch:", error);
      showErrorAlert(error.response.data.msg);
    }
  };

  const onSubmit = () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    if (editBranchId) {
      updateBranch();
    } else {
      createBranch();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200, hide: true },
    { field: "name", headerName: "Sede", minWidth: 200, flex: 1 },
    {
      field: "organization.name", // Esto debe cambiarse a:
      headerName: "Organización",
      minWidth: 180,
      valueGetter: (params) => params.row.organization.name, // Utiliza valueGetter para acceder a propiedades anidadas
    },
    {
      field: "city.name", // Esto debe cambiarse a:
      headerName: "Ciudad",
      minWidth: 180,
      valueGetter: (params) => params.row.city.name, // Utiliza valueGetter para acceder a propiedades anidadas
    },
    { field: "address", headerName: "Dirección", minWidth: 250 },
    { field: "phone", headerName: "Teléfono", minWidth: 200 },
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
            title="Editar sede"
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEditBranch(params.row._id)}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            title="Eliminar sede"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => deleteBranch(params.row._id)}
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
        title="Sedes"
        subtitle="En esta sección podrá administrar las sedes del sistema."
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
            Listado de sedes
          </Typography>
          <Button
            title="Crear sede"
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear sede
          </Button>
        </FlexBetween>
        <DataGrid
          // autoHeight
          maxHeight="60vh"
          loading={!branches}
          rows={branches}
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
            {editBranchId ? "Editar sede" : "Crear nueva sede"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la sede"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!cityIdValid && formSubmitted}>
                <InputLabel>Ciudad a la que pertenece</InputLabel>
                <Select name="cityId" value={cityId} onChange={onInputChange}>
                  <MenuItem value="">
                    <em>Seleccionar ciudad</em>
                  </MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!cityIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">{cityIdValid}</Typography>
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                name="address"
                value={address}
                onChange={onInputChange}
                fullWidth
                error={!!addressValid && formSubmitted}
                helperText={!!addressValid && formSubmitted ? addressValid : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                name="email"
                value={email}
                onChange={onInputChange}
                fullWidth
                error={!!emailValid && formSubmitted}
                helperText={!!emailValid && formSubmitted ? emailValid : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                name="phone"
                value={phone}
                onChange={onInputChange}
                fullWidth
                error={!!phoneValid && formSubmitted}
                helperText={!!phoneValid && formSubmitted ? phoneValid : ""}
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
              {editBranchId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
