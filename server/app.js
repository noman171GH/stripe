require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET);
const stripe = require("stripe")("sk_test_51QIsd8JwlVo3SELchcpngrJpNdLiQhyOD9NPgUvlhYFFAgyIHRx4rpPjsuvusiHCufqoaNeMNniStqscSg1upqqc00zsTFVhox");

app.use(express.json());
// https://office10am.medium.com/why-your-node-js-app-needs-express-json-a-crucial-middleware-explained-a51ffdcc015d
app.use(cors());
// https://www.stackhawk.com/blog/nodejs-cors-guide-what-it-is-and-how-to-enable-it/

// checkout api
// https://docs.stripe.com/payments/accept-a-payment?lang=node
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
    console.log(products);
    const lineItems = products.map((product)=>({
        
              price_data:{ currency:"eur",                                  //Three-letter ISO currency code, in lowercase. 
            product_data:{ name:product.dish, images:[product.imgdata]},    // check console.log(products);
             unit_amount:product.price * 100,                               // https://docs.stripe.com/api/payment_intents/object#payment_intent_object-amount
                         },
                quantity:product.qnty
                                                })
                                    );
// A positive integer representing how much to charge in the smallest currency unit
 // (e.g., 100 cents to charge $1.00 or 100 to charge ¥100, a zero-decimal currency). 


    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/sucess",
        cancel_url:"http://localhost:3000/cancel",
                                                        });

    res.json({id:session.id})
 
})


app.listen(7000,()=>{
    console.log("server start");
})


// https://docs.stripe.com/api/checkout/sessions/create#create_checkout_session-line_items

// ******************************************************************************************************
// line_items array of objectsRequired unless setup mode

// A list of items the customer is purchasing. Use this parameter to pass one-time or recurring Prices.
// *******************************************************************************************************