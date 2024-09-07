let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        // Si el producto tiene un descuento, muestra el precio original tachado
        const precioHTML = producto.descuento ?
            `<p class="producto-precio"><span class="precio-original">S/${producto.precio}</span> S/${producto.descuento}</p>` :
            `<p class="producto-precio">S/${producto.precio}</p>`;

        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                ${precioHTML}
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const productoId = e.currentTarget.id;
            const producto = productos.find(p => p.id === productoId);
            if (producto) {
                openModal(producto); // Llamar a la función para abrir el modal
            }
        });
    });
}

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

// Esta función debe estar en el archivo modal.js, pero se incluye aquí para referencia
function agregarAlCarrito(producto, cantidad, colorSeleccionado) {
    const productoEnCarrito = {
        ...producto,
        cantidad,
        colorSeleccionado
    };

    const index = productosEnCarrito.findIndex(p => p.id === producto.id && p.colorSeleccionado === colorSeleccionado);
    if (index !== -1) {
        productosEnCarrito[index].cantidad += cantidad;
    } else {
        productosEnCarrito.push(productoEnCarrito);
    }

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    actualizarNumerito();
}
