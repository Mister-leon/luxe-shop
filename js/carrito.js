let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Función para convertir RGB a nombre de color (opcional)
function obtenerNombreColor(rgb) {
    const colores = {
        'rgb(198, 134, 66)': 'Marrón Claro',
        'rgb(141, 85, 36)': 'Marrón',
        'rgb(255, 219, 172)': 'Beige'
        // Agrega más colores aquí si es necesario
    };
    return colores[rgb] || rgb; // Si no coincide, devuelve el valor RGB original
}

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            // Inicializar colorHTML en cada iteración
            let colorHTML = "";

            // Verificar si existe un título para el producto
            const tituloProducto = producto.titulo || "Producto sin nombre";

            // Si el producto tiene color, obtener el nombre del color; si no, mantener el HTML vacío
            if (producto.colorSeleccionado) {
                const colorTexto = obtenerNombreColor(producto.colorSeleccionado);
                colorHTML = `<div class="carrito-producto-color"><p>${colorTexto}</p></div>`;
            }

            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${tituloProducto}">
                <div class="carrito-producto-detalles">
                    <p>${tituloProducto}</p>
                    ${colorHTML}
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.descuento}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.descuento * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" data-id="${producto.id}" data-color="${producto.colorSeleccionado || ''}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.getAttribute("data-id");
    const colorBoton = e.currentTarget.getAttribute("data-color");

    // Filtrar productos que no coinciden con el ID y, si el color existe, también con el color seleccionado
    productosEnCarrito = productosEnCarrito.filter(producto => {
        if (colorBoton !== '') {
            // Si se seleccionó un color, comparar ID y color
            return !(producto.id === idBoton && producto.colorSeleccionado === colorBoton);
        } else {
            // Si no hay color, eliminar solo el producto sin color (productos sin color seleccionado)
            return !(producto.id === idBoton && !producto.colorSeleccionado);
        }
    });

    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.descuento * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    // Aquí se enviará el mensaje por WhatsApp, sin vaciar el carrito
    const mensaje = productosEnCarrito.map(producto => {
        const colorTexto = producto.colorSeleccionado ? `${obtenerNombreColor(producto.colorSeleccionado)}` : '';
        return ` > ${producto.cantidad} ${producto.titulo} ${colorTexto}`;
    }).join('\n');
    const numeroWhatsApp = '965474880';
    const url = `https://api.whatsapp.com/send/?phone=${numeroWhatsApp}&text=Hola,%20me%20gustaría%20comprar%20los%20siguientes%20productos%3A%0A${encodeURIComponent(mensaje)}&type=phone_number&app_absent=0`;

    window.open(url, '_blank');
}
