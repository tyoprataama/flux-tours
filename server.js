const dotenv = require('dotenv');

dotenv.config({ path: './init.env' });
const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
