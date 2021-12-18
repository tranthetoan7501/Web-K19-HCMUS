const productsRouter = require('./products');
const sitesRouter = require('./sites');
const adminRouter = require('./admin');
const apiRouter = require('../app/api');


function route(app){
app.use('/admin',adminRouter);
app.use('/product',productsRouter);
app.use('/api',apiRouter);
app.use('/',sitesRouter);




// app.get('/product', (req, res) => {
//   res.render('product');
// })




}

module.exports = route;