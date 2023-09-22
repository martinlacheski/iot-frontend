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

const showLoadingAlert = (title, text, time) => {
  let timerInterval;
  Swal.fire({
    title: title,
    text: text,
    timer: time,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => { }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
    clearInterval(timerInterval);
  });
};

//   Exportamos
export { showSuccessToast, showErrorAlert, showConfirmationAlert, showLoadingAlert };
