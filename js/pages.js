import { productos, productsShow } from "./productos.js";

/*--------------------------------------------------------
  Resetear la paginacion
--------------------------------------------------------*/
export function paginationShow(products = productos) {
    const $pagination = document.querySelector(".pagination");
    let totalPages = Math.ceil(products.length / 8);
    let start = 0;

    // resetear las páginas}
    $pagination.innerHTML = "";


    //generar los botones poara las páginas
    for (let i = 0; i < totalPages; i++) {
        let $btn = document.createElement("button");
        $btn.innerText = i + 1;
        $btn.dataset.start = parseInt(start);

        //Si no hay página deshabilitar el bopton
        if (i == 0) {
            $btn.classList.add("boton-principal")
            $btn.disabled = true;
            $btn.style.cursor = "default";
        } else {
            $btn.classList.add("boton-principal", "boton-principal-alt", "hover");
        }

        $btn.addEventListener("click", (e) => {
            productsShow(products, e.target.dataset.start);

            //Scroll hacia arriba
            window.scrollTo(0, 0)

            //Aplicar estilos a los botones
            let $otherBtns = e.target.parentNode.querySelectorAll("button");

            //Habiitar los botones y asignarle puntero
            $otherBtns.forEach(btn => {
                btn.classList.add("boton-principal-alt", "hover")
                btn.disabled = false;
                btn.style.cursor = "pointer";
            });

            //Modificar el estilo al boton clickeado
            e.target.classList.remove("boton-principal-alt", "hover");
            e.target.classList.add("boton-principal");
            e.target.disabled = true;
            e.target.style.cursor = "default";
        })

        $pagination.appendChild($btn)

        start += 9;
    }
}