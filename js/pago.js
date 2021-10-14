  
const URLAPI = 'https://api.mercadopago.com/checkout/preferences'
  
  
export const pagarMP = (miPago)=>{
  
  
    let paymentData = miPago
  
     $.ajaxSetup({
       headers:{
        'Authorization': 'Bearer TEST-8966862428774234-101317-fc62fa4bc2b74c9c029de589c4ac3424-12973775',
        'Content-Type': 'application/json'
      }
    })
    
    $.post(URLAPI,JSON.stringify(paymentData),(respuesta, status) => {
      if (status = "SUCCESS") {
        let urlPago = respuesta.init_point;
        window.open(`${urlPago}`);
      }
      else {
        Swal.fire({
          title: 'Error al procesar pago',
          text: "Tu pago no se pudo procesar.",
          icon: undefined,
          showCancelButton: false,
          confirmButtonColor: '#17779c',
          cancelButtonColor: '#444',
          confirmButtonText: 'Aceptar',
      })
      }
    })
    
  }
 