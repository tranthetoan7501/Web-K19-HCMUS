const db = require("./config/db/index");
db.connect();

const path = require('path')
const express = require('express')
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000
// const url = "https://hcmus-web-2021.herokuapp.com/";

const route = require("./routes/index");


//static file
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));

app.engine('.hbs', 
  handlebars({
    extname: '.hbs',
    helpers: {
      standardDate: (a)=> a.toString().slice(0,16),
      sum: (a,b)=> a+b,
    }
  }),
);
app.set('view engine', '.hbs');

app.set('views', path.join(__dirname,'resource/views'));

route(app);


app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})