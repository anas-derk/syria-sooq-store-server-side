const mongoose = require("mongoose");

mongoose
    .set({ runValidators: true })
    .connection
    .on("connected", () => console.log("Database is Connected !!"))
    .on("disconnected", () => console.error("Database is Disconnected !!"))
    .on("reconnected", () => console.warn("Database is Reconnected !!"))
    .on("disconnecting", () => console.warn("Database is Disconnecting !!"))
    .on("close", () => console.log("Database is Closed !!"))
    .on('error', (error) => {
        console.error(`Database connection error: ${error?.message ?? error}`);
        process.exit(1);
    });

module.exports = mongoose;