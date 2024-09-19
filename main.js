// Array of products
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
    // Agrega más productos aquí según sea necesario
];

// Variables
let carrito = [];
const impuestoFijo = 21;

// Function to add a product to the cart
function agregarAlCarrito(idProducto, cantidad) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        const productoEnCarrito = carrito.find(p => p.id === idProducto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        console.log(`${producto.nombre} agregado al carrito.`);
        actualizarTablaCarrito();
    } else {
        console.log("Producto no encontrado.");
    }
}

// Function to calculate the total cart value with discount and tax
function calcularTotalCarrito(descuento) {
    let subtotal = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    let totalConDescuento = subtotal;

    if (descuento > 0) {
        totalConDescuento = subtotal - (subtotal * (descuento / 100));
    }
    let totalConImpuestos = totalConDescuento + (totalConDescuento * (impuestoFijo / 100));
    return totalConImpuestos.toFixed(2); 
}

// Function to display the cart contents in the table
function actualizarTablaCarrito() {
    const tbody = document.querySelector('.carrito-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

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

// Event delegation for removing products and updating quantities
document.querySelector('.carrito-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const idProducto = parseInt(event.target.dataset.id);
        carrito = carrito.filter(producto => producto.id !== idProducto);
        actualizarTablaCarrito();
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
        }
    }
});

// Example usage: add some products to the cart (for demonstration)
agregarAlCarrito(1, 1);
agregarAlCarrito(2, 2);

// Uncomment to enable user interaction
// interactuarConUsuario();
