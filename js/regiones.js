"use-stric";

/**
 * Función que recibe un nombre de región o subregión
 * y devuelve un string con su traducción
 * @param {string} nombre - El nombre de una región o subregión
 * @returns 
 */
export function traduccion(nombre) {

  // recorremos todas las regiones
  for (let i = 0; i < regiones.length; i++) {
    const region = regiones[i];
    
    // si "nombre" es una región nos devolvera su traducción
    if (region.name === nombre) {
      return region.translation;
    } else { // entonces será una subregión...

      // con find buscamos una coincidencia de subregion
      const subregionEncontrada = region.subregions.find(subregion => subregion.name === nombre);
      
      // si la coincidencia se dá, devuelve la traducción de la subregión
      if (subregionEncontrada) {
        return subregionEncontrada.translation;
      } 
    }
  }
}

/**
 * Función que dada una subregión, devuelve el nombre de la región
 * a la que pertenece
 * @param {string} nombreSubregion - Una subregión
 * @returns 
 */
export function buscarRegion(nombreSubregion) {
  for (let region of regiones) {
    let subregionMatch = region.subregions.find(subregion => subregion.name === nombreSubregion)
  
    if (subregionMatch) {
      return region.name;
    }
  }
}

/**
 * LISTA CON LAS REGIONES Y SUBREGIONES TRADUCIDAS
 */
const regiones = [
  {
    name: "Africa",
    translation: "África",
    subregions: [
      { name: "Northern Africa", translation: "África septentrional" },
      { name: "Eastern Africa", translation: "África oriental" },
      { name: "Middle Africa", translation: "África central" },
      { name: "Southern Africa", translation: "África meridional" },
      { name: "Western Africa", translation: "África occidental" },
    ],
  },
  {
    name: "Americas",
    translation: "América",
    subregions: [
      { name: "Caribbean", translation: "El Caribe" },
      { name: "Central America", translation: "América central" },
      { name: "South America", translation: "América del sur" },
      { name: "North America", translation: "América del norte" },
    ],
  },
  {
    name: "Antarctic",
    translation: "Antártida",
    subregions: [],
  },
  {
    name: "Asia",
    translation: "Asia",
    subregions: [
      { name: "Central Asia", translation: "Asia central" },
      { name: "Eastern Asia", translation: "Asia oriental" },
      { name: "South-Eastern Asia", translation: "Asia sudoriental" },
      { name: "Southern Asia", translation: "Asia meridional" },
      { name: "Western Asia", translation: "Asia occidental" },
    ],
  },
  {
    name: "Europe",
    translation: "Europa",
    subregions: [
      { name: "Eastern Europe", translation: "Europa oriental" },
      { name: "Northern Europe", translation: "Europa septentrional" },
      { name: "Southern Europe", translation: "Europa meridional" },
      { name: "Western Europe", translation: "Europa occidental" },
      { name: "Central Europe", translation: "Europa central"},
      { name: "Southeast Europe", translation: "Europa sureste "} 
    ],
  },
  {
    name: "Oceania",
    translation: "Oceanía",
    subregions: [
      {
        name: "Australia and New Zealand",
        translation: "Australia y Nueva Zelanda",
      },
      { name: "Melanesia", translation: "Melanesia" },
      { name: "Micronesia", translation: "Micronesia" },
      { name: "Polynesia", translation: "Polinesia" },
    ],
  },
];
