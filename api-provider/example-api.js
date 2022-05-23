// This is an example Example API provider express server
// TODO: replace this with your actual provider

const app = require('express')()
const cors = require('cors')
const routes = require('./src/dog/dog.routes')
const authMiddleware = require('./src/middleware/auth.middleware')

const port = 8080

const init = () => {
  app.use(cors())
  app.use(routes)
  app.use(authMiddleware)
  return app.listen(port, () => console.log(`Example API API listening on port ${port}...`))
};

init()
