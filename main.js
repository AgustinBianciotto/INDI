// Array de productos
const productos = [
    { id: 1, nombre: "Campera elegante y moderna", precio: 50.00 },
    { id: 2, nombre: "Campera deportiva", precio: 45.00 },
    { id: 3, nombre: "Campera de cuero", precio: 80.00 },
    { id: 4, nombre: "Campera casual", precio: 60.00 },
    { id: 5, nombre: "Buzo con capucha", precio: 40.00 },
    { id: 6, nombre: "Buzo deportivo", precio: 35.00 },
    { id: 7, nombre: "Buzo informal", precio: 30.00 },
    { id: 8, nombre: "Remera de algodón", precio: 20.00 },
    { id: 9, nombre: "Remera estampada", precio: 25.00 },
    { id: 10, nombre: "Remera básica", precio: 18.00 },
    { id: 11, nombre: "Remera de colores", precio: 22.00 }
];

// Carrito
let carrito = [];

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Función para agregar un producto al carrito
function agregarAlCarrito(idProducto, size) {
    const producto = productos.find(p => p.id === idProducto);
    
    if (producto) {
        const { id, nombre, precio } = producto;
        const productoEnCarrito = carrito.find(p => p.id === id && p.size === size);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            carrito.push({ id, nombre, precio, size, cantidad: 1 });
        }
        
        mostrarNotificacion(`${nombre} agregado al carrito.`);
        actualizarTablaCarrito();
        guardarCarrito();
    } else {
        console.log("Producto no encontrado.");
    }
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0).toFixed(2);
}

// Función para mostrar el contenido del carrito en la tabla
function actualizarTablaCarrito() {
    const tbody = document.querySelector('.carrito-table tbody');
    tbody.innerHTML = ''; // Limpiar filas existentes

    carrito.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.nombre} (${producto.size})</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" class="cantidad-input" data-id="${producto.id}" data-size="${producto.size}">
            </td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            <td><button class="btn-eliminar" data-id="${producto.id}" data-size="${producto.size}">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });

    const total = calcularTotalCarrito();
    document.querySelector('.carrito-resumen p').innerHTML = `<strong>Total:</strong> $${total}`;
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    actualizarTablaCarrito();
}

// Delegación de eventos para eliminar productos y actualizar cantidades
document.querySelector('.carrito-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const idProducto = parseInt(event.target.dataset.id);
        const sizeProducto = event.target.dataset.size;
        carrito = carrito.filter(producto => !(producto.id === idProducto && producto.size === sizeProducto));
        actualizarTablaCarrito();
        guardarCarrito();
        mostrarNotificacion("Producto eliminado del carrito.");
    }
});

document.querySelector('.carrito-table').addEventListener('input', function(event) {
    if (event.target.classList.contains('cantidad-input')) {
        const idProducto = parseInt(event.target.dataset.id);
        const sizeProducto = event.target.dataset.size;
        const cantidad = parseInt(event.target.value);
        
        const producto = carrito.find(p => p.id === idProducto && p.size === sizeProducto);
        if (producto) {
            if (cantidad <= 0) {
                carrito = carrito.filter(p => !(p.id === idProducto && p.size === sizeProducto));
                mostrarNotificacion("Producto eliminado del carrito.");
            } else {
                producto.cantidad = cantidad;
            }
            actualizarTablaCarrito();
            guardarCarrito();
        }
    }
});

// Cargar el carrito al inicio
cargarCarrito();
