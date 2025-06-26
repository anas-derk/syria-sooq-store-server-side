const database = require("./database");
const server = require("./http");
const { config } = require("dotenv");

const PORT = process.env.PORT || 5200;

config();

database.connect(process.env.DB_URL);

database.connection.on("connected", () => {
    const Server = server.listen(PORT, () => {
        console.log(`Server Listening On Port ${PORT}`);
    });
    process.on("SIGINT", async () => {
        if (database.connection.readyState) {
            await database.connection.close();
        }
        Server.close((err) => {
            console.log(`Error On Close Server: ${err?.message ?? err}`);
        });
    });
    Server.on("error", (err) => {
        console.log(`Http Server Error: ${err?.message ?? err}`);
    });
});