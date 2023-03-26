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

app.get('/time', async (request, response) => {
    const time = request.query.time;
    const format = request.query.format;

    const timestamp = Date.parse(time);
    const date = new Date(timestamp);

    let timestring;

    if (format === 'shortdate') {
        timestring = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date);
    } else if (format === 'longdate') {
        timestring = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    } else if (format === 'shorttime') {
        timestring = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
    } else if (format === 'longtime') {
        timestring = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(date);
    }
    
    return response.send(timestring);
});

app.listen(process.env.PORT || 3000, () => {
    return console.log('Beep! Running on http://localhost:' + process.env.PORT || 3000);
});