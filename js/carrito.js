//obtener productos del carrito desde el almacenamiento local
let productosEnElCarrito = localStorage.getItem("productos-en-carrito");
productosEnElCarrito = JSON.parse(productosEnElCarrito);

//elementos del DOM
const contenedorCarritoVacio = document.getElementById("carritoVacio");
const contenedorCarritoProductos = document.getElementById("carritoProductos");
const contenedorCarritoAcciones = document.getElementById("carritoAcciones");
const contenedorCarritoComprado = document.getElementById("carritoComprado");
let botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");
const botonVaciar = document.getElementById("botonVaciarCarrito");
const contenedorTotal = document.getElementById("total");
const botonComprar = document.getElementById("botonComprarCarrito");

//funcion para cargar productos en el carrito 
function cargarProductosCarrito() {
    //verificar si hay productos en el carrito
    if (productosEnElCarrito && productosEnElCarrito.length > 0) {

        // Mostrar elementos del carrito si hay productos
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        
        //limpiar la sección de productos del carrito
        contenedorCarritoProductos.innerHTML = "";

        // Iterar sobre los productos en el carrito para mostrarlos en la interfaz
        productosEnElCarrito.forEach(producto => {
            //crear elementos HTML para cada producto en el carrito
            const div = document.createElement("div");
            div.classList.add("carritoProducto");
            div.innerHTML = `
                <img class="carritoProductoImagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carritoProductoTitulo">
                    <small class="titulo">Titulo</small>
                    <p>${producto.titulo}</p>
                </div>
                <div class="carritoProductoCantidad">
                    <small>Cantidad</small>
                    <div class ="botonesCantidad">
                        <button class="botonRestar"> - </button> 
                        <p class= "px-2">${producto.cantidad}</p>
                        <button class="botonSumar"> + </button>
                    </div> 
                </div>

                <div class="carritoProductoSubtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carritoProductoEliminar" id="${producto.id}"> <i class="fa-solid fa-trash-can"></i></button>   
            `;

            //captura y funcionalidades de botones de sumar y restar
            const restar = div.querySelector(".botonRestar");
            const sumar = div.querySelector(".botonSumar");

            //resta
            restar.addEventListener("click", () => {
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnElCarrito));
                    cargarProductosCarrito();
                }
            });

            // suma
            sumar.addEventListener("click", () => {
                producto.cantidad++;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnElCarrito));
                cargarProductosCarrito();
            });

            contenedorCarritoProductos.append(div);

        })

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();


//funcion para actualizar botones eliminar
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });

}

//funcion para eliminar items del carrito
function eliminarDelCarrito(e) {

    Toastify({
        text: "Producto eliminado",
        offset: {
            x: 30,
            y: 80,
        },
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
        },
        onClick: function () { }
    }).showToast();


    const idBoton = e.currentTarget.id;
    const index = productosEnElCarrito.findIndex(producto => producto.id === idBoton);
    productosEnElCarrito.splice(index, 1);

    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnElCarrito));

}


//funcion para actualizar el total
function actualizarTotal() {
    const totalCalculado = productosEnElCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}
    `;
}

// acción al hacer click en el botón "Vaciar carrito": muestra un mensaje de confirmación para vaciar el carrito, elimina todos los productos, actualiza la vista del carrito y muestra un mensaje de éxito tras vaciarlo
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vacíalo'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnElCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnElCarrito));
            cargarProductosCarrito();
            Swal.fire(
                '¡Listo!',
                '¡Tu carrito ha sido vaciado!',
                'success'
            )
        }
    })
}


// acción al hacer click en el botón "Comprar ahora": confirma la compra, vacía el carrito,actualiza la visualización, y muestra un mensaje de éxito
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Tu compra ha sido realizada',
        showConfirmButton: false,
        timer: 1500
    });

    productosEnElCarrito.length = 0;
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnElCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}