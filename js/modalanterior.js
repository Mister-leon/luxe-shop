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
                <p class="modal-price">Precio: $0.00</p>
                <p class="modal-description">Descripción breve del producto.</p>
                <div class="color-selection" style="display: none;">
                    <p>Selecciona un color:</p>
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
    const modalDescription = modal.querySelector(".modal-description");
    const quantityDisplay = modal.querySelector(".quantity-display");
    const quantityDecrease = modal.querySelector(".quantity-decrease");
    const quantityIncrease = modal.querySelector(".quantity-increase");
    const buttonBuy = modal.querySelector(".button-buy");
    const colorSelection = modal.querySelector(".color-selection");
    const colorOptions = modal.querySelector(".color-options");

    let cantidad = 1;  // Cantidad inicial
    let modalAbierto = false; // Estado para manejar si el modal está abierto

    // Función para cargar los colores disponibles en el modal
    function loadColors(colors) {
        colorOptions.innerHTML = "";  // Limpiar opciones anteriores

        if (colors && colors.length > 0) {
            colors.forEach(color => {
                const colorButton = document.createElement("div");
                colorButton.className = "color-button";
                colorButton.style.backgroundColor = color;  // Establecer el color de fondo
                colorOptions.appendChild(colorButton);

                // Agregar evento de selección de color
                colorButton.addEventListener("click", () => {
                    document.querySelectorAll(".color-button").forEach(btn => btn.classList.remove("selected"));
                    colorButton.classList.add("selected");
                });
            });
            colorSelection.style.display = "block";
        } else {
            colorSelection.style.display = "none";
        }
    }

    // Función para abrir el modal
    function openModal(producto) {
        modalImage.src = producto.imagen;
        modalTitle.textContent = producto.titulo;
        modalPrice.textContent = `Precio: $${producto.precio}`;
        modalDescription.textContent = producto.descripcion || "Descripción no disponible.";
        cantidad = 1;  // Reiniciar cantidad al abrir el modal
        quantityDisplay.textContent = cantidad;
        modal.style.display = "block";
        modalAbierto = true; // Establecer el estado del modal a abierto

        // Cargar colores si el producto tiene colores disponibles
        loadColors(producto.colores);
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.style.display = "none";
        modalAbierto = false; // Establecer el estado del modal a cerrado
    }

    // Manejo de eventos para los botones de cantidad
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

    // Función para agregar al carrito
    function agregarAlCarrito(producto) {
        if (!producto) {
            console.error("Producto nulo no se puede agregar al carrito.");
            return;
        }

        const idBoton = producto.id;
        let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

        const productoExistente = productosEnCarrito.find(prod => prod.id === idBoton);
        
        if (productoExistente) {
            productoExistente.cantidad += producto.cantidad;  // Agregar la cantidad seleccionada
        } else {
            producto.cantidad = cantidad; // Asegurarse de que la cantidad se asigna
            productosEnCarrito.push(producto);
        }

        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        actualizarNumerito(); // Actualizar el número del carrito
    }

    // Manejo del botón de comprar
    buttonBuy.addEventListener("click", () => {
        if (!modalAbierto) return; // No hacer nada si el modal no está abierto

        const producto = productos.find(p => p.id === modal.dataset.productId);
        const selectedColor = modal.querySelector(".color-button.selected");

        if (producto) {
            producto.cantidad = cantidad;  // Establecer la cantidad seleccionada
            producto.colorSeleccionado = selectedColor ? selectedColor.style.backgroundColor : null;  // Establecer el color seleccionado
            agregarAlCarrito(producto);  // Función para agregar al carrito
            closeModal();
        } else {
            console.error("Producto no encontrado con ID:", modal.dataset.productId); // Depuración
        }
    });

    // Cerrar modal al hacer clic en el botón de cerrar
    modalClose.addEventListener("click", closeModal);

    // Cerrar modal al hacer clic fuera del modal
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Abrir el modal al hacer clic en un producto
    document.querySelector("#contenedor-productos").addEventListener("click", (e) => {
        const producto = e.target.closest(".producto");
        if (producto) {
            const id = producto.querySelector(".producto-agregar").id;
            const productoSeleccionado = productos.find(p => p.id === id);
            if (productoSeleccionado) {
                openModal(productoSeleccionado);
                modal.dataset.productId = id;  // Guardar ID del producto en el modal
            } else {
                console.error("Producto no encontrado con ID:", id); // Depuración
            }
        }
    });
});
