import Swal from "sweetalert2";

const showSuccessToast = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: message,
  });
};

const showErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    customClass: {
      container: "my-sweetalert-container",
    },
    confirmButtonColor: "#334155",
  });
};

const showConfirmationAlert = (text) => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#334155",
    confirmButtonText: 'Confirmar',
    cancelButtonColor: '#dc2626',
    cancelButtonText: 'Cancelar'
  });
};

//   Exportamos
export { showSuccessToast, showErrorAlert, showConfirmationAlert };
