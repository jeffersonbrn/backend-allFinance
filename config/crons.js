/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable object-curly-spacing */
/* eslint-disable semi */
/* eslint-disable max-len */
//const ActiveSession = require('../models/activeSession');
//const User = require('../models/user');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  tokensCleanUp: function () {
    const date = new Date();
    const daysToDelete = 1;
    const deletionDate = new Date(date.setDate(date.getDate() - daysToDelete));
    const deleteday = prisma.activeSession.deleteMany({
      where: {
        date: deletionDate,
      },
    });

    const deleteUser = prisma.user.deleteMany({ 
      where: { 
        email: "test@test.com"
      }}
    );
  },
};
