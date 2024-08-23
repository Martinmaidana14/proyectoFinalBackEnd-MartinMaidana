import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";

// Ver que hay en el Carrito
export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findOne({ _id: cartId });
        res.status(200).send(cart);
    } catch (error) {
        res
            .status(500)
            .send(`Error interno del servidor al consultar carrito: ${error}`);
    }
};

// Crear un carrito de compras
export const createCart = async (req, res) => {
    try {
        const message = await cartModel.create({ products: [] });
        res.status(201).send(message);
    } catch (e) {
        res
            .status(500)
            .send(`Error interno del servidor al crear carrito: ${error}`);
    }
};

// Agregar productos al carrito
export const insertProductCart = async (req, res) => {
    try {
        if (req.user.rol == "Admin") {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const { quantity } = req.body;
            const cart = await cartModel.findById(cartId);

            const index = cart.products.findIndex(
                // id_prod se solicita en cart.js como id de referencia p/ conectar cart con el producto
                (product) => product.id_prod == productId
            );

            if (index != -1) {
                cart.products[index].quantity = quantity;
            } else {
                cart.products.push({ id_prod: productId, quantity: quantity });
            }

            const message = await cartModel.findByIdAndUpdate(cartId, cart);
            res.status(200).send(message);
        } else {
            res.status(403).send("Usuario no autorizado");
        }
    } catch (error) {
        res
            .status(500)
            .send(`Error interno del servidor al crear producto: ${error}`);
    }
};

// Crear ticket de la compra
export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);
        let prodSinStock = [];

        // Tengo un carrito y con forEach buscamos los productos dentro del carrito
        if (cart) {
            cart.products.forEach(async (prod) => {
                let producto = await productModel.findById(prod.id_prod);
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto.id);
                }
            });
            if (prodSinStock.length == 0) {
                // Calcular la cantidad total
                //  const totalPrice = cart.products.reduce(
                //   (a, b) => a.id_prod.price * a.quantity + b.id_prod.price * b.quantity,
                //   0);
                console.log(cart.products);

                // Usuario premium descontar un 10%
                if (req.user.rol === 'premium') {
                    totalPrice *= 0.9;
                }

                const aux = [...cart.products];

                // Finalizar compra
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: 5,
                    products: cart.products,
                });

                // Usuario premium descontar un 15%: if(user.rol == "premium") { totalPrice - 15%}

                // Descontar stock de cada uno de los productos
                cart.products.forEach(async (prod) => {
                    // await productModel.findByIdAndUpdate(prod.id_prod, {
                    //  stock: stock - prod.quantity,
                    // });
                });

                // Vaciar carrito
                await cartModel.findByIdAndUpdate(cartId, {
                    products: [],
                });

                res.status(200).send(newTicket);
            } else {
                // Retornar 'Producto sin stock'
                prodSinStock.forEach((prodId) => {
                    //[{id_prod, quantity, {}...]
                    cart.products = cart.products.filter((pro) => pro.id_prod !== prodId);
                });
                await cartModel.findByIdAndUpdate(cartId, {
                    products: cart.products,
                });
                res.status(400).send(`Productos sin stock: ${prodSinStock}`);
            }
        } else {
            res.status(404).send("Cart no existe");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

