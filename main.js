// Cargar datos desde localStorage si existen
const productos = [
  { id: 1, nombre: "Base de Maquillaje", precio: 500, puntos: 50, imagen: "fotos/base.webp" },
  { id: 2, nombre: "Labial Mate", precio: 300, puntos: 30, imagen: "fotos/labialmate.webp" },
  { id: 3, nombre: "Sombras", precio: 700, puntos: 70, imagen: "fotos/sombras.avif" },
];

// Inicializar usuarios y carrito desde localStorage
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null; // Guarda el usuario logueado

// Elementos del DOM
const formRegistro = document.getElementById("formRegistro");
const listaProductos = document.getElementById("listaProductos");
const listaCarrito = document.getElementById("listaCarrito");
const totalPrecio = document.getElementById("totalPrecio");
const botonVaciarCarrito = document.getElementById("vaciarCarrito");
const botonFinalizarCompra = document.getElementById("finalizarCompra");
const botonConsultarPuntos = document.getElementById("consultarPuntos");
const correoConsulta = document.getElementById("correoConsulta");
const resultadoPuntos = document.getElementById("resultadoPuntos");
const mensaje = document.getElementById("mensaje");

// Función para mostrar mensajes en la interfaz
function mostrarMensaje(texto, tipo = "exito") {
    mensaje.textContent = texto;
    mensaje.className = tipo === "exito" ? "mensaje-exito" : "mensaje-error";
    mensaje.style.display = "block";

    setTimeout(() => {
        mensaje.style.display = "none";
    }, 3000);
}

// Mostrar productos en HTML
function mostrarProductos() {
    listaProductos.innerHTML = "";
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Puntos: ${producto.puntos}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Comprar</button>
        `;
        listaProductos.appendChild(div);
    });
}

formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("email").value.trim();

    // Expresión regular para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre === "") {
        mostrarMensaje("El nombre no puede estar vacío.", "error");
        return;
    }

    if (!emailRegex.test(correo)) {
        mostrarMensaje("Ingresa un correo electrónico válido.", "error");
        return;
    }

    if (usuarios.find(u => u.correo === correo)) {
        mostrarMensaje("Este correo ya está registrado.", "error");
        return;
    }

    const nuevoUsuario = { nombre, correo, puntos: 0 };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    usuarioActual = nuevoUsuario;
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

    mostrarMensaje(`¡Bienvenido(a), ${nombre}! Has sido registrado exitosamente.`, "exito");
    formRegistro.reset();
});

const emailInput = document.getElementById("email");

emailInput.addEventListener("input", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(emailInput.value)) {
        emailInput.classList.remove("error");
        emailInput.classList.add("correcto");
    } else {
        emailInput.classList.remove("correcto");
        emailInput.classList.add("error");
    }
});

function actualizarPuntos() {
  if (usuarioActual) {
      resultadoPuntos.textContent = `Hola, ${usuarioActual.nombre}. Tienes ${usuarioActual.puntos} puntos acumulados.`;
  } else {
      resultadoPuntos.textContent = "No hay usuario registrado.";
  }
}

// Agregar producto al carrito y acumular puntos
function agregarAlCarrito(id) {
    if (!usuarioActual) {
        mostrarMensaje("Debes registrarte antes de comprar.", "error");
        return;
    }

    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarMensaje(`${producto.nombre} ha sido agregado al carrito.`, "exito");
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    const productoEliminado = carrito[index].nombre;
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarMensaje(`${productoEliminado} ha sido eliminado del carrito.`, "error");
}



// Actualizar vista del carrito y calcular total
function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        listaCarrito.appendChild(li);
        total += producto.precio;
    });

    totalPrecio.textContent = `$${total}`;
}

// Botón de Checkout
botonFinalizarCompra.addEventListener("click", () => {
    if (!usuarioActual) {
        mostrarMensaje("Debes registrarte antes de comprar.", "error");
        return;
    }

    if (carrito.length === 0) {
        mostrarMensaje("Tu carrito está vacío.", "error");
        return;
    }

    // 1️⃣ Mostrar resumen del carrito antes de pagar
    let resumen = "Resumen de tu compra:\n";
    let totalCompra = 0;
    
    carrito.forEach(producto => {
        resumen += `${producto.nombre} - $${producto.precio}\n`;
        totalCompra += producto.precio;
    });

    resumen += `\nTotal a pagar: $${totalCompra}`;

    // 2️⃣ Simular un método de pago (ejemplo: tarjeta o efectivo)
    let metodoPago = prompt(`${resumen}\n\nElige un método de pago:\n1. Tarjeta\n2. Efectivo`);

    if (metodoPago !== "1" && metodoPago !== "2") {
        mostrarMensaje("Método de pago no válido.", "error");
        return;
    }

    // 3️⃣ Simulación de procesamiento de pago (confirmación)
    let confirmacion = confirm(`¿Confirmas el pago de $${totalCompra}?`);
    if (!confirmacion) {
        mostrarMensaje("Pago cancelado.", "error");
        return;
    }

    // 4️⃣ Asignar puntos y finalizar compra
    let puntosGanados = carrito.reduce((total, producto) => total + producto.puntos, 0);

    let usuarioIndex = usuarios.findIndex(u => u.correo === usuarioActual.correo);
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].puntos += puntosGanados;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        usuarioActual = usuarios[usuarioIndex];
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    }

    // 5️⃣ Vaciar carrito y mostrar mensaje de éxito
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    actualizarPuntos();

    mostrarMensaje(`¡Compra exitosa! Has ganado ${puntosGanados} puntos.`, "exito");
});

// Vaciar carrito
botonVaciarCarrito.addEventListener("click", () => {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarMensaje("El carrito ha sido vaciado.", "error");
});

// Consultar puntos de un usuario
botonConsultarPuntos.addEventListener("click", () => {
    const correo = correoConsulta.value;
    const usuario = usuarios.find(u => u.correo === correo);

    if (!usuario) {
        mostrarMensaje("Usuario no encontrado. Regístrese primero.", "error");
    } else {
        resultadoPuntos.textContent = `Hola, ${usuario.nombre}. Tienes ${usuario.puntos} puntos acumulados.`;
        mostrarMensaje(`Hola, ${usuario.nombre}. Tienes ${usuario.puntos} puntos acumulados.`, "exito");
    }
});

// Cargar productos y carrito al iniciar
mostrarProductos();
actualizarCarrito();