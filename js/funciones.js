"use-stric";

import {
  $filaPaisTemplate,
  $navBarHome,
  $paisCardTemplate,
  $paisInfoTemplate,
} from "./templates.js";
import { traduccion } from "./regiones.js";

const $main = $("#lienzo");

/**
 *  Dada una lista de paises, nos devuelve su población total
 * @param {Object[]} paises - Lista de paises
 * @param {string} clave - Opcional, por defecto "population"
 * @returns
 */
export function poblacionTotal(paises, clave = "population") {
  return paises.reduce((total, pais) => total + pais[clave], 0);
}

/** 
 * Obtener el valor a través de su clave
 * @param {Object} objeto - Objeto país
 * @param {string} clave - clave a buscar
 * @returns
 */
function obtenerValorPorClave(objeto, clave) {
  return clave
    .split(".")
    .reduce((a, c) => (a && a[c] ? a[c] : undefined), objeto);
}

/**
 * Función que ordena una LISTA, usando como criterio una CLAVE,
 * y de forma ASCEDENTE o descendente
 * @param {Object[]} lista - lista de países a ordenar
 * @param {string} clave - clave por defecto "translations.spa.common"
 * @param {boolean} ascendente - por defecto "true"
 */
export function ordenarLista(
  lista,
  clave = "translations.spa.common",
  ascendente = true
) {
  lista.sort((a, b) => {
    let valorA = obtenerValorPorClave(a, clave);
    let valorB = obtenerValorPorClave(b, clave);

    if (ascendente) {
      return valorA === valorB ? 0 : valorA < valorB ? -1 : 1;
    } else {
      return valorA === valorB ? 0 : valorA < valorB ? 1 : -1;
    }
  });
}

/**
 * Función que ordena una LISTA por población, de forma ASCEDENTE o DESCENDENTE
 * @param {Object[]} lista - lista de países a ordenar
 * @param {boolean} ascendente - por defecto "false"
 */
export function ordenarListaPoblacion(lista, ascendente = false) {
  lista.sort((a, b) => {
    return ascendente
      ? a.population - b.population
      : b.population - a.population;
  });
}

/** 
 * Dada una lista de paises, la pinta en pantalla
 * @param {Object[]} lista - lista de países
 */
export function pintarPaises(lista) {
  const $paises = $(
    '<div id="paises" class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4"></div>'
  );

  lista.forEach((pais) => {
    const $clone = $paisCardTemplate.clone();
    $clone.find(".card").attr("data-name", pais.name.common);
    $clone.find("#bandera-pais").attr({src: pais.flags.png});
    $clone.find("#nombre-pais").append(pais.translations.spa.common);
    $clone
      .find("#continente")
      .append(traduccion(pais.region))
      .attr("data-name", pais.region);

    switch (pais.region) {
      case "Africa":
        $clone.find("#continente").addClass("text-bg-primary");
        break;
      case "Americas":
        $clone.find("#continente").addClass("text-bg-warning");
        break;
      case "Asia":
        $clone.find("#continente").addClass("text-bg-success");
        break;
      case "Antarctic":
        $clone.find("#continente").addClass("text-bg-secondary");
        break;
      case "Europe":
        $clone.find("#continente").addClass("text-bg-info");
        break;
      case "Oceania":
        $clone.find("#continente").addClass("text-bg-danger");
        break;
    }
    if ( pais.subregion ) {
      $clone.find("#region").append(traduccion(pais.subregion)).attr("data-name", pais.subregion);
    } else {
      $clone.find("#region").remove();
    }
    $paises.append($clone);
  });
  $main.empty().append($paises);
}

/** 
 * Función para pintar toda la información de un país
 * @param {string} nombrePais
 * @param {Object[]} lista - lista de países
 */
export function pintarPais(nombrePais, lista) {
  // obtenemos el template y lo clonamos
  //const $infoPaisTemplate = $("#template-info-pais").contents();
  const $clone = $paisInfoTemplate.clone();

  // obtener el pais a pintar:
  let pais = lista.find((pais) => pais.name.common === nombrePais);

  borrarBreadCrumb();
  pintarBreadCrumb(pais);

  $main.empty();

  // Información:
  $clone.find("#bandera-pais").attr({src: pais.flags.png});
  $clone.find("#nombre").append(pais.translations.spa.common);
  $clone.find("#nombre-oficial").append(pais.translations.spa.official);
  $clone.find("#capital").append(pais.capital || "");
  $clone.find("#region").attr("data-name", pais.region).append(traduccion(pais.region));
  $clone.find("#subregion").attr("data-name", pais.subregion).append(traduccion(pais.subregion) || "");
  $clone.find("#poblacion").append(pais.population.toLocaleString());
  $clone.find("#area").append(pais.area.toLocaleString());

  // Lenguas:
  Object.keys(pais.languages || {}).forEach((item) => {
    $clone.find("#idioma").append(`<li>${pais.languages[item]}</li>`);
  });

  // Monedas:
  Object.keys(pais.currencies || {}).forEach((item) => {
    const $listItem = $("<li>");
    $listItem.append(pais.currencies[item]?.name || "");
    $listItem.append(` (${pais.currencies[item]?.symbol})` || "");
    $clone.find("#moneda").append($listItem);
  });

  // Países limítrofes:
  if (pais.borders.length > 0) {
    Object.keys(pais.borders || {}).forEach((item) => {
      let paisLimitrofe = lista.find((paisLim) => paisLim.cca3 === pais.borders[item]);
      $clone.find("#limites")
        .addClass("lista")
        .append(`<li class="pais-limite enlace" data-name="${paisLimitrofe.name.common}">${paisLimitrofe.translations.spa.common}</li>`);
    });
  } else {
    $clone.find("#limites").addClass("isla").append('<li>Isla / Archipielago. Sin países limítrofes.</li>');
  }
  
  $main.append($clone);

  // INSERTAR MAPA (DENTRO DEL DIV "MAPA")
  let map = L.map('mapa').setView([pais.latlng[0], pais.latlng[1]], 5);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  L.marker([pais.capitalInfo.latlng[0], pais.capitalInfo.latlng[1]]).addTo(map).bindPopup("Capital: <strong>" + pais.capital[0] + "</strong>");

  // MARCAR EL BORDE GEOGRÁFICO DEL PAIS EN EL MAPA
  const relation = pais.maps.openStreetMaps.match(/\/(\d+)/)[1];

  $.ajax({
    url: 'https://www.openstreetmap.org/api/0.6/relation/' + relation + '/full',
    dataType: 'xml',
    success: function(xml) {
      let geojson = osmtogeojson(xml);

      // Filtrar solo las características de tipo LineString (líneas)
      let limiteGografico = geojson.features.filter(function(feature) {
        return feature.geometry.type === 'LineString';
      });

      let filteredGeojson = {
        type: 'FeatureCollection',
        features: limiteGografico
      };

      L.geoJSON(filteredGeojson).addTo(map);
      map.fitBounds(L.geoJSON(filteredGeojson).getBounds());
    },
    error: function(xhr, status, error) {
      console.error("Error:", status, error);
    }
  });
}

/**
 * Función que pinta en pantalla una lista de paises según su población
 * @param {Object[]} lista - lista de países
 */
export function pintarListaPoblacion(lista) {
  // obtener el país de la lista con más habitantes:
  const maxPoblacion = lista.reduce((maxPoblacion, pais) => {
    return pais.population > maxPoblacion ? pais.population : maxPoblacion;
  }, 0);

  const $paises = $('<div id="paises" g-4"></div>');

  lista.forEach((pais, index) => {
    const $filaPais = $filaPaisTemplate.clone();
    $filaPais.attr("data-name", pais.name.common);
    $filaPais.find("#pos").append(index + 1);
    $filaPais.find("img").attr("src", pais.flags.png);
    $filaPais.find("#nombre-pais").append(pais.translations.spa.common);
    $filaPais.find("#hab-pais").append(`${pais.population.toLocaleString()} hab.`);

    const porcentajeBarra = Math.ceil((pais.population / maxPoblacion) * 100);
    $filaPais.find(".progress-bar").css("width", porcentajeBarra + "%");

    $paises.append($filaPais);
  });

  const $titulo = $(`<h2 class="display-6">Países por habitantes:</h2><hr>`);
  $main.empty().append($titulo).append($paises);
}

/**
 * Función que pinta en pantalla una lista de paises según su extensión
 * @param {Object[]} lista - lista de países
 */
export function pintarListaExtension(lista) {

  const maxExtension = lista.reduce((maxExtension, pais)=> {
    return pais.area > maxExtension ? pais.area : maxExtension;
  }, 0);

  const $paises = $('<div id="paises" g-4"></div>');

  lista.forEach((pais, index) => {
    const $filaPais = $filaPaisTemplate.clone();
    $filaPais.attr("data-name", pais.name.common);
    $filaPais.find("#pos").append(index + 1);
    $filaPais.find("img").attr("src", pais.flags.png);
    $filaPais.find("#nombre-pais").append(pais.translations.spa.common);
    $filaPais.find("#hab-pais").append(`${pais.area.toLocaleString()} km<sup>2</sup>`);

    const porcentajeBarra = Math.ceil((pais.area / maxExtension) * 100);
    $filaPais.find(".progress-bar").css("width", porcentajeBarra + "%");

    $paises.append($filaPais);
  });

  const $titulo = $(`<h2 class="display-6">Países por su extensión:</h2><hr>`);
  $main.empty().append($titulo).append($paises);
}

/**
 * Función que pinta en pantalla el breadcrumb.
 * @param {Object} pais - el país a pintar 
 * @param {string} region - el continente, opcional
 * @param {string} subregion - la región, opcional
 */
export function pintarBreadCrumb(pais, region = "", subregion = "") {
  const $brContinente = $(`<li id="breadcrumb-continente" class="breadcrumb-item"><span
  class="badge rounded-pill text-bg-warning"></span></li>`);
  const $brRegion = $(`<li id="breadcrumb-region" class="breadcrumb-item"><span
  class="badge rounded-pill text-bg-info"></span></li>`);
  const $brPais = $(`<li id="breadcrumb-pais" class="breadcrumb-item"><span></span></li>`);

  if (pais) {
    $brContinente.find("span").text(traduccion(pais.region));
    $brContinente.attr("data-name", pais.region);
    $brRegion.find("span").text(traduccion(pais.subregion));
    $brRegion.attr("data-name", pais.subregion);
    $brPais.find("span").text(pais.translations.spa.common);
    $brPais.addClass("active");
    $("#breadcrumb-ol").append($brContinente).append($brRegion).append($brPais);
  } else if (subregion.length === 0){
    $brContinente.find("span").text(traduccion(region));
    $brContinente.attr("data-name", region);
    $brContinente.addClass("active");
    $("#breadcrumb-ol").append($brContinente);
  } else {
    $brContinente.find("span").text(traduccion(region));
    $brContinente.attr("data-name", region);
    $brRegion.find("span").text(traduccion(subregion));
    $brRegion.attr("data-names", subregion);
    $brRegion.addClass("active");
    $("#breadcrumb-ol").append($brContinente).append($brRegion);
  }
}

/** 
 * Borrar el BreadCrumb
 */
export function borrarBreadCrumb() {
  $("#breadcrumb-continente").remove();
  $("#breadcrumb-region").remove();
  $("#breadcrumb-pais").remove();
}

/**
 * Pintar el Navbar Home
 */
export function pintarNavbarHome() {
  $("header").append($navBarHome);
}

/**
 * Función que pinta en pantalla un resumen de habitantes y países totales
 * @param {Object[]} listaPaises - lista de países
 */
export function pintarResumen(listaPaises) {
  $("#resumen").empty()
    .append(`Somos <span class="badge rounded-pill text-bg-light">${poblacionTotal(listaPaises).toLocaleString()}</span> de habitantes repartidos en <span class="badge rounded-pill text-bg-light">${listaPaises.length}</span> países alrededor del mundo.`);
}

/**
 * Función que pinta en pantalla un resumen de la selección actual de países
 * @param {string} zona - Puede ser "region" o "subregion"
 * @param {Object[]} listaPaises - lista de países
 */
export function pintarResumenActual(zona, listaPaises) {

  let zonaNombre;
  if (zona === "region") zonaNombre = traduccion(listaPaises[0].region);
  else zonaNombre = traduccion(listaPaises[0].subregion);
  
  const $resumen = $(`
    <span class="fondo fw-bolder font-monospace"><span class="">${zonaNombre}:</span> <span class="badge rounded-pill text-bg-warning">${listaPaises.length}</span> países. <span class="badge rounded-pill text-bg-warning">${poblacionTotal(listaPaises).toLocaleString()}</span> de habitantes.</span>
  `);
  
  $("#info-actual").empty()
    .append($resumen)
    .hide()
    .fadeIn(500);
}
