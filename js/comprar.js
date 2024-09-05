// Función para enviar el mensaje a WhatsApp
function enviarMensajeWhatsApp(mensaje) {
    const numeroWhatsApp = "965474880";
    const enlaceWhatsApp = `https://api.whatsapp.com/send/?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}&type=phone_number&app_absent=0`;
    window.open(enlaceWhatsApp, '_blank');
}

// Función para construir el mensaje con los productos y colores
function construirMensaje() {
    let mensaje = "Hola, me gustaría comprar los siguientes productos:\n\n";
    const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    productosEnCarrito.forEach(producto => {
        mensaje += `Nombre: ${producto.titulo}\nCantidad: ${producto.cantidad}\n`;
        if (producto.colorSeleccionado) { // Verifica si el producto tiene un color seleccionado
            mensaje += `Color: ${producto.colorSeleccionado}\n`;
        }
        mensaje += `\n`; // Añade una línea en blanco entre productos
    });

    return mensaje;
}

// Añadir un evento click al botón de comprar
document.getElementById("carrito-acciones-comprar").addEventListener("click", function() {
    const mensaje = construirMensaje();
    enviarMensajeWhatsApp(mensaje);
});
