let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

const contenedorProductos = document.getElementById("contenedorProductos");
const botonesCategorias = document.querySelectorAll(".botonCategoria");
const tituloCategoria = document.getElementById("tituloCategoria");
let botonesAgregar = document.querySelectorAll(".botonAgregar");
const numerito = document.getElementById("numerito");

//funcion para cargar los productos 
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto", "col-lg-4", "col-md-6", "col-sm-12");
        div.innerHTML = `
            <img class="productoImagen img-fluid" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="productoDetalles px-3">
             <div class="d-flex justify-content-between">
                <h3 class="productoTitulo"> ${producto.titulo}</h3>
                <p class="productoPrecio">USD $${producto.precio}</p>
                </div>
            <div class="row">
                <p class="productoDescripcion col-md-9"> ${producto.descripcion}</p>
            </div>
            </div>
            <div class="d-flex justify-content-between px-3">
                <button class="botonAgregar" id="${producto.id}">Agregar</button>
                <i class="fa-regular fa-heart d-flex align-items-center"></i>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

cargarProductos(productos);

//botones categorias
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloCategoria.innerText = productoCategoria.categoria.nombre;

            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloCategoria.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
});

//funcion agregar productos al carrito
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".botonAgregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");


if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();

} else {
    productosEnCarrito = [];
}

//funcion agregar al carrito
function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        offset: {
            x: 30,
            y: 80
        },
        duration: 3000,
        destination: "carrito.html", // Página a la que quieres redirigir
        newWindow: false, // Abre la página en la misma ventana
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
        },
        onClick: function () {
            window.location.href = this.destination; // Redirige al hacer clic en el toast
        }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

//función para actualizar del numerito del carrito
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}