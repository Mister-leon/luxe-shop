document.addEventListener("DOMContentLoaded", () => {
    // Crear el modal y agregarlo al documento
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img class="modal-image" src="" alt="Imagen del producto">
            <div class="modal-details">
                <h2 class="modal-title">Título del Producto</h2>
                <p class="modal-price-original" style="display: none;">Precio original: $0.00</p> <!-- Precio original tachado -->
                <p class="modal-price">Precio: $0.00</p> <!-- Precio con descuento -->
                <p class="modal-description">Descripción breve del producto.</p>
                <p class="modal-detalles" style="font-size: 0.9em; color: blue;">Detalles del producto.</p> <!-- Estilo actualizado: letra más pequeña y color azul -->
                <div class="color-selection" style="display: none;">
                    <div class="color-options"></div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-decrease">-</button>
                    <span class="quantity-display">1</span>
                    <button class="quantity-increase">+</button>
                </div>
                <button class="button-buy">Agregar al Carrito</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Obtener elementos del modal
    const modalClose = modal.querySelector(".modal-close");
    const modalImage = modal.querySelector(".modal-image");
    const modalTitle = modal.querySelector(".modal-title");
    const modalPrice = modal.querySelector(".modal-price");
    const modalPriceOriginal = modal.querySelector(".modal-price-original");
    const modalDescription = modal.querySelector(".modal-description");
    const modalDetalles = modal.querySelector(".modal-detalles"); // Elemento de detalles
    const quantityDisplay = modal.querySelector(".quantity-display");
    const quantityDecrease = modal.querySelector(".quantity-decrease");
    const quantityIncrease = modal.querySelector(".quantity-increase");
    const buttonBuy = modal.querySelector(".button-buy");
    const colorSelection = modal.querySelector(".color-selection");
    const colorOptions = modal.querySelector(".color-options");

    let cantidad = 1;
    let productoActual = null;

    // Función para cargar colores desde IDs
    function loadColors(colorIDs) {
        colorOptions.innerHTML = "";
        colorIDs.forEach(id => {
            const color = getColorByID(id);
            const colorButton = document.createElement("div");
            colorButton.className = "color-button";
            colorButton.style.backgroundColor = color;
            colorButton.dataset.id = id;  // Guardar el ID del color en el atributo dataset
            colorOptions.appendChild(colorButton);

            colorButton.addEventListener("click", () => {
                document.querySelectorAll(".color-button").forEach(btn => btn.classList.remove("selected"));
                colorButton.classList.add("selected");
            });
        });
    }

    function openModal(producto) {
        productoActual = producto;
        modalImage.src = producto.imagen;
        modalTitle.textContent = producto.titulo;

        // Comprobar si el producto tiene un descuento
        if (producto.descuento && producto.descuento > 0) {
            const precioConDescuento = producto.descuento;
            modalPrice.textContent = `Precio: S/${precioConDescuento.toFixed(2)}`;
            modalPriceOriginal.style.display = "block";
            modalPriceOriginal.textContent = `Precio original: S/${producto.precio.toFixed(2)}`;
        } else {
            modalPrice.textContent = `Precio: S/${producto.precio.toFixed(2)}`;
            modalPriceOriginal.style.display = "none";
        }

        modalDescription.textContent = producto.descripcion || "Descripción no disponible.";
        modalDetalles.textContent = producto.detalles || "Detalles no disponibles."; // Mostrar detalles del producto
        cantidad = 1;
        quantityDisplay.textContent = cantidad;
        modal.style.display = "block";

        if (producto.colores && producto.colores.length > 0) {
            colorSelection.style.display = "block";  // Mostrar selección de colores
            loadColors(producto.colores);
        } else {
            colorSelection.style.display = "none";  // Ocultar selección de colores
        }
    }

    function closeModal() {
        modal.style.display = "none";
    }

    quantityDecrease.addEventListener("click", () => {
        if (cantidad > 1) {
            cantidad--;
            quantityDisplay.textContent = cantidad;
        }
    });

    quantityIncrease.addEventListener("click", () => {
        cantidad++;
        quantityDisplay.textContent = cantidad;
    });

    buttonBuy.addEventListener("click", () => {
        if (!productoActual) return;

        const selectedColor = modal.querySelector(".color-button.selected");
        const colorSeleccionado = selectedColor ? selectedColor.dataset.id : null;

        agregarAlCarrito(productoActual, cantidad, colorSeleccionado);
        closeModal();
    });

    modalClose.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.querySelector("#contenedor-productos").addEventListener("click", (e) => {
        const producto = e.target.closest(".producto");
        if (producto) {
            const id = producto.querySelector(".producto-agregar").id;
            const productoSeleccionado = productos.find(p => p.id === id);
            if (productoSeleccionado) {
                openModal(productoSeleccionado);
            }
        }
    });
});

// Función auxiliar para obtener color en formato hexadecimal dado un ID
function getColorByID(id) {
    const colores = {
        "6N": "#8A4D2B",
        "5C": "#A86537",
        "5N": "#B36B32",
        "4C": "#C68458",
        "4N": "#CB8C5F",
        "3N": "#CD895E",
        "3C": "#D29262",
        "2C": "#D59A73",
        "2N": "#DB9E77",
        "1N": "#E9AF82",
        // Agrega aquí otros IDs y colores según sea necesario
    };
    return colores[id] || "#FFFFFF"; // Color por defecto si el ID no se encuentra
}
