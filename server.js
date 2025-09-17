// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const port=process.env.PORT || 3003
const hostname = 'localhost'


// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})


// // server.js
// const http = require('http');
// const { parse } = require('url');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const port = Number(process.env.PORT) || 3003; // cast to number
// const host = process.env.HOST || 'localhost';

// const app = next({ dev }); // don't pass hostname/port here on Next 12
// const handle = app.getRequestHandler();

// app.prepare()
//   .then(() => {
//     const server = http.createServer(async (req, res) => {
//       try {
//         const parsedUrl = parse(req.url, true);
//         const { pathname, query } = parsedUrl;

//         if (pathname === '/a') return app.render(req, res, '/a', query);
//         if (pathname === '/b') return app.render(req, res, '/b', query);
//         return handle(req, res, parsedUrl);
//       } catch (err) {
//         console.error('Error occurred handling', req.url, err);
//         res.statusCode = 500;
//         res.end('internal server error');
//       }
//     });

//     server.listen(port, host, () => {
//       console.log(`> Ready on http://${host}:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   });
