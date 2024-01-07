const crearBtn = document.querySelector(".crear-form-registro");

document.addEventListener("DOMContentLoaded", () => {

    if(window.indexedDB.open("factura", 1)) {
        obtenerRegistros("clientes");

        setTimeout(() => {
            mostrarRegistros(clientes, "clientes");
        }, 1000);
    }
        
    crearBtn.addEventListener("click", validarRegistro);
});


function validarRegistro(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombreInput").value;
    const direccion = document.querySelector("#direccionInput").value;
    const rif = document.querySelector("#rifInput").value;
    const codigo = document.querySelector("#codigoInput").value;
    const telefono = document.querySelector("#telefonoInput").value;

    if(nombre === "" || direccion === "" || rif === "" || codigo === "" || telefono === "") {
        imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }

    // Crear un objeto con la información
    const registro = {
        nombre,
        direccion,
        rif,
        codigo,
        telefono
    }

    if(id) {
        registro.id = id;

        editarRegistro(registro, "clientes");

        crearBtn.textContent = "Crear";

        id = "";
    } else {
        registro.id = Date.now();

        insertarRegistro(registro, "clientes");
    }

    reiniciar();
}


function llenarCampos(objeto) {

    const { nombre, direccion, rif, codigo, telefono } = objeto;

    document.querySelector("#nombreInput").value = nombre;
    document.querySelector("#direccionInput").value = direccion;
    document.querySelector("#rifInput").value = rif;
    document.querySelector("#codigoInput").value = codigo;
    document.querySelector("#telefonoInput").value = telefono;

    if(id) {
        crearBtn.textContent = "Editar Registro";
    }
}

function reiniciar() {
    document.querySelector("#nombreInput").value = "";
    document.querySelector("#direccionInput").value = "";
    document.querySelector("#rifInput").value = "";
    document.querySelector("#codigoInput").value = "";
    document.querySelector("#telefonoInput").value = "";
}