const crearBtn = document.querySelector(".crear-form-registro");

document.addEventListener("DOMContentLoaded", () => {

    if(window.indexedDB.open("factura", 1)) {
        obtenerRegistros("productos");

        setTimeout(() => {
            mostrarRegistros(productos, "productos");
        }, 1000);
    }
        
    crearBtn.addEventListener("click", validarRegistro);
});


function validarRegistro(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombreInput").value;

    if(nombre === "") {
        imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }

    // Crear un objeto con la información
    const registro = {
        nombre
    }

    if(id) {
        registro.id = id;

        editarRegistro(registro, "productos");

        crearBtn.textContent = "Crear";

        id = "";
    } else {
        registro.id = Date.now();

        insertarRegistro(registro, "productos");
    }

    reiniciar();
}


function llenarCampos(objeto) {

    const { nombre } = objeto;

    document.querySelector("#nombreInput").value = nombre;
    
    if(id) {
        crearBtn.textContent = "Editar Registro";
    }
}

function reiniciar() {
    document.querySelector("#nombreInput").value = "";
}