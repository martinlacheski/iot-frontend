import { useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { AuthLayout } from "../layout/AuthLayout";
import { useForm } from "../../hooks";

const formData = {
  email: "",
  password: "",
};

export const LoginPage = () => {
  const { email, password, onInputChange } = useForm(formData);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AuthLayout title="Iniciar sesión">
      <form
        onSubmit={onSubmit}
        className="animate__animated animate__fadeIn animate__faster"
      >
        <Grid container>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <TextField
              label="Correo electrónico"
              type="email"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
            />
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
            />
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            {/* <Grid item xs={12} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
            </Grid> */}
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

          <Grid container direction="row" justifyContent="end">
            <Typography sx={{ mr: 1 }}>¿No tienes una cuenta?</Typography>
            <Link component={RouterLink} color="inherit" to="/auth/register">
              Regístrate
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};