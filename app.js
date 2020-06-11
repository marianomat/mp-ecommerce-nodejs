const   express     = require('express'),
        exphbs      = require('express-handlebars'),
        mercadopago = require('mercadopago'),
        app         = express();
        

 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

mercadopago.configure({
    sandbox: true,
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
  });


app.get('/', function (req, res) {
    res.render('home');
});

app.get("/fail", (req,res) => {
    res.send("errorrrrrrr")
});

app.get('/detail', function (req, res) {
    let infoProducto = req.query
    
    let preference = {
        items: [
          {
            id: "1234",
            title: infoProducto.title,
            description: "Dispositivo movil de Tienda e-commerce",
            unit_price: Number(infoProducto.price),
            quantity: 1,
            picture_url: infoProducto.img,
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
              zip_code: "1111",
              street_name: "False",
              street_number: 123
            }
        },
        payment_methods: {
            installments: 6,
            excluded_payments_methods: ["atm"],
            excluded_payments_types: ["amex"]
        },
        back_urls: {
            success: "http://localhost:3000/fail",
            pending: "http://localhost:3000/fail",
            failure: "http://localhost:3000/fail"
        },
        notification_url: "http://localhost:3000/webhook",
        external_reference: "marianopereyra95@gmail.com"
    };
    let init_point
    mercadopago.preferences.create(preference)
    .then(function(response){
    // Este valor reemplazará el string "$$init_point$$" en tu HTML
        global.init_point = response.body.init_point;
        init_point = response.body.id;
        
       console.log(response)
       res.render('detail', {query: req.query, init_point: init_point});
    })    
});

app.post("/webhook", (req,res) => {
    console.log(req)
    res.status(200).send('OK')
})

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(3000, () => [
    console.log("server on")
]);