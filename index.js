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
    const size = request.query.size;
    const fontColor = request.query.fontcolor || 'FFFFFF';
    const backgroundColor = request.query.backgroundcolor || '1A1C1F';
    const borderColor = request.query.bordercolor || '747F8D';
    const borderRadius = request.query.borderradius || 5;

    const timestamp = Date.parse(time);
    const date = new Date(timestamp);
    const now = new Date();

    const width = 145;
    const height = size === 'large' ? 64 : 32;
    let timestring = 'Invalid Date';

    if (!time || !format) {
        return response.send('No time or format was present.');
    }

    if (format === 'shortdate') {
        timestring = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date);
    } else if (format === 'longdate') {
        timestring = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    } else if (format === 'shorttime') {
        timestring = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
    } else if (format === 'longtime') {
        timestring = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(date);
    } else if (format === 'shortdatetime') {
        timestring = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', month: '2-digit', day: '2-digit', year: 'numeric', hour12: true }).format(date);
    } else if (format === 'longdatetime') {
        timestring = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', month: 'long', day: 'numeric', year: 'numeric', hour12: true }).format(date);
    } else if (format === 'relative') {
        const milliseconds = date.getTime() - now.getTime();
        const seconds = Math.round(milliseconds / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);
        const months = Math.round(days / 30.44);
        const years = Math.round(days / 365.24);

        if (milliseconds > 0) {
            if (seconds < 60) {
                timestring = seconds === 1 ? `in ${seconds} second` : `in ${seconds} seconds`;
            } else if (minutes < 60) {
                timestring = minutes === 1 ? `in ${minutes} minute` : `in ${minutes} minutes`;
            } else if (hours < 24) {
                timestring = hours === 1 ? `in ${hours} hour` : `in ${hours} hours`;
            } else if (days < 30) {
                timestring = days === 1 ? `in ${days} day` : `in ${days} days`;
            } else if (months < 12) {
                timestring = months === 1 ? `in ${months} month` : `in ${months} months`;
            } else {
                timestring = years === 1 ? `in ${years} year` : `in ${years} years`;
            }
        } else {
            if (seconds > -60) {
                timestring = Math.abs(seconds === -1) ? `${Math.abs(seconds)} second ago` : `${Math.abs(seconds)} seconds ago`;
            } else if (minutes > -60) {
                timestring = Math.abs(minutes === -1) ? `${Math.abs(minutes)} minute ago` : `${Math.abs(minutes)} minutes ago`;
            } else if (hours > -24) {
                timestring = Math.abs(hours === -1) ? `${Math.abs(hours)} hour ago` : `${Math.abs(hours)} hours ago`;
            } else if (days > -30) {
                timestring = Math.abs(days === -1) ? `${Math.abs(days)} day ago` : `${Math.abs(days)} days ago`;
            } else if (months > -12) {
                timestring = Math.abs(months === -1) ? `${Math.abs(months)} month ago` : `${Math.abs(months)} months ago`;
            } else {
                timestring = Math.abs(years === -1) ? `${Math.abs(years)} year ago` : `${Math.abs(years)} years ago`;
            }
        }
    } else {
        timestring = 'Invalid Format';
    }

    const SVG = 
    `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#${backgroundColor}" rx="${borderRadius}" stroke="#${borderColor}" stroke-width="2" />
    <rect x="1" y="1" width="${width - 2}" height="${height -2}" fill="none" rx="${borderRadius - 2}" stroke="#${borderColor}" stroke-width="2" />
    <text x="50%" y="${height === 32 ? 17.25 : 33 }" dominant-baseline="middle" text-anchor="middle" fill="#${fontColor}" font-family="'Noto Sans', sans-serif" font-size="18px" font-weight="500">${timestring}</text>
    <script>
        const text = document.querySelector('text').getComputedTextLength();
        const length = text + 36;
        if (length > ${width}) {
            document.querySelector('svg').setAttribute('width', length);
            document.querySelectorAll('rect')[0].setAttribute('width', length);
            document.querySelectorAll('rect')[1].setAttribute('width', length - 2);
        } else {
            document.querySelectorAll('rect')[0].setAttribute('width', 145);
            document.querySelectorAll('rect')[1].setAttribute('width', 143);
        }
    </script>
    </svg>
    `;

    return response.type('image/svg+xml').send(SVG);
});

app.listen(process.env.PORT || 3000, () => {
    return console.log('Beep! Running on http://localhost:' + process.env.PORT || 3000);
});