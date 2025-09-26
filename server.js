const app = require("./app");
const config = require("./app/config");

// chạy server
app.listen(config.app.port, () => {
  console.log(`Server dang chay tai http://localhost:${config.app.port}`);
});
