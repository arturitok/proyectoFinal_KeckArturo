import { productos, productsLoad, productsShow, productShow, stockUpdate } from "./productos.js";
import { modal } from "./modal.js";
import { cart, cartShow } from "./shoppingCart.js";
import { categoryShow, productSort } from "./sort.js";
import { paginationShow } from "./pages.js";
import { buscador } from "./search.js";

//Ejecutar los scripts para cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    productsLoad(function () {
        //Callbacks
        storageUpdate();

        //Si estamos en la seccion generica
        if (document.body.dataset.section === "generic") {
            modal();
        }

        //Si estamos en la seccion shop
        if (document.body.dataset.section === "shop") {
            buscador();
            modal();
            categoryShow();
            //Verificar si hay algo filtrado en el storage
            if (localStorage.categoryFilter) {
                let category = localStorage.categoryFilter;
                let filter = productos.filter(producto => producto.categoria === category);
                productsShow(filter, undefined, undefined, undefined, `Mostrando categoria: ${category}`);
                paginationShow(filter);
                productSort(filter);
            } else {
                productsShow();
                paginationShow();
                productSort(productos);
            }
        }

        //Si estamos en la seccion producto
        if (document.body.dataset.section === "producto") {
            productShow()
            modal();
        }

        //Si estamos en la seccion carrito
        if (document.body.dataset.section === "carrito") {
            cartShow();
        }
    })
});


//Funcion localStorage
export function storageUpdate() {
    //Guardar el carrito  en el localstorage
    if (!localStorage.carritoLocal) {
        localStorage.setItem("carritoLocal", JSON.stringify(cart));
    }

    const carritoLocal = JSON.parse(localStorage.carritoLocal);
    cart.productos = carritoLocal.productos;
    cart.shippingFlag = carritoLocal.shippingFlag;
    cart.totalEnvio = carritoLocal.totalEnvio;
    cart.shipping = carritoLocal.shipping;
    cart.calcularCantidad();
    cart.calcularSubtotal();
    cart.calcularTotal();
    
    //Actualizar la existencia de productos
    cart.productos.forEach(product => {
        stockUpdate(product)
    })

    //Actualizar el contador de artículos del carrito
    const $carritoIndex = document.querySelectorAll(".carrito-span");
    $carritoIndex.forEach(span => span.innerHTML = cart.cantidadTotal);

   
}