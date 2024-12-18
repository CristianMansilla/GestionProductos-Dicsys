const apiUrl = "https://www.NegocioDicsys.somee.com/api/Productos";

let idProductoEditar = null; 

// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", cargarProductos);

async function cargarProductos() {
    const response = await fetch(`${apiUrl}/listar`);
    const productos = await response.json();

    const tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    productos.forEach(producto => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>$${producto.precio}</td>
            <td class="actions">
                <button class="btn-edit" onclick="cargarFormularioEditar(${producto.id})"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-delete" onclick="eliminarProducto(${producto.id})"><i class="fas fa-trash-alt"></i> Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

async function cargarFormularioEditar(id) {
    const response = await fetch(`${apiUrl}/ver?id=${id}`);
    const producto = await response.json();

    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;

    idProductoEditar = id;

    document.querySelector("#formCrear button").textContent = "Actualizar Producto";
}

// Agregar o actualizar un producto
document.getElementById("formCrear").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);

    const producto = { nombre, descripcion, precio };

    if (idProductoEditar) {
        // Editar producto existente
        await fetch(`${apiUrl}/editar?id=${idProductoEditar}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        // Restablecer estado de edición
        idProductoEditar = null;
        document.querySelector("#formCrear button").textContent = "Agregar Producto";
    } else {
        // Crear nuevo producto
        await fetch(`${apiUrl}/crear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
    }

    cargarProductos();
    e.target.reset();
});


async function eliminarProducto(id) {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");

    if (confirmar) {
        await fetch(`${apiUrl}/eliminar?id=${id}`, {
            method: "DELETE"
        });

        cargarProductos();
    }
}