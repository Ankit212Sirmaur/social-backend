const dotenv = require('dotenv');

dotenv.config();

const Port = process.env.Port;
const Client = process.env.Connected_fronted

module.exports = {
    Port, Client
}