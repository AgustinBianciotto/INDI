// Array de productos
const productos = [
    { id: 1, nombre: "Camisa de Algodón", precio: 30.00 },
    { id: 2, nombre: "Pantalón de Jeans", precio: 40.00 },
    { id: 3, nombre: "Sombrero", precio: 15.00 },
    { id: 4, nombre: "Campera Deportiva", precio: 45.00 },
    { id: 5, nombre: "Campera Elegante y Moderna", precio: 50.00 },
    { id: 6, nombre: "Campera de Cuero", precio: 80.00 },
    { id: 7, nombre: "Campera Casual", precio: 60.00 },
    { id: 8, nombre: "Buzo con Capucha", precio: 40.00 },
    { id: 9, nombre: "Buzo Deportivo", precio: 35.00 },
    { id: 10, nombre: "Buzo Informal", precio: 30.00 },
    { id: 11, nombre: "Remera de Algodón", precio: 20.00 },
    { id: 12, nombre: "Remera Estampada", precio: 25.00 },
    { id: 13, nombre: "Remera Básica", precio: 18.00 },
    { id: 14, nombre: "Remera de Colores", precio: 22.00 }
];

// Variables
let carrito = [];
const impuestoFijo = 21;

// Función para agregar un producto al carrito
function agregarAlCarrito(idProducto, cantidad) {
    const producto = productos.find(p => p.id === idProducto);
    
    if (producto) {
        const { id, nombre, precio } = producto;
        const productoEnCarrito = carrito.find(p => p.id === id);
        productoEnCarrito 
            ? productoEnCarrito.cantidad += cantidad 
            : carrito.push({ id, nombre, precio, cantidad });
        
        console.log(`${nombre} agregado al carrito.`);
        actualizarTablaCarrito();
    } else {
        console.log("Producto no encontrado.");
    }
}

// Función para calcular el valor total del carrito con descuento e impuesto
function calcularTotalCarrito(descuento) {
    const subtotal = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    const totalConDescuento = descuento > 0 ? subtotal - (subtotal * (descuento / 100)) : subtotal;
    const totalConImpuestos = totalConDescuento + (totalConDescuento * (impuestoFijo / 100));
    return totalConImpuestos.toFixed(2); 
}

// Función para mostrar el contenido del carrito en la tabla
function actualizarTablaCarrito() {
    const tbody = document.querySelector('.carrito-table tbody');
    tbody.innerHTML = ''; // Limpiar filas existentes

    carrito.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" class="cantidad-input" data-id="${producto.id}">
            </td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            <td><button class="btn-eliminar" data-id="${producto.id}">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });

    const total = calcularTotalCarrito(0);
    document.querySelector('.carrito-resumen p').innerHTML = `<strong>Total:</strong> $${total}`;
}

// Función para notificar resultados en el HTML
function notificarResultado(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.classList.add('notificacion');
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    actualizarTablaCarrito();
}

// Delegación de eventos para eliminar productos y actualizar cantidades
document.querySelector('.carrito-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const idProducto = parseInt(event.target.dataset.id);
        carrito = carrito.filter(producto => producto.id !== idProducto);
        actualizarTablaCarrito();
        guardarCarrito();
    }
});

document.querySelector('.carrito-table').addEventListener('input', function(event) {
    if (event.target.classList.contains('cantidad-input')) {
        const idProducto = parseInt(event.target.dataset.id);
        const cantidad = parseInt(event.target.value);
        const producto = carrito.find(p => p.id === idProducto);
        if (producto) {
            producto.cantidad = cantidad;
            if (cantidad <= 0) {
                carrito = carrito.filter(p => p.id !== idProducto);
            }
            actualizarTablaCarrito();
            guardarCarrito();
        }
    }
});

// Manejar evento de clic para el botón de pago
document.querySelector('.btn-pagar').addEventListener('click', function() {
    const total = calcularTotalCarrito(0);
    notificarResultado(`El total de su compra es $${total}. ¡Gracias por comprar con nosotros!`);
});

// Cargar el carrito cuando la página se carga
window.addEventListener('load', cargarCarrito);

// Ejemplo de uso: agregar algunos productos al carrito (para demostración)
agregarAlCarrito(1, 1);
agregarAlCarrito(2, 2);
