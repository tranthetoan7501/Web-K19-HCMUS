const productsRouter = require('./products');
const sitesRouter = require('./sites');
const adminRouter = require('./admin');


function route(app){
app.use('/admin',adminRouter);
app.use('/product',productsRouter);
app.use('/',sitesRouter);



// app.get('/product', (req, res) => {
//   res.render('product');
// })




}

module.exports = route;