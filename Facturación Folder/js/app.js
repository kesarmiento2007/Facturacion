document.addEventListener("DOMContentLoaded", () => {

    if(window.indexedDB.open("factura", 1)) {
        obtenerRegistros("clientes");
        obtenerRegistros("productos");
        llenarSelect();
    }

    iniciarApp();
});

function iniciarApp() {

    const divFactura = document.createElement("DIV");

    const nombreCliente = document.querySelector("#nombre-cliente");
    const resultadosClientes = document.querySelector("#resultados-clientes");
    const vendedor = document.querySelector("#vendedor");
    const notaEntrega = document.querySelector("#notaEntrega");
    const fecha = document.querySelector("#fecha");
    const agregarBtn = document.querySelector(".agregar-btn");
    const eliminarBtn = document.querySelector(".eliminar-btn");
    const listaProductos = document.querySelector("#lista-productos");
    const crearBtn = document.querySelector(".crear-form");
    const reiniciarBtn = document.querySelector(".reiniciar-form");
    const resultadoBtn = document.querySelector(".resultado-form");
    

    // Eliminar Base de Datos
    const eliminarDB = document.querySelector(".eliminar-db");
    eliminarDB.addEventListener("click", () => {

        const confirmar = confirm("Estás seguro de que quieres eliminar la base de datos?");

        if(confirmar) {
            const transaction = indexedDB.deleteDatabase("factura");
            imprimirAlerta("Base de Datos Eliminada");
            eliminarDB.remove();
        }
    });

    if( localStorage.getItem("divFactura") ) {
        resultadoBtn.classList.add("visible");
    } else {
        resultadoBtn.classList.remove("visible");
    }

    const datos = {
        nombre: "",
        direccion: "",
        rif: "",
        codigo: "",
        telefono: "",
        vendedor: "",
        notaEntrega: "",
        fecha: "",
        productos: [],
        total: "",
    };

    // Reiniciar factura
    reiniciarBtn.addEventListener("click", e => {
        
        e.preventDefault();

        localStorage.removeItem("divFactura");
        localStorage.removeItem("tbody");

        document.querySelector(".formulario").reset();

        datos.nombre = "";
        datos.direccion = "";
        datos.rif = "";
        datos.codigo = "";
        datos.telefono = "";
        datos.vendedor = "";
        datos.notaEntrega = "";
        datos.fecha = "";
        datos.productos = [];
        datos.total = "";

        limpiarHTML(listaProductos);

        limpiarHTML(resultadosClientes);

        eliminarBtn.classList.remove("visible");

        resultadoBtn.classList.remove("visible");
    });

    // Crear factura
    crearBtn.addEventListener("click", e => {

        e.preventDefault();

        // Producto
        const producto = document.querySelectorAll(".producto");
        let total = 0;
        let subtotal = 0;
        
        producto.forEach(p => {

            // Obtener datos
            let descripcion = p.querySelector("#nombre-producto").value;
            let precio = p.querySelector("#precio").value;
            let cantidad = p.querySelector("#cantidad").value;

            precio = evaluarNum( precio );

            subtotal = precio * parseFloat( cantidad );
            subtotal = evaluarNum( subtotal );

            // Crear objecto de los datos
            const producto = {
                descripcion,  // descripcion: descripcion
                precio,  // precio: precio
                cantidad,  // cantidad: cantidad
                subtotal  // subtotal: subtotal
            }

            total += parseFloat( producto.subtotal );

            datos.productos.push(producto);
        });
        total = parseFloat(total);
        total = evaluarNum( total );
        datos.total = total;

        
        // Validación
        if(Object.values(datos).includes("")) {
            imprimirAlerta("Hay campos sin llenar", "error");
            return;
        }

        // Variables del objeto
        const { nombre, direccion, rif, codigo, telefono, vendedor } = datos

        // Agregar HTML de la factura
        divFactura.innerHTML = `
            <div class="principal">
                <p class="nota">NOTA DE ENTREGA ${datos.notaEntrega}</p>
                <p class="fecha">CARACAS, ${datos.fecha}</p>
            </div>

            <div class="secundario">
                <div>
                    <div class="grid">
                         <div class="ubicacion">
                            <p class="mayuscula nombre">${nombre}.</p>
                            <p class="mayuscula direccion">${direccion}.</p>
                        </div>
                        <div class="codigo">
                            <p>RIF CLIENTE: ${rif}</p>
                            <p>CODIGO CLIENTE: ${codigo}</p>
                            <p>TELEFONO CLIENTE: ${telefono}</p>

                            <p class="vendedor mayuscula">Vendedor/a: ${vendedor}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="terciario">
                <table>
                    <thead>
                         <tr>
                            <th>CANT</th>
                            <th>DESCRIPCION</th>
                            <th>PRECIO UNITARIO</th>
                            <th>SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
                <p class="total alinear-derecha">TOTAL: ${datos.total}</p>
            </div>
        `;

        //factura.appendChild(divFactura);
        localStorage.setItem("divFactura", divFactura.innerHTML);

        //const tbody = document.querySelector("TBODY");
        const tbody = document.createElement("TBODY");

        datos.productos.forEach( e => {
            const { cantidad, descripcion, precio, subtotal } = e;
            const tr = document.createElement("TR");
            tr.innerHTML = `
                <td>${cantidad}</td>
                <td class="mayuscula descripcion">${descripcion}</td>
                <td>${precio}</td>
                <td>${subtotal}</td>
            `;
            tbody.appendChild(tr);
        });

        localStorage.setItem("tbody", tbody.innerHTML);

        localStorage.getItem("divFactura") ? resultadoBtn.classList.add("visible") : resultadoBtn.classList.remove("visible");

        imprimirAlerta("Factura Creada");
    });

    // Guardar datos
    function guardarDatos(dato) {
        // Agregar datos que no son del cliente
        datos[dato.target.id] = dato.target.value;
    }

    // Evaluar número
    function evaluarNum(num) {
        if( num.toString().includes(".") ) {
            return decimal( num.toString() );
        } else {
            return floatCeros( num.toString() );
        }
    }

    // Sacar los números con solo 2 decimales
    function decimal(numero){
        let indice = numero.indexOf(".");
        let resultado = "";

        if(numero[indice + 2] === undefined){
            for(let i = 0; i <= indice + 1; i++){
                resultado += numero[i];
            }
            resultado += "0";
        } else{
            for(let i = 0; i <= indice + 2; i++){
                resultado += numero[i];
            }
        }

        return resultado;
    }

    // Poner decimal
    function floatCeros(numero) {
        let num = numero;
        num += ".00";
        return num;
    }

    // Agregar HTML de producto
    agregarBtn.addEventListener("click", e => {

        e.preventDefault();

        // Crear div
        const div = document.createElement("DIV");
        div.classList.add("producto");
        div.innerHTML = `
            <div>
                <div class="div-input">
                    <label for="nombre-producto">Descripción</label>
                    <input type="text" id="nombre-producto" placeholder="Descripción del Producto" autocomplete="off">
                </div>
                <ul class="resetear-lista" id="resultados-productos"></ul>
            </div>
            <div class="div-input">
                <label for="precio">Precio Unitario</label>
                <input type="number" id="precio" placeholder="Precio" min="1">
            </div>
            <div class="div-input">
                <label for="cantidad">Cantidad</label>
                <input type="number" id="cantidad" placeholder="Cantidad" min="1">
            </div>
        `;

        // Agregar div
        listaProductos.appendChild(div);

        if(listaProductos.firstChild) {
            eliminarBtn.classList.add("visible");
        }

        inputDescripcion();
    });

    // Eliminar HTML de producto
    eliminarBtn.addEventListener("click", e => {

        e.preventDefault();

        listaProductos.removeChild(listaProductos.lastChild);

        if(!listaProductos.lastChild) {
            eliminarBtn.classList.remove("visible");
        }
    });


    // autocompletado de nombreCliente
    nombreCliente.addEventListener("input", e => {

        // Limpiar HTML
        limpiarHTML(resultadosClientes);

        // Almacenar valor del input en variable
        const nombre = e.target.value.toLowerCase().trim();

        if(!nombre) {
            return;
        }
        
        // Filtrar los resultados
        const resultados = clientes.filter( clientes => 
            clientes.nombre.toLowerCase().indexOf(nombre) === 0 );
        
        if(resultados[0]) {
            resultados.forEach( e => {
                // HTML de los resultados
                const resultado = document.createElement("LI");
                resultado.textContent = e.nombre;
                resultado.classList.add("resultado", "mayuscula");

                resultado.onclick = () => {
                    nombreCliente.value = e.nombre.toUpperCase();
                    limpiarHTML(resultadosClientes);

                    // Agregar datos
                    datos["nombre"] = e.nombre;
                    datos["direccion"] = e.direccion;
                    datos["rif"] = e.rif;
                    datos["codigo"] = e.codigo;
                    datos["telefono"] = e.telefono;
                }

                // Agregar resultado
                resultadosClientes.appendChild(resultado);
            });
        } else {
            // Mostrar error
            mensajeError("No Hay Resultados", resultadosClientes, false);
        }

        // En caso de que escribas todo el nombre del resultado
        if(resultados.length === 1 && resultados[0].nombre.toLowerCase() === nombre) {
            // Agregar datos
                datos["nombre"] = resultados[0].nombre;
                datos["direccion"] = resultados[0].direccion;
                datos["rif"] = resultados[0].rif;
                datos["codigo"] = resultados[0].codigo;
                datos["telefono"] = resultados[0].telefono;

            limpiarHTML(resultadosClientes);
        } else {
            // Vaciar datos
            datos["nombre"] = "";
            datos["direccion"] = "";
            datos["rif"] = "";
            datos["codigo"] = "";
            datos["telefono"] = "";
        }
    });

    vendedor.addEventListener("change", guardarDatos);

    notaEntrega.addEventListener("input", guardarDatos);
    
    fecha.addEventListener("change", e => {
        const dateObj = new Date(e.target.value);

        const year = dateObj.getFullYear().toString();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = (dateObj.getDate() + 1).toString().padStart(2, "0");

        const reversedDate = `${day}/${month}/${year}`;

        datos["fecha"] = reversedDate;
    });


    function inputDescripcion() {

        const productoDiv = document.querySelectorAll(".producto");

        if(productoDiv.length > 0) {

            productoDiv.forEach( productoDiv => {

                const nombreProducto = productoDiv.querySelector(".producto #nombre-producto");
                const resultadosProductos = productoDiv.querySelector("#resultados-productos");
    
                // autocompletado de nombreProducto
                nombreProducto.addEventListener("input", e => {
    
                    // Limpiar HTML
                    limpiarHTML(resultadosProductos);
    
                    // Almacenar valor del input en variable
                    const nombre = e.target.value.toLowerCase().trim();
    
                    if(!nombre) {
                        return;
                    }
            
                    // Filtrar los resultados
                    const resultados = productos.filter( productos => 
                        productos.nombre.toLowerCase().indexOf(nombre) === 0 );
                        
            
                    if(resultados[0]) {
                        resultados.forEach( e => {
                            // HTML de los resultados
                            const resultado = document.createElement("LI");
                            resultado.textContent = e.nombre;
                            resultado.classList.add("resultado", "mayuscula");
    
                            resultado.onclick = () => {
                                nombreProducto.value = e.nombre.toUpperCase();
                                limpiarHTML(resultadosProductos);
                            }
    
                            // Agregar resultado
                            resultadosProductos.appendChild(resultado);
                        });
                    }

                    // En caso de que escribas todo el nombre del resultado
                    if(resultados.length === 1 && resultados[0].toLowerCase() === nombre) {
                        limpiarHTML(resultadosProductos);
                    } 
                });
            });
        }
    }
}