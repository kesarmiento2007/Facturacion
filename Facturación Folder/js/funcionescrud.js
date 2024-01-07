let DB;

let id;

let clientes = [];
let productos = [];
let vendedores = [];

const lista = document.querySelector(".lista");


document.addEventListener("DOMContentLoaded", () => {

    crearDB();
});


function insertarRegistro(objeto, tabla) {

    const transaction = DB.transaction([tabla], "readwrite");  // Se selecciona la tabla, y no la base de datos
    const objectStore = transaction.objectStore(tabla);

    objectStore.add(objeto);

    transaction.onerror = function() {
        imprimirAlerta("No se pudo Insertar el Registro", "error");
    }

    transaction.oncomplete = function() {
        imprimirAlerta("Registro Agregado Correctamente");

        limpiarHTML(lista);

        obtenerRegistros(tabla);

        setTimeout(() => {
            elegirTabla(tabla);
        }, 600);
    }
}

function obtenerRegistros(tabla) {

    const abrirConexion = window.indexedDB.open("factura", 1);
    abrirConexion.onerror = function() {
        console.log("Hubo un error");
    }

    let objectStore;

    switch( tabla ) {

        case "clientes":

            clientes = [];

            abrirConexion.onsuccess = function() {  // Hay que hacer esto para obtener los datos
                DB = abrirConexion.result;
    
                objectStore = DB.transaction(tabla).objectStore(tabla);
    
                objectStore.openCursor().onsuccess = function(e) {
                    const cursor = e.target.result;
    
                    if(cursor) {
                        clientes.unshift(cursor.value);
                        cursor.continue();
                    } else {
                        console.log("No hay más registros");
                    }
                }
            }

        break;

        case "productos":

            productos = [];

            abrirConexion.onsuccess = function() {
                DB = abrirConexion.result;

                objectStore = DB.transaction(tabla).objectStore(tabla);

                objectStore.openCursor().onsuccess = function(e) {
                    const cursor = e.target.result;

                    if(cursor) {
                        productos.unshift(cursor.value);
                        cursor.continue();
                    } else {
                        console.log("No hay más registros");
                    }   
                }   
            }

        break;

        case "vendedores":
            
            vendedores = [];

            abrirConexion.onsuccess = function() {
                DB = abrirConexion.result;
    
                objectStore = DB.transaction(tabla).objectStore(tabla);
    
                objectStore.openCursor().onsuccess = function(e) {
                    const cursor = e.target.result;
    
                    if(cursor) {
                        vendedores.unshift(cursor.value);
                        cursor.continue();
                    } else {
                        console.log("No hay más registros");
                    }
                }
            }

        break;

        default: console.log("No existe esa tabla"); break;
    }
}

function editarRegistro(objeto, tabla) {
    const transaction = DB.transaction([tabla], "readwrite");
    const objectStore = transaction.objectStore(tabla);

    objectStore.put(objeto);

    transaction.onerror = function() {
        imprimirAlerta("No se pudo Editar el Registro", "error");
    }

    transaction.oncomplete = function() {
        imprimirAlerta("Registro Editado Correctamente");

        limpiarHTML(lista);

        obtenerRegistros(tabla);

        setTimeout(() => {
            elegirTabla(tabla);
        }, 600);
    }
}

function eliminarRegistro(id, tabla) {

    const confirmar = confirm("Deseas eliminar este registro?");

    if(confirmar) {
        const transaction = DB.transaction([tabla], "readwrite");
        const objectStore = transaction.objectStore(tabla);

        objectStore.delete(id);

        transaction.onerror = function() {
            imprimirAlerta("No se pudo Eliminar el Registro", "error");
        }

        transaction.oncomplete = function() {
            imprimirAlerta("Registro Eliminado Correctamente");

            limpiarHTML(lista);

            obtenerRegistros(tabla);

            setTimeout(() => {
                elegirTabla(tabla);
            }, 600);
        }
    }
}


function crearDB() {
    const crearDB = window.indexedDB.open("factura", 1);

    crearDB.onerror = function() {
        console.log("Hubo un error creando la base de datos");
    }

    crearDB.onsuccess = function() {
        DB = crearDB.result;
    }

    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        // Crear tabla de clientes
        const objectStoreClientes = db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true });

        objectStoreClientes.createIndex("nombre", "nombre", { unique: true });
        objectStoreClientes.createIndex("direccion", "direccion", { unique: false });
        objectStoreClientes.createIndex("rif", "rif", { unique: false });
        objectStoreClientes.createIndex("codigo", "codigo", { unique: false });
        objectStoreClientes.createIndex("telefono", "telefono", { unique: false });
        objectStoreClientes.createIndex("id", "id", { unique: true });

        // Crear Tabla de productos
        const objectStoreProductos = db.createObjectStore("productos", { keyPath: "id", autoIncrement: true });

        objectStoreProductos.createIndex("nombre", "nombre", { unique: true });
        objectStoreProductos.createIndex("id", "id", { unique: true });

        // Crear Tabla de vendedores
        const objectStoreVendedores = db.createObjectStore("vendedores", { keyPath: "id", autoIncrement: true });

        objectStoreVendedores.createIndex("nombre", "nombre", { unique: true });
        objectStoreVendedores.createIndex("id", "id", { unique: true });

        //console.log("Base de datos Creada y Lista");
        imprimirAlerta("Base de Datos Creada");
    }
}


// Mostrar registros
function mostrarRegistros(objeto, tabla) {

    objeto.forEach(objeto => {
        const registro = document.createElement("DIV");
        registro.classList.add("registro");

        const nombre = document.createElement("P");
        nombre.classList.add("nombre", "mayuscula");
        nombre.textContent = objeto.nombre;

        const contenedorBtn = document.createElement("DIV");
        contenedorBtn.classList.add("botones");

        const editarBtn = document.createElement("BUTTON");
        editarBtn.classList.add("editar", "btn");
        editarBtn.textContent = "Editar";
        editarBtn.onclick = function(e) {
            e.preventDefault();
            id = objeto.id;
            llenarCampos(objeto);
        }

        const eliminarBtn = document.createElement("BUTTON");
        eliminarBtn.classList.add("eliminar", "btn");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.onclick = function(e) {
            e.preventDefault();
            eliminarRegistro(objeto.id, tabla);
        }

        // Juntar elementos
        registro.appendChild(nombre);
        contenedorBtn.appendChild(editarBtn);
        contenedorBtn.appendChild(eliminarBtn);
        registro.appendChild(contenedorBtn);
        
        // Insertar registro
        lista.appendChild(registro);
    });
}

// Elegir tabla
function elegirTabla(tabla) {
    
    switch(tabla) {
        case "clientes": mostrarRegistros(clientes, "clientes"); break;
        case "productos": mostrarRegistros(productos, "productos"); break;
        case "vendedores": mostrarRegistros(vendedores, "vendedores"); break;

        default: console.log("No existe esa tabla"); break;
    }
}

// Limpiar el HTML
function limpiarHTML(html) {
    while(html.firstChild) {
        html.removeChild(html.firstChild);
    }
}

// Mensaje error
function mensajeError(error, elemento, claseError) {
    const mensajeError = document.createElement("P");
    mensajeError.textContent = error;
    if(claseError) mensajeError.classList.add("error");

    // Insertar en el contenido
    elemento.appendChild(mensajeError);
    
    if(claseError) {
        setTimeout(() => {
            mensajeError.remove();
        }, 3000);
    }
}

// Alerta
function imprimirAlerta(mensaje, tipo) {
    const msj = document.querySelector(".msj");

    const alerta = msj.querySelector(".alerta");

    if(!alerta) {
        // Crear alerta
        const Pmensaje = document.createElement("P");
        Pmensaje.classList.add("alerta");

        if(tipo === "error") {
            Pmensaje.classList.add("error");
        } else {
            Pmensaje.classList.add("success");
        }

        Pmensaje.textContent = mensaje;

        msj.appendChild(Pmensaje);

        setTimeout(() => {
            Pmensaje.remove();
        }, 3000);
    }
}


function llenarSelect() {
    const abrirConexion = window.indexedDB.open("factura", 1);

    abrirConexion.onerror = function() {
        console.log("Hubo un error");
    }

    abrirConexion.onsuccess = function() {
        const select = document.querySelector("#vendedor");
        const db = abrirConexion.result;

        const objectStore = db.transaction("vendedores").objectStore("vendedores");

        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                const existe = document.querySelector(".vendedor-option") || false;

                const option = document.createElement("OPTION");
                option.value = cursor.value.nombre;
                option.textContent = cursor.value.nombre;
                option.classList.add("vendedor-option");

                if(existe) {
                    select.insertBefore(option, existe);
                } else {
                    select.appendChild(option);
                }

                cursor.continue();
            } else {
                console.log("No hay más registros");
            }
        }
    }
}