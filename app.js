const   express     = require('express'),
        exphbs      = require('express-handlebars'),
        mercadopago = require('mercadopago'),
        bodyParser  = require("body-parser"),
        app         = express();
        

 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

mercadopago.configure({
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
  });


app.get('/', function (req, res) {
    res.render('home');
});



app.get('/detail', function (req, res) {
    let infoProducto = req.query
    let imagen = "https://marianomat-mp-commerce-nodejs.herokuapp.com" + infoProducto.img.substr(1)
    let preference = {
        items: [
          {
            id: "1234",
            title: infoProducto.title,
            description: "Dispositivo móvil de Tienda e-commerce",
            unit_price: Number(infoProducto.price), 
            quantity: 1,
            picture_url: imagen,
            currency_id: 'ARS',
          }
        ],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
              area_code: "11",
              number: 22223333
            },
            address: {
              street_name: "False",
              street_number: 123,
              zip_code: "1111"
            }
        },
        payment_methods: {
            
            excluded_payment_methods: [{
              id: "amex"
            }],
            excluded_payment_types: [{
              id: "atm"
            }],
            installments: 6
        },
        back_urls: {
            success: "https://marianomat-mp-commerce-nodejs.herokuapp.com/response/",
            pending: "https://marianomat-mp-commerce-nodejs.herokuapp.com/response/",
            failure: "https://marianomat-mp-commerce-nodejs.herokuapp.com/response/"
        },
        notification_url: "https://marianomat-mp-commerce-nodejs.herokuapp.com/webhook",
        auto_return: "approved",
        external_reference: "marianopereyra95@gmail.com"
    };
    let init_point
    mercadopago.preferences.create(preference)
    .then(function(response){
    // Este valor reemplazará el string "$$init_point$$" en tu HTML
        global.init_point = response.body.init_point;
        init_point = response.body.id;
        
       console.log(response.body.items)
       res.render('detail', {query: req.query, init_point: init_point});
    })    
});

app.post("/procesar-pago", (req,res) => {
  console.log("***** PROCESAR PAGO  1 ******")
  console.log(req.body)
  console.log("***** PROCESAR PAGO  1 ******")
  res.send("Gracias")
})
app.post("/webhook", (req,res) => {
    //FUNCIONA

    console.log("***** WEBHOOK  1 ******")
    console.log(req.query)
    console.log("***** WEBHOOK  1 ******")

    console.log("***** WEBHOOK  2 ******")
    console.log(req.body)
    console.log("***** WEBHOOK  2 ******")
    res.status(200).send('OK')
})
app.post("/response/:id", (req,res) => {
  console.log("***** RESPONSE 1 ******")
  console.log(req.params.id)
  console.log("***** RESPONSE 2 ******")
  console.log(req.body)
  console.log("***** RESPONSE 3 ******")
  console.log(req)  
  res.send("errorrrrrrr")
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(process.env.PORT || 3000, () => [
    console.log("server on")
]);