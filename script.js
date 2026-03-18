const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQImtXgBqQQkbH0Se2q74BoBMvlR7Frrg0alBbdt7g-_F6cPaBtCpdKqC-FEru5WV14NVIL4NrNevPh/pub?output=csv";

async function cargarProductos() {
    try {
        const respuesta = await fetch(urlCSV);
        const datos = await respuesta.text();
        const filas = datos.split("\n").slice(1); 
        const contenedor = document.getElementById("contenedor-productos");
        
        if (!contenedor) return;

        let acumuladorHTML = "";

        filas.forEach(fila => {
            const columnas = fila.split(/,|;/); 
            
            if (columnas.length >= 2 && columnas[0].trim() !== "") {
                const nombre = columnas[0].trim();
                const precio = columnas[1].trim();
                const imagenNombre = columnas[2] ? columnas[2].trim() : "";
                const descripcion = columnas[3] ? columnas[3].trim() : ""; 
                const rutaFoto = `img/${imagenNombre}`;

                acumuladorHTML += `
                    <div class="card">
                        <h3>${nombre}</h3>
                        <p class="subtitulo-prod">${descripcion}</p>
                        <div class="contenedor-img">
                            <img src="${rutaFoto}" alt="${nombre}" class="img-catalogo" onerror="this.src='https://via.placeholder.com/150?text=Error+Foto'">
                        </div>
                        <div class="info-card">
                            <p class="precio">Precio: $${precio}</p>
                            <input type="number" class="cantidad" value="0" min="0" data-nombre="${nombre}">
                        </div>
                    </div>
                `;
            }
        });

        contenedor.innerHTML = acumuladorHTML; 

    } catch (error) {
        console.error("Error:", error);
    }
}

window.onload = cargarProductos;

function enviarPedido() {
    const inputs = document.querySelectorAll('.cantidad');
    let mensaje = "Hola Mari! Pedido de Instinto Papel:\n\n";
    let hayProductos = false;

    inputs.forEach(input => {
        const cantidad = parseInt(input.value);
        if (cantidad > 0) {
            const nombreProd = input.getAttribute('data-nombre');
            mensaje += "- " + cantidad + " x " + nombreProd + "\n";
            hayProductos = true;
        }
    });

    if (!hayProductos) {
        alert("Por favor selecciona algun producto");
        return;
    }

    mensaje += "\nMe confirmas el total? Gracias";
    const telefono = "3454136399";
    const url = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje);
    window.open(url, '_blank');
}
