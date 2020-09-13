const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./server/routes/api/SignIn');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Login_demo', { useNewUrlParser: true }, function(err,db){
    if (err) throw err;
    console.log('Database created');
    
})

const port  = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    next();
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', apiRouter);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
    }

app.listen(port, (err)=>{
    if (err) console.log(err)
    console.log(`Server Created`)
});