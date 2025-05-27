const utilities = require("../utilities/")

async function buildError(req,res,next) {
    try {
        throw new Error("Intentional Server Crash for Testing Purposes");
    } catch (error) {
        next(error)
    }
    
}

module.exports = buildError;