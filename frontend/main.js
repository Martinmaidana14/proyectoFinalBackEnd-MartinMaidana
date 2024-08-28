
const botonBuscar1 = document.getElementById('BotonBuscar1');
const botonSaludo = document.getElementById('botonSaludo');

// Esta linkeado con indexRouter.js del Backend
botonSaludo.addEventListener('click', () => {
    fetch('http://localhost:4000/saludo')
        .then((response) => response.json())
        .then((data) => {
            document.getElementById(
                'divSaludo'
            ).innerHTML = `Saludo: ${data.mensaje}`;
        })
        .catch((e) => console.log(e));
});

fetch('http://localhost:4000/api/products')
    .then((res) => res.json())
    .then((prods) => {
        mostrarProductos(prods);
    })

    .catch((error) => {
        console.error('Error al obtener productos:', error);
        document.getElementById('misProductos').innerHTML =
            'Hubo un error al cargar los productos.';
    });

function mostrarProductos(prods) {
    const productContainer = document.getElementById('misProductos');
    productContainer.className = 'card-products';
    prods.docs.forEach((product) => {
        const productElement = document.createElement('div');
        productElement.className = 'product-element';

        productElement.innerHTML = `
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text"><strong>Categoría: </strong> ${product.category}</p>
                <p class="card-text"><strong>Descripción: </strong> ${product.description}</p>
                <p class="card-text"><strong>Stock: </strong> ${product.stock} libros disponibles</p>
                <a href="#" class="btn btn-primary">Comprar: $${product.price}</a>
            </div>
        </div>`;
        productContainer.appendChild(productElement);
    });
}