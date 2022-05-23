"use strict"

const axios = require("axios")

// This is an example consumer that accesses the Example API via HTTP
// TODO: replace these functions with your actual ones

// Gets multiple entries from the Example API
exports.getMeDogs = endpoint => {
  return axios.request({
    method: "GET",
    baseURL: endpoint,
    url: "/dogs",
    headers: { Accept: "application/json" },
  }).catch(function (error) {
    if (error.response) {
      return error.response
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
}

// Gets a single entry by ID from the Example API
exports.getMeDog = async (endpoint, index) => {
  return await axios.request({
      method: "GET",
      baseURL: endpoint,
      url: "/dogs/" + index,
      headers: { Accept: "application/json" },
    }).catch(function (error) {
      if (error.response) {
        return error.response
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
}
