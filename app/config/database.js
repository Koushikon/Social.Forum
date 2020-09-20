const mongoose = require('mongoose');

// DB Configure Online & Local
const db_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@projecta-ikhid.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const db_url_local = `mongodb://localhost/${process.env.DB_NAME}`;

let mongoDB = process.env.MONGODB_URI || db_url;

mongoose.Promise = global.Promise;
// Connect to MongoDB
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log("DB Connected.."))
  .catch(err => console.log(err));