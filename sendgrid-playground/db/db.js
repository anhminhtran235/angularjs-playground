const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anhminhtran235:qwertyuioP_123@cluster0.zxign.mongodb.net/Cluster0?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('Connected to database');
}).catch(() => {
  console.log('Error while connecting to database. Exiting...');
  process.exit();
})

