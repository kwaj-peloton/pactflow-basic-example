"use strict"

// This is the Pact test for the Example App

const { pactWith } = require("jest-pact")

// Load the consumer client code which we will call in our test
const { getMeDogs, getMeDog } = require("../example-app")

pactWith({ consumer: "Example App", provider: "Example API" }, provider => {
  // This is the body we expect to get back from the provider
  const EXPECTED_BODY_ALL = [
    {
      dog: 1,
    },
    {
      dog: 2,
    },
  ]
  const EXPECTED_BODY_SINGLE = {
    dog: 1,
  }
  const EXPECTED_BODY_NOT_FOUND = {
    "message": "Dog not found",
  }

  describe("get /dogs", () => {
    beforeEach(() => {
      // First we setup the expected interactions that should occur during the test
      const interaction = {
        state: "i have a list of dogs",
        uponReceiving: "a request for all dogs",
        withRequest: {
          method: "GET",
          path: "/dogs",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: EXPECTED_BODY_ALL,
        },
      }

      return provider.addInteraction(interaction)
    })

    it("returns the correct response", () => {
      // We call our consumer code, and that will make requests to the mock server
      getMeDogs(provider.mockService.baseUrl).then(response => {
        console.log("RESPONSE: " + JSON.stringify(response.data))
        console.log("EXPECTED: " + JSON.stringify(EXPECTED_BODY_ALL))
        return expect(JSON.stringify(response.data)).toEqual(JSON.stringify(EXPECTED_BODY_ALL))
      })
    })
  })

  describe("get /dogs/1", () => {
    beforeEach(() => {
      const interaction = {
        state: "i have a list of dogs",
        uponReceiving: "a request for a single dog",
        withRequest: {
          method: "GET",
          path: "/dogs/1",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: EXPECTED_BODY_SINGLE,
        },
      }

      return provider.addInteraction(interaction)
    })

    it("returns the correct response", () => {
      getMeDog(provider.mockService.baseUrl, 1).then(response => {
        console.log("RESPONSE: " + JSON.stringify(response.data))
        console.log("EXPECTED: " + JSON.stringify(EXPECTED_BODY_SINGLE))
        return expect(JSON.stringify(response.data)).toEqual(JSON.stringify(EXPECTED_BODY_SINGLE))
      })
    })
  })

  describe("get /dogs/3", () => {
    beforeEach(() => {
      const interaction = {
        state: "dog not found",
        uponReceiving: "a request for a single dog",
        withRequest: {
          method: "GET",
          path: "/dogs/3",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 404,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: EXPECTED_BODY_NOT_FOUND,
        },
      }

      return provider.addInteraction(interaction)
    })

    it("returns the correct response", () => {
      getMeDog(provider.mockService.baseUrl, 3).then(response => {
        console.log("RESPONSE: " + JSON.stringify(response.data))
        console.log("EXPECTED: " + JSON.stringify(EXPECTED_BODY_NOT_FOUND))
        return expect(JSON.stringify(response.data)).toEqual(JSON.stringify(EXPECTED_BODY_NOT_FOUND))
      })
    })
  })
})
