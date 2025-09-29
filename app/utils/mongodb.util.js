const { MongoClient } = require("mongodb");

class MongoDB{
    static client;
    static async connect(uri) {
        if (this.client) return this.client;

        this.client = new MongoClient(uri);
        await this.client.connect(); // Kết nối
            return this.client;
    };
}
module.exports = MongoDB;