// server.js (or whatever your Express server file is named)
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

const baseComponentURI = path.join(__dirname, '../prompt-2-website/src/components/collection/');

function replaceDynamicPlaceholders(code, content) {
    return code.replace(/{content\.(.*?)}/g, (match, p1) => {
      const keys = p1.split('.');
      let value = content;
      for (const key of keys) {
        if (value[key] !== undefined) {
          value = value[key];
        } else {
          return match; // return the original placeholder if not found
        }
      }
      return value;
    });
  }

app.use(express.json()); // To parse JSON bodies

function readFile(filePath, callback) {
    const url = path.join(baseComponentURI, filePath);
    fs.readFile(url, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        const regex = /\/\/ <dev>[\s\S]*?\/\/ <\/dev>/g;
        let modifiedData = data.replace(regex, '');
        modifiedData = modifiedData.replace(/^\s*[\r\n]/gm, '');
        console.log(modifiedData)
        callback(null, modifiedData);
    });
}

app.post('/read-file', (req, res) => {
    const { filePath, contentJson } = req.body;
    console.log(contentJson)
    if (!filePath) {
        return res.status(400).json({ error: 'filePath is required' });
    }

    readFile(filePath, (err, modifiedData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading the file', details: err.message });
        }
        if (contentJson)
            modifiedData=replaceDynamicPlaceholders(modifiedData, contentJson)
        res.send(modifiedData);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
