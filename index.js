const cool = require('cool-ascii-faces');
const pg = require('pg');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

// process.env.DATABASE_URL

var config = {
  host : process.env.DATABASE_URL
};

const pool = new pg.Pool(config);

pool.connect(function(err, client, done) {
  if (err) {
    console.log("not able to get connection "+ err);
  }
  client.query('SELECT * FROM test_table', function(err, result) {
    done();
    if (err) {
      console.error(err);
    }
    else {
      console.log(result.rows);
    }
  });
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => {
    var result = '';
    var times = process.env.TIMES || 5;
    for (i=0; i < times; i++)
      result += i + ' ';
    res.send(result);
  })
  .get('/db', (req, res) => {
    console.log(process.env.DATABASE_URL),
    pool.connect(function(err, client, done) {
      if (err) {
        console.log("not able to get connection "+ err);
        res.status(400).send(err);
      }
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        if (err) {
          console.error(err); res.send("Error " + err);
        }
        else {
          res.render('pages/db', {results: result.rows} );
        }
      });
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
