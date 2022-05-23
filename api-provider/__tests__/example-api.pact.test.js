// This is the Pact verification test for Example API

const { Verifier } = require('@pact-foundation/pact')
const controller = require('../src/dog/dog.controller')
const Dog = require('../src/dog/dog')

// Setup provider server to verify
const app = require('express')()
const authMiddleware = require('../src/middleware/auth.middleware')
app.use(authMiddleware)
app.use(require('../src/dog/dog.routes'))
const server = app.listen("8080")

describe("Pact Verification", () => {
  it("validates the expectations of Example API", () => {
      const baseOpts = {
        logLevel: process.env.LOG_LEVEL || "INFO",
        providerBaseUrl: "http://localhost:8080",
        providerVersion: "1.0.0+localdev", // TODO: set this to a version derived from your CI build, for example with travis:  process.env.TRAVIS_COMMIT
        providerVersionTags: "LOCAL_DEV", // TODO: set this to the branch from your source control, for example with travis:  process.env.TRAVIS_BRANCH ? [process.env.TRAVIS_BRANCH] : [],
        verbose: process.env.VERBOSE === 'true',
        pactBrokerToken: process.env.PACTFLOW_TOKEN,
        publishVerificationResult: process.env.CI === 'true', //recommended to only publish from CI by setting the value to process.env.CI === 'true'
      }

      // For builds triggered by a 'contract content changed' webhook,
      // just verify the changed pact. The URL will bave been passed in
      // from the webhook to the CI job.
      const pactChangedOpts = {
        pactUrls: [process.env.PACT_URL]
      }

      // For 'normal' provider builds, fetch `master` and `prod` pacts for this provider
      const fetchPactsDynamicallyOpts = {
        provider: "Example API",
        consumerVersionSelectors: [{ tag: 'LOCAL_DEV', latest: true }, { tag: 'master', latest: true }, { tag: 'prod', latest: true } ],
        pactBrokerUrl: "https://peloton.pactflow.io",
        enablePending: false,
        includeWipPactsSince: undefined
      }

      // For information on provider states see https://docs.pact.io/getting_started/provider_states/
      // and https://docs.pact.io/provider/using_provider_states_effectively
      const stateHandlers = {
        // Provider state for when there are products in the DB
        "dogs exists": () => {
          controller.repository.dogs = new Map([
            ["1", new Dog("1")],
            ["2", new Dog("2")],
          ])
        },
        // Provider state for when product with ID 1 exists in the DB
        "a dog with ID 1 exists": () => {
          controller.repository.dogs = new Map([
            ["1", new Dog("1")]
          ])
        },
        // Provider state for when product with ID 11 does not exist in the DB
        "a dog with ID 3 does not exist": () => {
          controller.repository.dogs = new Map()
        }
      }

      // Request filters allow you to amend the request made to the provider. We will use it here to
      // set a valid Authorization header
      //
      const requestFilter = (req, res, next) => {
        // WARNING: Do not modify anything else on the request, because you could invalidate the contract
        console.log("HEADERS BEFORE:" + JSON.stringify(req.headers))
        /*if (!req.headers["authorization"]) {
          next()
          return
        }*/
        req.headers["authorization"] = `Bearer ${new Date().toISOString()}`
        console.log("HEADERS AFTER:" + JSON.stringify(req.headers))
        next()
      }

      const opts = {
        ...baseOpts,
        ...(process.env.PACT_URL ? pactChangedOpts : fetchPactsDynamicallyOpts),
        stateHandlers: stateHandlers,
        requestFilter: requestFilter
      }

      return new Verifier(opts).verifyProvider()
        .then(output => {
          console.log("Pact Verification Complete!")
          console.log(output)
        })
        .finally(() => {
          server.close()
        })
  })
})
