document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.querySelector("#contenedor-productos");

    if (contenedorProductos) {
        contenedorProductos.addEventListener("mouseover", (event) => {
            const producto = event.target.closest(".producto");

            if (producto) {
                producto.style.border = "4px solid black"; // Borde más grueso de color naranja
                producto.style.borderRadius = "20px"; // Bordes redondeados
                producto.style.boxShadow = "0 0 50px black"; // Efecto iluminante
                producto.style.transition = "border 0.5s ease, box-shadow 0.5s ease"; // Transición lenta
            }
        });

        contenedorProductos.addEventListener("mouseout", (event) => {
            const producto = event.target.closest(".producto");

            if (producto) {
                producto.style.border = "none"; // Quitar borde
                producto.style.boxShadow = "none"; // Quitar efecto iluminante
                producto.style.transition = "border 2s ease, box-shadow 2s ease"; // Transición lenta
            }
        });
    }
});
