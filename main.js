// Variables globales para almacenar productos y carrito
let productos = [
    { id: 1, nombre: "Campera elegante y moderna", precio: 50.0 },
    { id: 2, nombre: "Campera deportiva", precio: 45.0 },
    { id: 3, nombre: "Campera de cuero", precio: 80.0 },
    { id: 4, nombre: "Campera casual", precio: 60.0 },
    { id: 5, nombre: "Buzo con capucha", precio: 40.0 },
    { id: 6, nombre: "Buzo deportivo", precio: 35.0 },
    { id: 7, nombre: "Buzo informal", precio: 30.0 },
    { id: 8, nombre: "Remera de algodón", precio: 20.0 },
    { id: 9, nombre: "Remera estampada", precio: 25.0 },
    { id: 10, nombre: "Remera básica", precio: 18.0 },
    { id: 11, nombre: "Remera de colores", precio: 22.0 },
  ];
  
  function obtenerCarrito() {
      const carritoGuardado = localStorage.getItem("carrito");
      carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  
      return carrito
  }
  
  // Función para cargar productos desde un archivo JSON
  function cargarProductos() {
    fetch("../productos.json", {  //NO ANDA POR ERROR DE CORS
      headers: {
        "Access-Control-Allow-Origin": "null",
      },
    }) 
      .then((response) => response.json())
      .then((data) => {
        productos = data;
        console.log("Productos cargados:", productos); // Verifica que los productos se carguen
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });
  }
  
  // Función para mostrar notificaciones con SweetAlert2
  function mostrarNotificacion(mensaje, tipo = "success") {
    Swal.fire({
      position: "top-end",
      icon: tipo,
      title: mensaje,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  
  // Función para agregar un producto al carrito
  function agregarAlCarrito(idProducto, size) {
    const producto = productos.find((p) => p.id === idProducto);
  
    if (producto) {
      const { id, nombre, precio } = producto;
      let carrito = obtenerCarrito()
      const productoEnCarrito = carrito.find(p => p.id === id && p.size === size);
  
      // Si el producto ya está en el carrito, aumenta la cantidad
      if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
      } else {
        // Si no está, se añade un nuevo producto al carrito
        carrito.push({ id, nombre, precio, size, cantidad: 1 });
      }
  
      mostrarNotificacion(`${nombre} agregado al carrito.`);
      guardarCarrito(); // Guarda el carrito en localStorage
    } else {
      console.log("Producto no encontrado.");
    }
  }
  
  // Función para calcular el total del carrito
  function calcularTotalCarrito() {
    return carrito
      .reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
      .toFixed(2);
  }
  
  // Función para mostrar el contenido del carrito en la tabla
  function actualizarTablaCarrito() {
      
    const tbody = document.querySelector("#carrito-body");
    tbody.innerHTML = ""; // Limpiar filas existentes
      const carrito = obtenerCarrito()
    // Crear una fila para cada producto en el carrito
    carrito.forEach((producto) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${producto.nombre} (${producto.size})</td>
              <td>$${producto.precio.toFixed(2)}</td>
              <td>
                  <input type="number" value="${
                    producto.cantidad
                  }" min="1" class="cantidad-input" data-id="${
        producto.id
      }" data-size="${producto.size}">
              </td>
              <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
              <td><button class="btn-eliminar" data-id="${
                producto.id
              }" data-size="${producto.size}">Eliminar</button></td>
          `;
      tbody.appendChild(tr);
    });
  
    // Mostrar el total del carrito
    const total = calcularTotalCarrito();
    document.querySelector(
      ".carrito-resumen p"
    ).innerHTML = `<strong>Total:</strong> $${total}`;
  }
  
  // Función para guardar el carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  
    // Delegación de eventos para eliminar productos y actualizar cantidades
    document
      .querySelector(".carrito-table")
      .addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-eliminar")) {
          const idProducto = parseInt(event.target.dataset.id);
          const sizeProducto = event.target.dataset.size;
          carrito = carrito.filter(
            (producto) =>
              !(producto.id === idProducto && producto.size === sizeProducto)
          );
          guardarCarrito();
          mostrarNotificacion("Producto eliminado del carrito.", "warning");
          actualizarTablaCarrito();
        }
      });
  
    document
      .querySelector(".carrito-table")
      .addEventListener("input", function (event) {
        if (event.target.classList.contains("cantidad-input")) {
          const idProducto = parseInt(event.target.dataset.id);
          const sizeProducto = event.target.dataset.size;
          const cantidad = parseInt(event.target.value);
  
          const producto = carrito.find(
            (p) => p.id === idProducto && p.size === sizeProducto
          );
          if (producto) {
            if (cantidad <= 0) {
              carrito = carrito.filter(
                (p) => !(p.id === idProducto && p.size === sizeProducto)
              );
              mostrarNotificacion("Producto eliminado del carrito.", "warning");
            } else {
              producto.cantidad = cantidad;
            }
            guardarCarrito();
            actualizarTablaCarrito();
          }
        }
      });
  