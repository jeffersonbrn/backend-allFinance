/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable spaced-comment */
/* eslint-disable object-curly-spacing */
/* eslint-disable semi */
/* eslint-disable max-len */
//const ActiveSession = require('../models/activeSession');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const reqAuth = (req, res, next) => {
  const token = String(req.headers.authorization);
  const findToken = prisma.activeSession
    .findMany({
      where: {
        token: token,
      },
    })
    .then((findToken) => {
      if (findToken.length == 1) {
        return next();
      } else {
        return res.json({
          sucesso: false,
          msg: "O usuário não está conectado",
        });
      }
    });
};

module.exports = {
  reqAuth: reqAuth,
};
