const express = require('express');
// const cors = require('cors');
const app = express();

// app.use(cors());
// const addFunc = (a, b) => { return parseInt(a) + parseInt(b) };
// app.get('/hello', (req, res) => {
//   res.send(`<head> ${n}  </head>`)
// })

app.get('/hello', (req, res) => {
  // this is the back end sending to the fron end.
  // console.log('listening inside app.get');
  // res.send(() => { console.log('i am the front end'); });
  // res.send('<button id=but1> world! </button>');
  // res.send('<button id=but2> world 1! </button>');
  console.log('hello page ');
  res.sendFile('/Users/johnholden/Documents/js/connect4/server/index.html');
});

app.listen(8080);

// app.use(express.static('server')) ;