const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './Views')));

app.set('views', path.join(__dirname, './Views'));
app.set('view engine', 'ejs');

app.get('/', async (request, response) => {
    return response.render('home');
});

app.listen(process.env.PORT || 3000, () => {
    return console.log('Beep! Running on http://localhost:' + process.env.PORT || 3000);
});