const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

// ROUTES
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const varMiddleware = require('./middleware/variables');

const app = express();

app.engine(
  'hbs',
  exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
  }),
);

app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(varMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url =
      'mongodb+srv://Pecherskiy:4835jpPmZp0OThiB@cluster0.z1nqv.mongodb.net/shop';
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: 'pecherskiy88@gmail.com',
    //     name: 'Artem',
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log('start error: ', e);
  }
}

start();
