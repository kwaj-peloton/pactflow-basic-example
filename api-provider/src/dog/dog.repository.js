const Dog = require('./dog')

class DogRepository {

  constructor() {
    this.dogs = new Map([
      ["1", new Dog(1)],
      ["2", new Dog(2)],
    ])
  }

  async fetchAll() {
    return [...this.dogs.values()]
  }

  async getById(id) {
    return this.dogs.get(id)
  }
}

module.exports = DogRepository
