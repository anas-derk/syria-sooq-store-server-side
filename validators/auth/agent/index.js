const { REGISTERATION_AGENT } = require("../../../constants/users");

function isValidAgent(agent) {
    return REGISTERATION_AGENT.includes(agent);
}

module.exports = {
    isValidAgent
}