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
  PasswordOutlined,
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
  email: "",
  password: "",
  roleId: "",
};

const formValidations = {
  name: [
    (value) => value.trim() !== "",
    "El nombre de usuario es obligatorio.",
  ],
  email: [
    (value) => value.trim() !== "",
    "El correo electrónico es obligatorio.",
  ],
  password: [(value) => value.trim() !== "", "La contraseña es obligatoria."],
  roleId: [(value) => value !== "", "Debe seleccionar un rol."],
};

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const {
    formState,
    name,
    email,
    password,
    roleId,
    nameValid,
    emailValid,
    passwordValid,
    roleIdValid,
    isFormValid,
    onInputChange,
  } = useForm(formData, formValidations);

  // OBTENER USUARIOS
  const fetchUsers = async () => {
    try {
      const { data } = await iotApi.get("/users");
      setUsers(data.users);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  // OBTENER ROLES
  const fetchRoles = async () => {
    try {
      const { data } = await iotApi.get("/roles");
      setRoles(data.roles);
    } catch (error) {
      console.log("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // CREAR PROVINCIA
  const handleCreateUser = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      const { data } = await iotApi.post("/users", formState);
      fetchUsers();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // EDITAR USUARIO
  const handleEditUser = async (id) => {
    const userToEdit = users.find((user) => user._id === id);
    if (userToEdit) {
      formState.name = userToEdit.name;
      formState.email = userToEdit.email;
      formState.password = userToEdit.password;
      formState.roleId = userToEdit.role._id;
      setEditUserId(id);
      setEditMode(true);
      handleOpenModal();
    }
  };

  const updateUser = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    console.log(editUserId);
    try {
      const { data } = await iotApi.put(`/users/${editUserId}`, formState);
      fetchUsers();
      handleCloseModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ELIMINAR USUARIO
  const handleDelete = async (id) => {
    try {
      const confirmation = await showConfirmationAlert(
        "¿Confirmas la eliminación del usuario?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await iotApi.delete(`/users/${id}`);
        fetchUsers();
        showSuccessToast(data.msg);
      }
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  // ACTUALIZAR CONTRASEÑA
  const handleUpdatePassword = async (id) => {
    const userToUpdatePassword = users.find((user) => user._id === id);
    if (userToUpdatePassword) {
      formState.password = "";
      setEditUserId(id);
      handleOpenPasswordModal();
    }
  };

  const updatePassword = async () => {
    setFormSubmitted(true);
    if (password.trim() === "") {
      setErrorMessage("La contraseña es obligatoria.");
      return;
    }

    try {
      const { data } = await iotApi.put(
        `/users/update-password/${editUserId}`,
        formState
      );

      handleClosePasswordModal();
      showSuccessToast(data.msg);
    } catch (error) {
      showErrorAlert(error.response.data?.msg);
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setFormSubmitted(false);
    setErrorMessage(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditUserId(null);
    setFormSubmitted(false);
    setErrorMessage(null);
    setIsModalOpen(false);
    setEditMode(false);
    formState.name = "";
    formState.email = "";
    formState.password = "";
    formState.roleId = "";
  };

  const onSubmit = () => {
    if (editUserId) {
      updateUser();
    } else {
      handleCreateUser();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 300, hide: true },
    { field: "name", headerName: "Nombre", minWidth: 300 },
    { field: "email", headerName: "Correo electrónico", minWidth: 300 },
    {
      field: "role.name", // Esto debe cambiarse a:
      headerName: "Rol",
      minWidth: 300,
      flex: 1,
      valueGetter: (params) => params.row.role.name,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 240,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button
            size="small"
            title="Editar usuario"
            variant="outlined"
            color="primary"
            onClick={() => handleEditUser(params.row._id)}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            size="small"
            title="Eliminar usuario"
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteOutlineOutlined />
          </Button>
          <Button
            size="small"
            title="Actualizar contraseña"
            variant="outlined"
            color="warning"
            onClick={() => handleUpdatePassword(params.row._id)}
          >
            <PasswordOutlined />
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
        title="Usuarios"
        subtitle="En esta sección podrá administrar los usuarios del sistema."
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
            Listado de usuarios
          </Typography>
          <Button
            title="Crear provincia"
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ p: ".3rem 1rem" }}
          >
            Crear usuario
          </Button>
        </FlexBetween>
        <DataGrid
          loading={!users}
          rows={users}
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
            {editUserId ? "Editar usuario" : "Crear nuevo usuario"}
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del usuario"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                autoComplete="off"
                error={!!nameValid && formSubmitted}
                helperText={!!nameValid && formSubmitted ? nameValid : ""}
              />
            </Grid>
            <Grid item xs={12} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                name="email"
                value={email}
                onChange={onInputChange}
                fullWidth
                autoComplete="off"
                error={!!emailValid && formSubmitted}
                helperText={!!emailValid && formSubmitted ? emailValid : ""}
              />
            </Grid>
            <Grid item xs={12} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} display={editMode ? "none" : ""}>
              <TextField
                label="Contraseña"
                type="password"
                name="password"
                value={password}
                onChange={onInputChange}
                fullWidth
                autoComplete="off"
                error={!!passwordValid && formSubmitted}
                helperText={
                  !!passwordValid && formSubmitted ? passwordValid : ""
                }
              />
            </Grid>
            <Grid item xs={12} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!roleIdValid && formSubmitted}>
                <InputLabel>Rol</InputLabel>
                <Select name="roleId" value={roleId} onChange={onInputChange}>
                  <MenuItem value="">
                    <em>Seleccionar rol</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!roleIdValid && formSubmitted && (
                  <Alert severity="error" sx={{ mt: ".5rem" }}>
                    <Typography variant="body2">{roleIdValid}</Typography>
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
              {editUserId ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={isPasswordModalOpen} onClose={handleClosePasswordModal}>
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
            Actualizar contraseña
          </Typography>
          <Divider sx={{ mb: "1rem" }} />

          <Grid container gap={1}>
            <Grid item xs={12}>
              <TextField
                label="Nueva contraseña"
                type="password"
                name="password"
                value={password}
                onChange={onInputChange}
                fullWidth
                autoComplete="off"
                error={!!passwordValid && formSubmitted}
                helperText={
                  !!passwordValid && formSubmitted ? passwordValid : ""
                }
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
              onClick={handleClosePasswordModal}
              style={{ marginTop: "1rem", marginRight: ".5rem" }}
            >
              Cancelar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={updatePassword}
              style={{ marginTop: "1rem" }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};
