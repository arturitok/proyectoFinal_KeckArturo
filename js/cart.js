import { stockUpdate, productShow } from "./productos.js";

/*--------------------------------------------------------
Constructor del carrito con sus métodos
--------------------------------------------------------*/
export class Carrito {
  constructor() {
    this.productos = [],
      this.cantidadTotal = 0,
      this.shippingFlag = false,
      this.shipping = false,
      this.totalEnvio = 0,
      this.subTotal = 0,
      this.total = 0;
  }

  /*--------------------------------------------------------
  Agregar producto al carrito
  --------------------------------------------------------*/
  productAdd(producto) {
    //Chequear si ya existe el producto en el carrito
    let talle = Object.keys(producto.stock)[0];
    let indice = this.productos.findIndex(el => el.nombre == producto.nombre && el.talle == talle);

    //Si existe, sumar la cantidad, si no añadir un  producto al array
    if (indice != -1) {
      this.productos[indice].cantidad += producto.stock[talle];
    } else {
      this.productos.push({ "codigo": producto.codigo, "nombre": producto.nombre, "imagen": producto.imagen, "color": producto.color, "precio": producto.precio, "talle": talle, "cantidad": producto.stock[talle], "cantidadDisponible": producto.cantidadDisponible });
    }

    //Restar al stock y actualizar la pantalla
    stockUpdate(producto);
    productShow(producto.codigo);

    //Ejecutar calcularCantidad() para que se actualice la cantidadTotal
    this.calcularCantidad();

    //Crear o actualizar carritoLocal en el  localStorage 
    localStorage.setItem("carritoLocal", JSON.stringify(this))
  }

  /*--------------------------------------------------------
  Metodo para actualizarr la cantidad 
  --------------------------------------------------------*/
  calcularCantidad() {
    this.cantidadTotal = 0;
    for (let producto of this.productos) {
      this.cantidadTotal += producto.cantidad;
    }
    localStorage.setItem("carritoLocal", JSON.stringify(this))
  };

  /*--------------------------------------------------------
  Calcular subtotal
  --------------------------------------------------------*/
  calcularSubtotal() {
    this.subTotal = 0;
    for (let producto of this.productos) {
      this.subTotal += producto.precio * producto.cantidad;
    }
    localStorage.setItem("carritoLocal", JSON.stringify(this))
  };

  /*--------------------------------------------------------
  Consultar si se calcula envío y actualizar el flag
  --------------------------------------------------------*/
  consultaEnvio() {
    this.shippingFlag = true;
    //Actualizar carritoLocal en localStorage 
    localStorage.setItem("carritoLocal", JSON.stringify(this));

    return Swal.fire({
      title: 'Envío',
      text: "¿Te enviamos el pedido?",
      icon: undefined,
      showCancelButton: true,
      confirmButtonColor: '#17779c',
      cancelButtonColor: '#444',
      confirmButtonText: 'Si, por favor',
      cancelButtonText: "No, gracias."
    }).then((result) => {
      if (result.isConfirmed) {
        this.calcularEnvio();
      } else {
        this.totalEnvio = 0;
      }
    })
  };

  /*--------------------------------------------------------
  Caclular el costo del envío
  --------------------------------------------------------*/
  calcularEnvio() {
    this.shipping = true;

    if (this.subTotal > 5000) {

      Swal.fire({
        title: 'Envío',
        text: "Tenés envío gratis",
        icon: undefined,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#17779c'
      })
      this.totalEnvio = 0;
    } else {
      this.totalEnvio = 650;
    }

    //Actualizar carritoLocal en localStorage 
    localStorage.setItem("carritoLocal", JSON.stringify(this))
  };

  /*--------------------------------------------------------
  Calcular el total
  --------------------------------------------------------*/
  calcularTotal() {
    this.total = this.subTotal + this.totalEnvio;
    localStorage.setItem("carritoLocal", JSON.stringify(this))
  };

  /*--------------------------------------------------------
  Limpiar el carrito
  --------------------------------------------------------*/
  cartClean() {
    this.productos = [],
      this.cantidadTotal = 0;
    this.totalEnvio = 0,
      this.shipping = false,
      this.subTotal = 0,
      this.total = 0
    this.shippingFlag = false;

    localStorage.removeItem("carritoLocal");
    location.reload();
  }
}
