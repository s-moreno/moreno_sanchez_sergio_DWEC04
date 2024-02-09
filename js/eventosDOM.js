"use-stric";

/* Imports javascript */
import obtenerPaisesAPI from "./fetchAPI.js";
import { buscarRegion } from "./regiones.js";
import {
  ordenarLista,
  ordenarListaPoblacion,
  pintarPaises,
  pintarPais,
  pintarListaPoblacion,
  pintarListaExtension,
  pintarResumen,
  pintarResumenActual,
  pintarNavbarHome,
  borrarBreadCrumb,
  pintarBreadCrumb,
} from "./funciones.js";

$(document).ready(function () {
  // Variables y Constantes:
  let listaPaises = [];
  let listaPaisesAux = [];
  let vistaPoblacion = false;
  let vistaExtension = false;

  // MAIN
  pintarNavbarHome();
  botonIrTop();
  iniciarPaises();
  eventoClickBreadCrumb();

  /**
   * Función que obtiene los países, los pinta por pantalla y su resumen.
   */
  function iniciarPaises() {
    obtenerPaisesAPI("/all")
      .then((data) => {
        listaPaises = data;
        listaPaisesAux = [];
      })
      .then(() => {
        ordenarLista(listaPaises);
        pintarResumen(listaPaises);
        pintarPaises(listaPaises);
        eventoClickBreadCrumb();
        eventoClickPaisCard();
        eventoBuscador();
        scrollTo(0, 0);
      })
      .catch((error) => {
        console.log("Error fetch API: " + error);
      });
  }

  /**
   * función que controla los eventos de click en el BreadCrumb
   */
  function eventoClickBreadCrumb() {
    // Click botón de inicio e icono del mundo
    $("#btn-inicio, #breadcrumb-world").click(() => {
      iniciarPaises();
      borrarBreadCrumb();
      $("#info-actual").empty();
      vistaExtension = false;
      vistaPoblacion = false;
      $("#poblacion, #extension, #Z-A").removeClass("disabled");
      $("#grilla").addClass("disabled");
    });

    // Click en el continente
    $("#breadcrumb-continente").click(function () {
      if (!$(this).hasClass("active")) {
        let region = $(this).data("name");
        listaPaisesAux = listaPaises.filter((pais) => pais.region === region);
        pintarResumenActual("region", listaPaisesAux);
        borrarBreadCrumb();
        pintarBreadCrumb(undefined, region);
        eventoClickBreadCrumb();
        pintarPaises(listaPaisesAux);
        eventoClickPaisCard();
        scrollTo(0, 0); // ir al top de la ventana;
        vistaPoblacion = false;
        vistaExtension = false;
        $("#poblacion, #extension, #Z-A").removeClass("disabled");
      }
    });

    // Click en la región
    $("#breadcrumb-region").click(function () {
      if (!$(this).hasClass("active")) {
        let subregion = $(this).data("name");
        listaPaisesAux = listaPaises.filter(
          (pais) => pais.subregion === subregion
        );
        pintarResumenActual("subregion", listaPaisesAux);
        borrarBreadCrumb();
        pintarBreadCrumb(undefined, buscarRegion(subregion), subregion);
        eventoClickBreadCrumb();
        pintarPaises(listaPaisesAux);
        eventoClickPaisCard();
        scrollTo(0, 0); // ir al top de la ventana;
        vistaPoblacion = false;
        vistaExtension = false;
        $("#poblacion, #extension, #Z-A").removeClass("disabled");
      }
    });

    // Click en botón VISTA mostrar países en cuadrícula/grilla
    $("#grilla").click(() => { 
      pintarPaises(listaPaisesAux);
      eventoClickPaisCard();
      scrollTo(0, 0); // ir al top de la ventana;
      vistaExtension = false;
      vistaPoblacion = false;
      $("#poblacion, #extension, #Z-A").removeClass("disabled");
      $("#grilla").addClass("disabled");
    });

    // Click en botón VISTA lista por población/habitantes
    $("#poblacion").click(() => {
      vistaPoblacion = true;
      $("#poblacion, #A-Z").addClass("disabled");
      $("#grilla, #extension, #Z-A").removeClass("disabled");
      if (listaPaisesAux.length === 0) {
        ordenarListaPoblacion(listaPaises);
        pintarListaPoblacion(listaPaises);
      } else {
        ordenarListaPoblacion(listaPaisesAux);
        pintarListaPoblacion(listaPaisesAux);
      }
      eventoClickPaisCard();
    });

    // Click en botón VISTA lista por extensión/superficie
    $("#extension").click(() => {
      vistaExtension = true;
      $("#extension, #A-Z").addClass("disabled");
      $("#grilla, #poblacion, #Z-A").removeClass("disabled");
      if (listaPaisesAux.length === 0) {
        ordenarLista(listaPaises, "area", false);
        pintarListaExtension(listaPaises);
      } else {
        ordenarLista(listaPaisesAux, "area", false);
        pintarListaExtension(listaPaisesAux);
      }
      eventoClickPaisCard();
    });

    // Click en botón ↓ (descendente)
    $("#A-Z").on("click", () => {
      let lista = [];
      if (listaPaisesAux.length === 0) lista = listaPaises;
      else lista = listaPaisesAux;

      if (vistaPoblacion) {
        ordenarListaPoblacion(lista);
        pintarListaPoblacion(lista);
      } else if (vistaExtension) {
        ordenarLista(lista, "area", false);
        pintarListaExtension(lista);
      } else {
        ordenarLista(lista);
        pintarPaises(lista);
      }
      eventoClickPaisCard();
      $("#A-Z").addClass("disabled");
      $("#Z-A").removeClass("disabled");
    });

    // Click en botón ↑ (ascendente)
    $("#Z-A").on("click", () => {
      let lista = [];
      if (listaPaisesAux.length === 0) lista = listaPaises;
      else lista = listaPaisesAux;

      if (vistaPoblacion) {
        ordenarListaPoblacion(lista, true);
        pintarListaPoblacion(lista);
      } else if (vistaExtension) {
        ordenarLista(lista, "area");
        pintarListaExtension(lista);
      } else {
        ordenarLista(lista, undefined, false);
        pintarPaises(lista);
      }
      eventoClickPaisCard();
      $("#A-Z").removeClass("disabled");
      $("#Z-A").addClass("disabled");
    });
  }

  /**
   * función que controla los eventos de click dentro
   * de un "card" de país.
   */
  function eventoClickPaisCard() {
    $("#continente, #region, #card, #pais").on("click", function (event) {
      const id = event.target.id;
      borrarBreadCrumb();
      if (id === "continente" || id === "region") {
        vistaPoblacion = false;
        vistaExtension = false;

        if (id === "continente") {
          const region = $(this).data("name");
          listaPaisesAux = listaPaises.filter((pais) => pais.region === region);
          pintarResumenActual("region", listaPaisesAux);
          pintarBreadCrumb(undefined, region);
          pintarPaises(listaPaisesAux);
        } else if (id === "region") {
          const subregion = $(this).data("name");
          listaPaisesAux = listaPaises.filter(
            (pais) => pais.subregion === subregion
          );
          pintarResumenActual("subregion", listaPaisesAux);
          pintarBreadCrumb(undefined, buscarRegion(subregion), subregion);
          pintarPaises(listaPaisesAux);
        }

        $("#poblacion, #extension").removeClass("disabled");
        eventoClickBreadCrumb();
        eventoClickPaisCard();
        scrollTo(0, 0); // ir al top de la ventana;
      } else {
        const pais = $(this).data("name");
        pintarPais(pais, listaPaises);
        eventoClickPais();
        eventoClickBreadCrumb();
        $("#grilla, #extension, #poblacion, #A-Z, #Z-A").addClass("disabled");
        $("#info-actual").empty();
        scrollTo(0, 0); // ir al top de la ventana;
      }
    });
  }

  /**
   * Función que controla los click dentro de la ficha de un país:
   * continente, región y países limítrofes.
   */
  function eventoClickPais() {
    // Click en el continente
    $("#region").click(function () {
      let region = $(this).data("name");
      listaPaisesAux = listaPaises.filter((pais) => pais.region === region);
      pintarResumenActual("region", listaPaisesAux);
      borrarBreadCrumb();
      pintarBreadCrumb(undefined, region);
      eventoClickBreadCrumb();
      pintarPaises(listaPaisesAux);
      eventoClickPaisCard();
      scrollTo(0, 0); // ir al top de la ventana;
      vistaPoblacion = false;
      vistaExtension = false;
      $("#poblacion, #extension").removeClass("disabled");
    });

    // Click en la región
    $("#subregion").click(function () {
      let subregion = $(this).data("name");
      listaPaisesAux = listaPaises.filter(
        (pais) => pais.subregion === subregion
      );
      pintarResumenActual("subregion", listaPaisesAux);
      borrarBreadCrumb();
      pintarBreadCrumb(undefined, buscarRegion(subregion), subregion);
      eventoClickBreadCrumb();
      pintarPaises(listaPaisesAux);
      eventoClickPaisCard();
      scrollTo(0, 0); // ir al top de la ventana;
      vistaPoblacion = false;
      vistaExtension = false;
      $("#poblacion, #extension").removeClass("disabled");
    });

    // Click en un país limítrofe
    $(".pais-limite").click(function () {
      let pais = $(this).data("name");
      pintarPais(pais, listaPaises);
      eventoClickPais();
      eventoClickBreadCrumb();
      scrollTo(0, 0); // ir al top de la ventana;
    });
  }

  /**
   * función que controla los eventos al buscar un páis en el formulario
   */
  function eventoBuscador() {
    let texto = "";

    // creamos un string con el texto introducido por el usuario
    $("#buscador").keyup(function (event) {
      texto = $(this).val().toLowerCase(); // convertir a minúsculas
      listaPaisesAux = listaPaises.filter((pais) => pais.translations.spa.common.toLowerCase().includes(texto));
      
      // pintamos los países que coinciden con la búsqueda
      borrarBreadCrumb();
      pintarPaises(listaPaisesAux);
      eventoClickPaisCard();
      scrollTo(0, 0); // ir al top de la ventana;
      vistaPoblacion = false;
      vistaExtension = false;
      $("#poblacion, #extension, #Z-A").removeClass("disabled");
    });

    // al perder el foco del input, borrar el texto
    $("#buscador").blur(function() { 
      $(this).val("");
      texto = "";
    });
  }

  /**
   * Función que muestra un botón para ir al inicio de la ventana
   */
  function botonIrTop() {
    const $topButton = $("#btn-go-top");
    // El botón solo aparece al hacer scroll hacía abajo 500px
    window.onscroll = () => {
      if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
      ) {
        $topButton.css("visibility", "visible");
      } else {
        $topButton.css("visibility", "hidden");
      }
    };
    // Lógica del evento click del boton para subir arriba
    $topButton.click(() => scrollTo(0, 0));
  }
}); //fin jquery
