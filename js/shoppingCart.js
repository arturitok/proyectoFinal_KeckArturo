import { Carrito } from "./cart.js";
import { checkout } from "./checkout.js";
import { storageUpdate } from "./main.js";
import { modalClose } from "./modal.js";

//Crear un carrito
export const cart = new Carrito();

//Variables del DOM 
const $containerCarrito = document.querySelector(".container-carrito");
const $carritoMessage = document.querySelector(".carrito-container .message");
const $carritoTabla = document.querySelector(".carrito-container .carrito-tabla");
const $carritoProductos = document.querySelector(".carrito-container .carrito-productos");
const $carritoSubtotal = document.getElementById("subtotal");
const $btnEnvio = document.getElementById("btn-envio");
const $totalEnvio = document.getElementById("totalEnvio");
const $carritoTotal = document.getElementById("total");
const $btnVolver = document.querySelectorAll("#btn-volver");
const $btnBorrar = document.getElementById("btn-borrar");
const $btnComprar = document.getElementById("btn-comprar");
const $templateCarrito = document.getElementById("template-carrito").content;
const $fragment = document.createDocumentFragment();

//Función para mostrar el carrito
export function cartShow() {
    //Actualziar si hay carrito guardado
    storageUpdate();

    //Si el carrito está vacío mostramos un mensaje
    if (cart.cantidadTotal > 0) {
        if ($containerCarrito) {
            $containerCarrito.style.justifyContent = "start";
        }
        $carritoTabla.style.display = "grid";
        $carritoMessage.style.display = "none";
    } else {
        if ($containerCarrito) {
            $containerCarrito.style.justifyContent = "center";
        }
        $carritoTabla.style.display = "none";
        $carritoMessage.style.display = "block";
    }

    //Vemos si el flag nos indica que ya se calculó el envío
    if (!cart.shippingFlag) {
        $btnEnvio.style.display = "block";
        $totalEnvio.innerHTML = "";
        $carritoTotal.textContent = "";
    } else {
        $btnEnvio.style.display = "none";
        //Chequear si hay que calcular envío
        if (cart.shipping) {
            if (cart.subTotal > 5000) {
                cart.totalEnvio = 0;
                $totalEnvio.innerHTML = `<small><del>$650</del></small><b>$${cart.totalEnvio}</b>`;
            } else {
                cart.totalEnvio = 650;
                $totalEnvio.innerHTML = `<b>$${cart.totalEnvio}<b>`;
            }

        } else {
            $totalEnvio.innerHTML = `<b>$${cart.totalEnvio}<b>`;
        }
    }


    //Mostrar el carrito 
    cart.productos.forEach(producto => {
        $templateCarrito.querySelector("img").src = producto.imagen[0];
        $templateCarrito.querySelector("img").alt = `${producto.nombre}`;
        $templateCarrito.querySelectorAll(".producto div")[1].innerHTML = `<a href="producto.html?id=${producto.codigo}">${producto.nombre} ${producto.color} - Talle ${producto.talle}</a>`;
        $templateCarrito.querySelectorAll(".producto div")[2].textContent = `$${producto.precio}`;
        $templateCarrito.querySelector("span").textContent = producto.cantidad;
        $templateCarrito.querySelectorAll(".producto div")[4].textContent = `$${producto.cantidad * producto.precio}`;
        $templateCarrito.querySelectorAll(".boton-cantidad")[0].dataset.codigo = producto.codigo;
        $templateCarrito.querySelectorAll(".boton-cantidad")[0].dataset.talle = producto.talle;
        $templateCarrito.querySelectorAll(".boton-cantidad")[1].dataset.codigo = producto.codigo;
        $templateCarrito.querySelectorAll(".boton-cantidad")[1].dataset.talle = producto.talle;

        //Habilitar los botones en función de la disponibilidad
        if (producto.cantidadDisponible === producto.cantidad) {
            $templateCarrito.querySelectorAll(".boton-cantidad")[1].style.opacity = 0.5;
            $templateCarrito.querySelectorAll(".boton-cantidad")[1].disabled = true;
            $templateCarrito.querySelectorAll(".boton-cantidad")[1].style.cursor = "default";
        } else {
            $templateCarrito.querySelectorAll(".boton-cantidad")[1].style.opacity = 1;
            $templateCarrito.querySelectorAll(".boton-cantidad")[1].disabled = false;
            $templateCarrito.querySelectorAll(".boton-cantidad")[1].style.cursor = "pointer";
        }

        const clone = $templateCarrito.cloneNode(true);

        $fragment.appendChild(clone);
    })

    //limpiamos el html y agregamos el fragmento
    $carritoProductos.innerHTML = "";
    $carritoProductos.appendChild($fragment)

    //Calcul totales y subtotales por producto
    cart.calcularSubtotal();
    cart.calcularTotal();
    $carritoSubtotal.innerHTML = `<b>$${cart.subTotal}</b>`;
    $carritoTotal.innerHTML = `<b>$${cart.total}</b>`;


}

//Función para calcular el envío, ejecuta el método del constructor y luego oculta el botón. Finalmente muestra el total con la suma del subtotal + envío
export async function shippingCost() {
    await cart.consultaEnvio();

    cartShow();
}


//Función para eliminar los productos del carrito y del LocalStorage
export function cartClean(confirm) {
    if (confirm) {
        Swal.fire({
            title: '¡Ojo!',
            text: "¿Vaciar carrito?",
            icon: undefined,
            showCancelButton: true,
            confirmButtonColor: '#17779c',
            cancelButtonColor: '#444',
            confirmButtonText: 'Si',
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                cart.cartClean();
                cartShow();
            }
        })
    } else {
        cart.cartClean();
        cartShow();
    }
}

//Funcion para actualizar indicador de cantidad en carrito flotante y menu
export function cartIndex() {
    $(".carrito-span").each((i, span) => {
        span.innerHTML = cart.cantidadTotal;
    });
}

//Eventos de botones de aumentar y reducir cantidad
$carritoProductos.addEventListener("click", (e) => {
    let codigo = e.target.dataset.codigo;
    let talle = e.target.dataset.talle;
    let producto = cart.productos.find(producto => producto.codigo === parseInt(codigo) && producto.talle === talle);

    //Boton restar cantidad
    if (e.target.textContent === "-") {
        if (producto.cantidad > 1) {
            producto.cantidad--
            cart.calcularCantidad();
            cartShow();
            cartIndex();
        } else {
            cart.productos = cart.productos.filter(product => product.codigo != codigo || product.talle != talle);
            cart.calcularCantidad();
            cartShow();
            cartIndex();
        }

    }

    //Boton sumar cantidad
    if (e.target.textContent === "+") {
        if (producto.cantidad < producto.cantidadDisponible) {
            producto.cantidad++
            cart.calcularCantidad();
            cartShow();
        }
    }
})

//Eventos de botones envio, limpiar, volver y avanzar
document.addEventListener("click", (e) => {
    if (e.target === $btnEnvio) {
        shippingCost();
    }

    if (e.target === $btnBorrar) {
        cartClean(true);
    }

    if (e.target === $btnVolver[0] || e.target === $btnVolver[1]) {
        if (document.body.dataset.section === "carrito" || document.body.dataset.section === "producto") {
            location.href = "shop.html";
        } else {
            modalClose();
        }
    }

    if (e.target === $btnComprar) {
        checkout(e, $carritoTabla, $containerCarrito);
    }
})