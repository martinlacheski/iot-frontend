export const getLocaleDatetimeString = (fecha) => {
  
  const fechaObj = new Date(fecha);
  const año = fechaObj.getFullYear();
  const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexed
  const dia = String(fechaObj.getDate()).padStart(2, '0');
  const horas = String(fechaObj.getHours()).padStart(2, '0');
  const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
  const segundos = String(fechaObj.getSeconds()).padStart(2, '0');
  
  const formato = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
  return formato;
};
