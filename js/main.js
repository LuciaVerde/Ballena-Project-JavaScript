//array que almacenará los productos obtenidos del archivo JSON
let productos = [];

//obtención de datos desde el archivo JSON y carga inicial de productos
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

//elementos del DOM
const contenedorProductos = document.getElementById("contenedorProductos");
const botonesCategorias = document.querySelectorAll(".botonCategoria");
const tituloCategoria = document.getElementById("tituloCategoria");
let botonesAgregar = document.querySelectorAll(".botonAgregar");
const numerito = document.getElementById("numerito");

//funcion para cargar los productos a la interfaz
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
            <button class="botonAgregar mx-3" id="${producto.id}">Agregar</button>
            
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

cargarProductos(productos);

// Event listeners para los botones de categorías
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
    //remover la clase "active" de todos los botones de categoría para desactivar la selección anterior y luego agregar dicha clse al botón que fue elegido
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        //si el boton no es el de "todos" busca el primer producto cque pertenezca a  la categoria seleccionada y cambia el subtitulo    
        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloCategoria.innerText = productoCategoria.categoria.nombre;
            //filtro de la lista de productos para mostrar solo los productos de la categoría seleccionada
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
            //si el boton clickeado es el de "todos" se actualiza el subtitulo
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
        destination: "carrito.html",
        newWindow: false, 
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
        },
        onClick: function () {
            window.location.href = this.destination; 
        }
    }).showToast();

    //obtiene el ID del botón que se eligió
    const idBoton = e.currentTarget.id;
    //busca el producto con ese ID en la lista de productos
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    //Chequea si el producto ya está en el carrito
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    // verifica si el producto ya está en el carrito y actualiza su cantidad, o lo añade al carrito
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        //si el producto no esta en el carrito lo agrega con una cantidad inicial de 1
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