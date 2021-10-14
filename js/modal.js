import { cartShow } from "./shoppingCart.js";

const $modal = document.querySelector(".modal");

/*--------------------------------------------------------
Carrito en forma modal
--------------------------------------------------------*/
export function modal() {
    const $btnModal = document.querySelectorAll("header a[href='#micarrito']");
    const $btnModalFloat = document.querySelector(".carrito-float")
    const $btnCloseModal = document.querySelector(".modal .close > *");

    document.addEventListener("click", e => {
        if (e.target == $modal || e.target == $btnCloseModal) {
            modalClose();
        }

        if (e.target == $btnModal[0] || e.target == $btnModal[1] || e.target == $btnModalFloat) {
            modalOpen();
        }
    })
}

/*--------------------------------------------------------
Abrir Modal
--------------------------------------------------------*/
export function modalOpen() {
    cartShow();
    $($modal)
        .css({ "opacity": 0, "display": "flex" })
        .animate({ opacity: 1 }, 200)
}

/*--------------------------------------------------------
Cerrar Modal
--------------------------------------------------------*/
export function modalClose() {
    $($modal)
        .animate({ opacity: 0 }, 200, function () {
            $(this).css("display", "none")
        })
}