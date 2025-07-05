// Function to return the response object with status and data
function getResponseObject(msg, isError, data, isReturnStatusCode = false, statusCode = 200) {
    return {
        msg,
        error: isError,
        data,
        ...isReturnStatusCode && { statusCode }
    }
}

module.exports = {
    getResponseObject
}