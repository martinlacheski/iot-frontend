import React, { Fragment, useState, useEffect } from "react";
import { Header } from "../../components/Header";
import iotApi from "../../../api/iotApi";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useForm } from "../../../hooks/useForm";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { getEnvVariables } from "../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();

const formData = {
  id: "",
  name: "",
  address: "",
  cityId: "",
  email: "",
  phone: "",
  webpage: "",
  logo: "",
};

const formValidations = {
  name: [(value) => value.trim() !== "", "El nombre es requerido"],
  address: [(value) => value.trim() !== "", "La dirección es requerida"],
  cityId: [(value) => value.trim() !== "", "La ciudad es requerida"],
  email: [(value) => value.trim() !== "", "El correo electrónico es requerido"],
  phone: [(value) => value.trim() !== "", "El teléfono es requerido"],
  webpage: [(value) => value.trim() !== "", "La página web es requerida"],
  logo: [(value) => value.trim() !== "", "El logo es requerido"],
};

export const Organization = () => {
  const [cities, setCities] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(null); //
  const [file, setFile] = useState(null);

  const {
    formState,
    name,
    address,
    cityId,
    email,
    phone,
    webpage,
    logo,
    nameValid,
    addressValid,
    cityIdValid,
    emailValid,
    phoneValid,
    webpageValid,
    logoValid,
    isFormValid,
    onInputChange,
    setFormState,
  } = useForm(formData, formValidations);

  const getCities = async () => {
    const { data } = await iotApi.get("/cities");
    setCities(data.cities);
  };

  const getOrganization = async () => {
    const { data } = await iotApi.get("/organization");
    setFormState({
      ...formState,
      id: data.organization._id,
      name: data.organization.name,
      address: data.organization.address,
      cityId: data.organization.city._id,
      email: data.organization.email,
      phone: data.organization.phone,
      webpage: data.organization.webpage,
      logo: data.organization.logo,
    });
    setCurrentLogo(data.organization.logo);
    setFile(null);
  };

  useEffect(() => {
    getCities();
    getOrganization();
  }, []);

  const onSubmit = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    try {
      let updatedLogo = logo;
      if (file) {
        const formData = new FormData();
        formData.append("logo", file);
        const { data } = await iotApi.post(`/organization/upload`, formData);
        updatedLogo = data.fileName;
      }

      formState.logo = updatedLogo;

      const { data } = await iotApi.put(
        `/organization/${formState.id}`,
        formState
      );

      showSuccessToast(data.msg);
      getOrganization();
    } catch (error) {
      showErrorAlert(error.response?.data?.msg);
    }
  };

  return (
    <Fragment>
      <Header
        title="Organización"
        subtitle="En esta sección podrá administrar la información de la organización."
      />

      <Box m={3} width={{ xs: "90vw", lg: "60vw" }} mx="auto">
        <Typography sx={{ mb: "1rem", fontWeight: "bold" }}>
          Información de la organización
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              value={name}
              onChange={onInputChange}
              label="Nombre de la organización"
              fullWidth
              autoComplete="off"
              error={!!nameValid && formSubmitted}
              helperText={!!nameValid && formSubmitted ? nameValid : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="address"
              name="address"
              value={address}
              onChange={onInputChange}
              label="Dirección"
              fullWidth
              autoComplete="off"
              error={!!addressValid && formSubmitted}
              helperText={!!addressValid && formSubmitted ? addressValid : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Ciudad a la que pertenece</InputLabel>
              <Select
                name="cityId"
                placeholder="Seleccionar país"
                value={cityId}
                onChange={onInputChange}
                error={!!cityIdValid && formSubmitted}
              >
                <MenuItem value="">
                  <em>Seleccionar ciudad</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {!!cityIdValid && formSubmitted ? cityIdValid : ""}
              </Typography>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="email"
              name="email"
              label="Correo electrónico"
              value={email}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              error={!!emailValid && formSubmitted}
              helperText={!!emailValid && formSubmitted ? emailValid : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="phone"
              name="phone"
              label="Teléfono"
              value={phone}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              error={!!phoneValid && formSubmitted}
              helperText={!!phoneValid && formSubmitted ? phoneValid : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="webpage"
              name="webpage"
              label="Página web"
              value={webpage}
              onChange={onInputChange}
              fullWidth
              autoComplete="off"
              error={!!webpageValid && formSubmitted}
              helperText={!!webpageValid && formSubmitted ? webpageValid : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="logo"
              name="logo"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              fullWidth
              autoComplete="off"
              error={!!logoValid && formSubmitted}
              helperText={!!logoValid && formSubmitted ? logoValid : ""}
            />
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={12} sm={3} sx={{ mb: "1rem" }}>
              <Typography sx={{ mb: "1rem", fontWeight: "bold" }}>
                Logo actual
              </Typography>
              {currentLogo != "" ? (
                <Box>
                  <img
                    src={`${VITE_BACKEND_URL}/${currentLogo}`}
                    alt={currentLogo}
                    width="250px"
                  />
                </Box>
              ) : (
                <Typography sx={{ mb: "1rem", fontWeight: "bold" }}>
                  No hay logo actual
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography sx={{ mb: "1rem", fontWeight: "bold" }}>
                Nuevo logo
              </Typography>
              {file ? (
                <Box>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Nuevo logo"
                    width="250px"
                  />
                </Box>
              ) : (
                <Typography sx={{ mb: "1rem" }}>
                  No se ha agregado un nuevo logo
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Box mt={3} textAlign="end">
          <Button
            variant="contained"
            color="primary"
            disabled={!isFormValid}
            onClick={onSubmit}
          >
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
