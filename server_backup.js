const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const port = 5000;
const url = 'mongodb://localhost:27017/prompt_to_website';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const baseComponentURI = '../prompt-2-website/src/components/collection/';

function readFile(filePath) {
    const url= baseComponentURI + filePath
    fs.readFile(url, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        const regex = /\/\/ <dev>[\s\S]*?\/\/ <\/dev>/g;
        let modifiedData = data.replace(regex, '');
        modifiedData = modifiedData.replace(/^\s*[\r\n]/gm, '');
        console.log('File contents:', modifiedData);
    });
}

const filePath = 'test/test-1.tsx';
readFile(filePath); 