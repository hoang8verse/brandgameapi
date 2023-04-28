require('dotenv').config()
require('module-alias/register')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const portHttps = process.env.PORT_HTTPS || 443

var cors = require('cors');
app.use(cors());

const fs = require('fs');
const http = require('http');
const https = require('https');

// let path_key = 'private.key';
// let path_cert = 'server.crt';
let path_cert = '/etc/letsencrypt/live/rlgl2-api.brandgames.vn/fullchain.pem';
let path_key = '/etc/letsencrypt/live/rlgl2-api.brandgames.vn/privkey.pem';

const options = {
  key: fs.readFileSync(path_key),
  cert: fs.readFileSync(path_cert)
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);


const db_lb_arshooters = require('@client/lb_arshooters')
const db_lb_flappybirds = require('@client/lb_flappybirds')


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


// lb_arshooters db
app.get('/lb_arshooters', db_lb_arshooters.getLB_ARShooters)
app.get('/lb_arshooters/:id', db_lb_arshooters.getLB_ARShooterById)
app.post('/lb_arshooters', db_lb_arshooters.createLB_ARShooter)
app.put('/lb_arshooters/:id', db_lb_arshooters.updateLB_ARShooter)
app.delete('/lb_arshooters/:id', db_lb_arshooters.deleteLB_ARShooter)
app.post('/lb_arshooters/postscore', db_lb_arshooters.postScoreLB_ARShooter)
app.get('/lb_arshooters_rank', db_lb_arshooters.getRankLB_ARShooters)
app.post('/arshooters_enrichCDP', db_lb_arshooters.enrichCDP_ARShooter)
app.post('/arshooters_ingestCDP', db_lb_arshooters.ingestCDP_ARShooter)

// lb_flappybird db
app.get('/lb_flappybirds', db_lb_flappybirds.getLB_FlappyBirds)
app.get('/lb_flappybirds/:id', db_lb_flappybirds.getLB_FlappyBirdById)
app.post('/lb_flappybirds', db_lb_flappybirds.createLB_FlappyBird)
app.put('/lb_flappybirds/:id', db_lb_flappybirds.updateLB_FlappyBird)
app.delete('/lb_flappybirds/:id', db_lb_flappybirds.deleteLB_FlappyBird)
app.post('/lb_flappybirds/postscore', db_lb_flappybirds.postScoreLB_FlappyBird)
app.get('/lb_flappybirds_rank', db_lb_flappybirds.getRankLB_FlappyBirds)
app.post('/flappybirds_enrichCDP', db_lb_flappybirds.enrichCDP_FlappyBird)
app.post('/flappybirds_ingestCDP', db_lb_flappybirds.ingestCDP_FlappyBird)


// app.listen(port, () => {
//   console.log(`App running on port ${port}.`)
// })

// httpServer.listen(port);
httpsServer.listen(portHttps);

console.log(process.env.DATABASE_URL)


