const db = require("./config/db/index");
db.connect();


const fs = require('fs');
const path = require('path')
const session = require("express-session");
const express = require('express')
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const passport = require('passport');
const app = express();
//-------------
var imgModel = require('./app/models/model');
//-------------


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000
// const url = "https://hcmus-web-2021.herokuapp.com/";

const route = require("./routes/index");

//Temp start from hear
var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/image')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

app.get('/upload', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});
// Step 8 - the POST handler for processing the uploaded file

app.post('/a', upload.single('image'), (req, res, next) => {

var obj = {
  name: req.body.name,
  desc: req.body.desc,
  img: {
    data: fs.readFileSync(path.join(__dirname + '/public/image/' + req.file.filename)),
    contentType: 'image/png'
  }
}
imgModel.create(obj, (err, item) => {
  if (err) {
    console.log(err);
  }
  else {
    // item.save();
    res.redirect('/upload');
  }
});
});















//end--------------------------------

//static file
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req,res,next){
  res.locals.user = req.user;
  next();
})

app.engine('.hbs', 
  handlebars({
    extname: '.hbs',
    helpers: {
      standardDate: (a)=> a.toString().slice(0,16),
      sum: (a,b)=> a+b,
      compare: (a)=>{
        if(a===true){
          return "Unban";
        }
        return "Ban";
      }
    }
  }),
);

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname,'resource/views'));

route(app);


app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})