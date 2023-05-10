const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json()); // Middleware to parse JSON request body

app.post('/nip-5', (req, res) => {
  const { name, pub } = req.body;

  // Write user data to a JSON file in /var/www/html/.well-known/
  const filePath = path.join('/var', 'www', 'html', '.well-known', 'nostr.json');

  // Check if file exists and is readable
  fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error accessing file');
    } else {
      // Read existing user data from JSON file
      fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading file');
        } else {
          let users = {};
          try {
            users = JSON.parse(fileData); // Parse JSON data
          } catch (err) {
            console.error(err);
            res.status(500).send('Error parsing JSON data');
          }

          // Add new user to the existing data
          users.names = users.names || {}; // Initialize names property
          users.names[name] = pub; // Add new user data

          // Write updated user data back to the JSON file
          fs.writeFile(filePath, JSON.stringify(users), (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error writing to file');
            } else {
              res.json(users);
            }
          });
        }
      });
    }
  });
});

/* 
if you need make scure please add auth-key for APi
*/

/* 
happy codeing
Yuda Adi Pratama
https://0x25c.com
*/

app.listen(3000, '0.0.0.0', () => console.log('Server started on port 3000'));
