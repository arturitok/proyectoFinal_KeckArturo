import { slider } from "./slider.js";
import { Product } from "./producto.js";

//Crear un array vacío para cargar productos
export const productos = [];

//Leer los productos del archivo data.json y guardarlos en la variable productos declarada arriba. Ejecutar productsShow() al final  en el callback.
const URLJSON = "../data/data.json";

export function productsLoad(callback) {
  $.getJSON(URLJSON, function (respuesta, estado) {
    if (estado === "success") {
      const db = respuesta;
      for (let product of db) {
        productos.push(new Product(product.codigo, product.nombre, product.categoria, product.linea, product.marca, product.precio, product.imagen, product.color, product.descripcion, product.stock))
      }
    }
  })
    .done(callback)
    .fail(function () {
      $(".products-container").append(`
  <p style="width: 100%; text-align: center;">Error al cargar los productos</p>`)
    })
}

/*--------------------------------------------------------
 Mostrar productos en el DOM con jQuery
/*--------------------------------------------------------*/
export function productsShow(productosSel = productos, start = 0, end = 8, container = ".products-container", titulo = "Mostrando: Todos los productos") {
  //Convertit a número el valor start
  start = parseInt(start);
  end = parseInt(end);

  //Cambiar el título
  const $h3 = document.querySelector("h3.resultados");
  if ($h3) {
    $h3.textContent = titulo;
  }
  //Vaciar el containber y  muestrar productos
  $(container).empty().append(`
    <div class="loader-container">
      <img src="img/loader.svg" alt="">
    </div>`);
  const fragment = document.createDocumentFragment();

  //Añadir productos 
  productosSel.slice(start, start + end).forEach(producto => {
    fragment.appendChild(producto.productShow())
  })
  //Insertar el fragment en el container y  muostrar  productos
  $(container)
    .append(fragment).children().hide();
  $(container).children().fadeIn("fast", function () {
    $(".loader-container").hide();
  });
}

/*--------------------------------------------------------
Mostrar un solo producto en la sección producto.html
--------------------------------------------------------*/
export function productShow(codigo = parseInt(location.search.split("=")[1])) {
  const producto = productos.find(producto => producto.codigo === codigo)
  const talles = Object.keys(producto.stock);
  const $productCarrito = document.querySelector(".product-carrito");
  const $slides = document.querySelector(".slides");
  const $btnComprar = document.querySelector(".botones .boton-principal");
  const $inputTalles = document.getElementById("select-talles");
  const $inputCantidad = document.getElementById("select-cantidad");
  $inputTalles.innerHTML = `<option value="">Elegí el talle</option>`;
  $inputCantidad.innerHTML = `<option value="">Primero elegí el talle</option>`;

  //Carrusel de fotos
  for (let imagen of producto.imagen) {
    $slides.innerHTML += `<div class="image"><img src="${imagen}" alt="" ></div>`
  }
  slider(".slider-container");

  //Nombre, precio y detalle del producto
  $productCarrito.querySelector("h2").textContent = `${producto.nombre} ${producto.color}`;
  $productCarrito.querySelector("h3").textContent = "$" + producto.precio;
  $productCarrito.querySelector("p").textContent = producto.descripcion;

  //Moastrar los talles disponibles
  for (let talle of talles) {
    if (producto.stock[talle] != 0) {
      $inputTalles.innerHTML += `<option value="${talle}">${talle}</option>`;
    } else {
      $inputTalles.innerHTML += `<option value="${talle}" disabled>${talle} -sin stock-</option>`;
    }
  }

  //Agregar evento al select
  $inputTalles.addEventListener("click", (e) => {
    e.target.style = "animation: none";
  })
  $inputTalles.addEventListener("change", (e) => {
    e.preventDefault();
    let talleElegido = e.target.value;
    if (talleElegido != "") {
      //Cantidad: Mostrar la cantidad disponible
      $inputTalles.options[0].style.display = "none";
      $inputCantidad.disabled = false;
      $inputCantidad.innerHTML = "";
      let cantidad = producto.stock[talleElegido];
      for (let i = 1; i <= cantidad; i++) {
        $inputCantidad.innerHTML += `<option value="${i}">${i}</option>`
      }
    } else {
      $inputCantidad.disabled = true;
      $inputCantidad.innerHTML = `<option value="">Elige primero el talle</option>`;
    }
  })

  //Click agregar al carrito
  $btnComprar.addEventListener("click", (e) => {
    e.preventDefault();
    //Leer los valores de los input
    let talle = $inputTalles.value;
    let cantidad = $inputCantidad.value;
    //Crear una copia del producto, y modificar la propiedad stock para que solo haya un objeto con los valores talle y cantidad del input
    let productoElegido = { ...producto }
    productoElegido.cantidadDisponible = parseInt(productoElegido.stock[talle]);
    productoElegido.stock = {};
    productoElegido.stock[talle] = parseInt(cantidad);

    if (talle !== "") {
      producto.cartAdd(e, productoElegido);
      $inputTalles.options[0].style.display = "block";
      $inputTalles.options[0].selected = true;
      $inputCantidad.disabled = true;
      $inputCantidad.innerHTML = `<option value="">Elige primero el talle</option>`;
    } else {
      $inputTalles.focus();
      $inputTalles.style = "animation: scale 0.3s ease-out 0s infinite alternate";
    }
  })
  //Productos relacionados
  const $relContainer = document.querySelector(".products-container");
  const productosRel = productos.filter(product => product.categoria === producto.categoria && product.codigo != producto.codigo);

  //Si la cantidad de productos relacionados es menor a 6, relleno el array con productos aleatorios
  /*while (productosRel.length < 6) {
    let i = Math.floor(Math.random() * productos.length)
    productosRel.push(productos[i])
  }
*/
  productsShow(productosRel, 0, undefined, $relContainer)
  //  productsShow(productosRel, 0, undefined)
  //  productsShow({ productosSel: productosRel })
}


//Funcion para reducir cantidad
export function stockUpdate(producto) {
  let codigo = producto.codigo;
  let talle = producto.talle ? producto.talle : Object.keys(producto.stock);
  let cantidad = producto.cantidad ? producto.cantidad : producto.stock[talle];
  let productoTarget = productos.find(product => product.codigo === codigo);
  productoTarget.stock[talle] -= cantidad;
}
