document.addEventListener("DOMContentLoaded", () => {
    mostrarFactura();
    imprimir();
});

function mostrarFactura() {
    const divFactura = document.createElement("DIV");
    
    if( localStorage.getItem("divFactura") ) {

        const factura = document.querySelector("#factura");
    
        divFactura.classList.add("producto");
        divFactura.innerHTML = localStorage.getItem("divFactura");
            
        factura.appendChild( divFactura );
        const tbody = document.querySelector("TBODY");
        tbody.innerHTML = localStorage.getItem("tbody");
    }
}

function imprimir() {
    const imprimirBtn = document.querySelector(".imprimir-btn");
    
    imprimirBtn.addEventListener("click", () => {
        window.print();
    });
}