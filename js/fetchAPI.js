"use-stric";

// URL para consumir la API
const urlApi = "https://restcountries.com/v3.1";
// Obtener solo datos que necesitamos de la API
const datos = "fields=cca3,area,borders,capital,capitalInfo,currencies,independent,flags,languages,latlng,maps,name,population,region,subregion,translations";

/**
 * Función que consume la API y devuelve los datos obtenidos.
 * @param {string} filtro ("/all" , "/region/{region}", "/subregion/{subregion}")
 * @returns  
 */

export default function obtenerPaisesAPI(filtro) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: urlApi + filtro,
      data: datos,
      beforeSend: function () {},
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
      timeout: 2000, //ms
    });
  });
}
