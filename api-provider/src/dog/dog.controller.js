const DogRepository = require("./dog.repository")

const repository = new DogRepository()

exports.getAll = async (req, res) => {
  res.send(await repository.fetchAll())
}
exports.getById = async (req, res) => {
  const dog = await repository.getById(req.params.id)
  dog ? res.send(dog) : res.status(404).send({message: "Dog not found"})
}

exports.repository = repository
