import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Alert,
  useTheme,
} from "@mui/material";
import { AuthLayout } from "../layout/AuthLayout";
import { useAuthStore, useForm } from "../../hooks";

const formData = {
  email: "",
  password: "",
};

const formValidations = {
  email: [
    (value) => value.includes("@"),
    "Ingrese un correo electrónico válido.",
  ],
  password: [(value) => value.length >= 1, "La contraseña es obligatoria."],
};

export const LoginPage = () => {
  const { startLogin, errorMessage } = useAuthStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const {
    formState,
    email,
    password,
    onInputChange,
    isFormValid,
    emailValid,
    passwordValid,
  } = useForm(formData, formValidations);

  const onSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    startLogin({ email, password });
    console.log({ email, password });
  };

  useEffect(() => {
    if (errorMessage !== undefined) {
      setLocalErrorMessage(errorMessage);
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Iniciar sesión en EnviroSense">
      <form
        onSubmit={onSubmit}
        className="animate__animated animate__fadeIn animate__faster"
      >
        <Grid container>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <TextField
              label="Correo electrónico"
              type="text"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
              error={formSubmitted && !!emailValid}
            />
            <Grid
              item
              xs={12}
              sx={{ mt: 1 }}
              display={formSubmitted && !!emailValid ? "" : "none"}
            >
              <Alert severity="error" sx={{ px: 1 }}>
                <Typography variant="body2">{emailValid}</Typography>
              </Alert>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              onChange={onInputChange}
              error={formSubmitted && !!passwordValid}
            />
            <Grid
              item
              xs={12}
              sx={{ mt: 1 }}
              display={formSubmitted && !!passwordValid ? "" : "none"}
            >
              <Alert severity="error" sx={{ px: 1 }}>
                <Typography variant="body2">{passwordValid}</Typography>
              </Alert>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={12} display={!!localErrorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{localErrorMessage}</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={false}
                variant="contained"
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
