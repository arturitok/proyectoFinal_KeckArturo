import { pagarMP } from "./pago.js";
import { cart, cartClean } from "./shoppingCart.js";

/*--------------------------------------------------------
Generar el checkout y terminar la compra
--------------------------------------------------------*/
export function checkout(e, tabla, container) {
    e.preventDefault();

    //desde el modal de carrito, mandamos al carrito.
    if (document.body.dataset.section === "generic" || document.body.dataset.section === "producto") {
        location.href = "carrito.html";
    } else {
        // Se calculó el envío?
        if (!cart.shippingFlag) {
            Swal.fire({
                title: 'Envio',
                text: "Hay que calcular el costo de envío.",
                icon: undefined,
                showCancelButton: false,
                confirmButtonColor: '#17779c',
                cancelButtonColor: '#444',
                confirmButtonText: 'Aceptar',
            })
        } else {
            //Animaciones para ocultar y mostrar container
            $(tabla.children[0]).slideUp("slow");
            $(tabla.children[1]).slideUp("slow");
            $(tabla.children[2]).fadeIn("slow");
            $(tabla.children[3]).fadeIn(0, function () {
                $(this).css("display", "flex");
                window.scrollTo(0, 0);
            });


            //Mostrar el detalle 
            const $finalProductos = document.querySelectorAll(".carrito-final > div")[0];
            const $finalTotal = document.querySelectorAll(".carrito-final > div")[1];

            $finalProductos.innerHTML = "";
            cart.productos.forEach(product => {
                $finalProductos.innerHTML += `
          <img src="${product.imagen[0]}" alt="${product.nombre}">
          <div><b>${product.nombre} ${product.color}</b> ${product.talle} x${product.cantidad}</div>
          <div>$${product.cantidad * product.precio}</div>
        `
            })

            $finalTotal.innerHTML = `
        <div>Envío:</div>
        <div>$${cart.totalEnvio}</div>
        <div>Total:</div>
        <div>$${cart.total}</div>
      `;

            //Botones para volver
            const $btnCheckoutVolver = document.getElementById("btn-checkout-volver");
            const $btnCheckoutComprar = document.getElementById("btn-checkout-comprar");

            document.addEventListener("click", (e) => {
                if (e.target === $btnCheckoutVolver) {
                    e.preventDefault();
                    $(tabla.children[2]).fadeOut("slow");
                    $(tabla.children[3]).fadeOut("slow");
                    $(tabla.children[0]).slideDown("slow");
                    $(tabla.children[1]).slideDown("slow");
                }
            });

            $btnCheckoutComprar.addEventListener("click", e => {
                e.preventDefault();

                const paymentData = {
                    "items": [
                        {
                            "title": "Tu Compra en TacaTaca",
                            "description": "Articulos de tienda Taca Taca",
                            "picture_url": "",
                            "category_id": "",
                            "quantity": cart.cantidadTotal,
                            "currency_id": "ARS",
                            "unit_price": cart.total
                        }]
                }
                pagarMP(paymentData);
                let numPedido = Math.ceil(Math.random() * 54598971, 0);

                $(tabla.children[2]).slideUp("slow");
                $(tabla.children[3]).slideUp("slow", function () {
                    document.querySelector(".carrito-container").innerHTML = "";

                    container.innerHTML += `
                  <div class="checkout-message">
                    <h2>Muchas gracias por comprar. Ya estamos preparando tu pedido.</h2>
                    <p>Tu número de operación es: <strong>${numPedido}</strong></p>
                    <div></div>
                  </div>
                `;
                   
                    const $btnLimpiarCarrito = document.createElement("button");
                    $btnLimpiarCarrito.textContent = "Volver";
                    $btnLimpiarCarrito.classList.add("boton-principal", "hover");
                    $btnLimpiarCarrito.setAttribute("codigo", "btn-limpiar-carrito");

                    $btnLimpiarCarrito.addEventListener("click", (e) => {
                        cartClean();
                        location = "index.html";
                    })

                    container.querySelector(".checkout-message div").appendChild($btnLimpiarCarrito);
                });
            });
        }
    }
}