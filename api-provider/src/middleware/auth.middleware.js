// This is an example of bearer authentication that requires authentication with a bearer token.
// The 'Token' should be a valid ISO 8601 timestamp within the last hour
// TODO: replace this with actual authentication for your provider
const isValidAuthTimestamp = (timestamp) => {
    let diff = (new Date() - new Date(timestamp)) / 1000
    return diff >= 0 && diff <= 3600
}

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    const timestamp = req.headers.authorization.replace("Bearer ", "")
    if (!isValidAuthTimestamp(timestamp)) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    next()
}

module.exports = authMiddleware
