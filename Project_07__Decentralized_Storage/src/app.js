const express = require('express');
const path = require('path');

const ipfsApi = require('../public/javascript/ipfsApi.js');

const app = express();

const publicDirPath = path.join(__dirname, '../public');

// entender
app.use(express.static(publicDirPath, { extensions: ['html'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// entender
app.get('', (req, res) => {
  res.sendFile(publicDirPath + "/ipfs.html");
  //res.sendFile("./views/ipfs.html");
});

app.listen(3000, () => {
  console.log('Server is up and running on http://127.0.0.1:3000');
});

app.post('/addData', (req, res) => {
  ipfsApi // entender el send response
    .ipfsAdd(req.body.data)
    .then((response) => {
      res.send(response);
    }) // entender la parte de catching error
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/getData', (req, res) => {
  ipfsApi
    .ipfsGet(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/getImage', (req, res) => {
  ipfsApi
    .ipfsGetImage(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/addFile', (req, res) => {
  ipfsApi
    .addFile(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});