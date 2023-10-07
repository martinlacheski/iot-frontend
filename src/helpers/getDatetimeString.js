// export const getDatetimeString = (date) => {
  
//   const year = date.getFullYear();
//   // const year = 0;
//   console.log('month', date.getMonth() + 1);
//   const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
//   const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
//   const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
//   const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
//   const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// };

export const getDatetimeString = (fecha) => {
  
  const fechaObj = new Date(fecha);
  const año = fechaObj.getFullYear();
  const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexed
  const dia = String(fechaObj.getDate()).padStart(2, '0');
  const horas = String(fechaObj.getHours()).padStart(2, '0');
  const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
  const segundos = String(fechaObj.getSeconds()).padStart(2, '0');
  
  const formato = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  return formato;
};
