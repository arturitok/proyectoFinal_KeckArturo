import { productsShow, productos } from "./productos.js";
import { paginationShow } from "./pages.js";
import { productSort } from "./sort.js";

export function buscador() {
    const $input = document.getElementById("buscador");
    const $btn = document.querySelector(".buscador i");

    const buscar = () => {
        let busqueda = $input.value.toLowerCase();
        let resultados = productos.filter(product => (product.nombre).toLowerCase().includes(busqueda) || (product.categoria).toLowerCase().includes(busqueda) || (product.color).toLowerCase().includes(busqueda) || (product.descripcion).toLowerCase().includes(busqueda));
        productsShow(resultados, undefined, undefined, undefined, `Mostrando resultados para: "${busqueda}"`);
        paginationShow(resultados);
        productSort(resultados);
    }

    $input.addEventListener("keyup", (e) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            buscar();
        }
    })

    $btn.addEventListener("click", (e) => {
        buscar();
    })
}