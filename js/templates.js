"use-stric";

/**
 * Template para pintar en pantalla el "card" de un país
 */
export const $paisCardTemplate = $(`
    <div class="col">
        <article id="card" class="card h-100 shadow">
        <span class="border-bottom ratio ratio-16x9"><img id="bandera-pais" class="card-img-top"></span>
        <div class="card-body">
            <h5 id="nombre-pais" class="card-title"></h5>
        </div>
        <div class="card-footer">
            <span id="continente" class="badge rounded-pill"></span>
            <span id="region" class="badge rounded-pill text-bg-light"
        </div>
        </article>
    </div>  
`);

/**
 * Template para pintar por pantalla la información
 * de un solo país.
 */
export const $paisInfoTemplate = $(`

<div class="papel">
  <div class="d-flex justify-content-between mx-4">
    <div>
      <h1 id="nombre" class="display-3 text-body-emphasis mb-3"></h1>
      <figcaption id="nombre-oficial" class="blockquote-footer"></figcaption>
    </div>
    <div>
      <img id="bandera-pais" class="rounded ratio ratio-16x9 w-50 float-end">
    </div>
  </div> 
  <hr class="border border-danger opacity-100">
  <div class="row flex-lg-row g-5 py-2">
    <div class="col-lg-7">
      <ul class="lista">
        <li><span class="clave">Capital:</span> <span id="capital"></span></li>
        <li><span class="clave">Continente:</span> <span id="region" class="enlace"></span></li>
        <li><span class="clave">Región:</span> <span id="subregion" class="enlace"></span></li>
        <li><span class="clave">Moneda:</span> <ul id="moneda"></ul></li>
        <li><span class="clave">Idioma(s):</span> <ul id="idioma"></ul></li>
        <li><span class="clave">Población:</span> <span id="poblacion"></span> habitantes</li>
        <li><span class="clave">Superficie:</span> <span id="area"></span> km<sup>2</sup></li>
      </ul>
      <h2 class="display-6 subrayado">Países limítrofes:</h2>
      <ul id="limites"></ul>
    </div>

    <!-- MAPA -->
    <div class="col-10 col-sm-8 col-lg-5">
      <div id="mapa" style="width:100%; height: 400px;"></div>
    </div>
  </div>
</div>
`);

/**
 * Template de una fila con la info de un país
 */
export const $filaPaisTemplate = $(`
<div id="pais" class="row px-3">
    <div id="datos-pais" class="col-md-6 p-0 border-bottom">
        <span id ="pos" class="badge rounded-pill text-bg-success me-2"></span>
        <span class="me-1"><img class="flag-icon border border-dark"></span>
        <span class="fw-semibold me-2"><span id="nombre-pais"></span> :</span>
        <span class="fw-light"><span id="hab-pais"></span></span>
    </div>
    <div class="col-md-6 progress my-2 p-0">
        <div class="progress-bar"></div>
    </div>
</div>
`);

/**
 * Template del navBarHome
 */
export const $navBarHome = $(`
    <nav class="navbar mb-3 ">
      <div id="info-actual" class="p-3 lead"></div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-light me-2" id="btn-inicio" type="button"><i
            class="bi bi-house-fill"></i></button>
      </div>
    </nav>
`);
