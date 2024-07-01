const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    /*const {user, password} = req.query;

    if (user !== 'Daniele' || password !== '123456') {
        return next({
            message: 'Invalid',
        })
    }*/
    const {authorization} = req.headers;
    console.log('auth', authorization)
    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(token, 'pkey1234');

    const user = users.find(usr => usr.username === decoded.user);
    if (user) {
        req.authPayload = decoded;
        next();
    }

    else return res.status(401).json({
        message: 'User does not exist'
    })

    //const token = jwt.sign({user: 'Daniele'}, 'pkey1234');
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.use((err, req, res, next) => {
    return res.json({
        error: err
    })
})

app.listen(PORT,()=>console.log("Server is running"));
