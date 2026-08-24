const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Rota de teste de comunicação
app.get("/ping", (req, res) => {
  res.send("Servidor Manguezal rodando perfeitamente!");
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT || 3001}`);
});