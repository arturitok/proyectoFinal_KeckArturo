import { productos, productsShow } from "./productos.js";
import { paginationShow } from "./pages.js";

const $orderSelect = document.querySelector("#order");

/*--------------------------------------------------------
Ordenar productos
--------------------------------------------------------*/
export function productSort(products) {

    $orderSelect.addEventListener("change", (e) => {
        let index = e.target.selectedIndex;
        let value = e.target.options[index].value;
        let sortedProducts = "";

        if (value == "pr-mintomax") {
            sortedProducts = products.sort((a, b) => a.precio - b.precio);
        } else if (value == "pr-maxtomin") {
            sortedProducts = products.sort((a, b) => b.precio - a.precio);
        } else {
            return;
        }

        productsShow(sortedProducts)
    })
}


/*--------------------------------------------------------
Mostrar Categorias
--------------------------------------------------------*/
export function categoryShow() {
    //Boton para mostrar categorias
    const $btnCategorias = document.getElementById("btn-categorias");
    const $ulCategorias = document.querySelector(".filters ul")

    const categorias = ["Todos"];

    productos.forEach(producto => {
        let categoria = producto.categoria;

        if (!categorias.includes(categoria)) {
            categorias.push(categoria)
        }
    })
    
    categorias.forEach((categoria) => {
        let $li = document.createElement("li");
        let filter = categoria == "Todos" ? productos : productos.filter(producto => producto.categoria == categoria);
        $li.innerHTML = `${categoria} <span>(${filter.length})</span>`;
        

        $li.addEventListener("click", (e) => {
            localStorage.removeItem("categoryFilter");
            $($ulCategorias).slideToggle();
            
            productsShow(filter, undefined, undefined, undefined, `Mostrando categoría: ${categoria}`);
            paginationShow(filter);
            productSort(filter);

            //Limpiar el select
            $orderSelect.options[0].selected = true;

            //Aplicar estilo a los botones
            let $otherLi = e.target.parentNode.querySelectorAll("li");

            //Modificar botones
            $otherLi.forEach(li => {
                li.style.opacity = 0.8;
                li.style.fontWeight = 500;
            });

            //Aplicar estilos al boton seleccionado
            e.target.style.opacity = 1;
            e.target.style.fontWeight = "bold";
        })

        $ulCategorias.appendChild($li);
    })

    $btnCategorias.addEventListener("click", (e) => {
        $($ulCategorias).slideToggle();
        $btnCategorias.querySelector("i").classList.toggle("fa-chevron-up")
    })
}