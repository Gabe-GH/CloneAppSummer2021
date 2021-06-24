const server = require('../Server/server');

beforeAll(async() => {
    const app = await server;
})