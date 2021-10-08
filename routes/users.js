/* eslint-disable no-var */
/* eslint-disable space-before-blocks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable keyword-spacing */
/* eslint-disable spaced-comment */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable brace-style */
/* eslint-disable quotes */
/* eslint-disable new-cap */
/* eslint-disable object-curly-spacing */
/* eslint-disable semi */
// eslint-disable-next-line new-cap
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
//const User = require('../models/user');
//const ActiveSession = require('../models/activeSession');
const reqAuth = require("../middlewares/safeRoutes").reqAuth;
const { smtpConf } = require("../config/config");
const { PrismaClient } = require("@prisma/client");
const { rmSync } = require("fs");
const prisma = new PrismaClient();

// route /admin/users/

//Listagem de Usuários
router.post("/user-profile", reqAuth, async function (req, res) {
  const all = await prisma.users
    .findMany({
      include: {
        users_types: true,
        companies: true,
      },
    })
    .then((all) => {
      if (all) {
        const allUsers = all.map(function (item) {
          const x = item;
          x.password = undefined;
          x.users_types_id = x.users_types.type;
          x.companies_id = x.companies.name;
          return x;
        });
        res.json({ success: true, users: allUsers });
      } else {
        res.json({ success: false });
      }
    });
});

// listando dados para relacionamento de tabelas
router.get("/allCompanies", reqAuth, async (req, res) => {
  const allCompanies = prisma.companies.findMany().then((allCompanies) => {
    const Companies = allCompanies.map(function (item) {
      const userComp = item;
      return userComp;
    });
    res.json({ success: true, companies: allCompanies });
  });
});
router.get("/allUserTypes", reqAuth, async (req, res) => {
  const allTypeUsers = await prisma.users_types
    .findMany()
    .then((allTypeUsers) => {
      const TypeUser = allTypeUsers.map(function (item) {
        const typeUser = item;
        return typeUser;
      });
      res.json({ success: true, typeUser: allTypeUsers });
    });
});

// Construção de rota para registro de usuários
router.post("/createUser", reqAuth, async (req, res) => {
  const { name, cpf, email, password, users_types_id, companies_id } = req.body;
  const createUser = await prisma.users
    .findFirst({
      where: {
        cpf: cpf,
      },
    })
    .then((createUser) => {
      if (createUser) {
        res.json({ success: false, msg: "E-mail já cadastrado" });
      } else if (password.length < 6) {
        // eslint-disable-next-line max-len
        res.json({
          success: false,
          msg: "A senha deve ter pelo menos 6 caracteres",
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, null, async (err, hash) => {
            if (err) throw err;
            const createUser = await prisma.users.create({
              data: {
                name: name,
                cpf: cpf,
                email: email,
                password: hash,
                users_types_id: users_types_id,
                companies_id: companies_id,
              },
            });
          });
          return res.json({ success: true, msg: "Usuário criado com sucesso" });
        });
      }
    });
});

// rota para criação de usuários

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then((user) => {
      if (user) {
        res.json({ success: false, msg: "E-mail já cadastrado" });
      } else if (password.length < 6) {
        // eslint-disable-next-line max-len
        res.json({
          success: false,
          msg: "A senha deve ter pelo menos 6 caracteres",
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, null, async (err, hash) => {
            if (err) throw err;
            const createUser = await prisma.users.create({
              data: {
                name: name,
                email: email,
                password: hash,
              },
            });
          });
          return res.json({ success: true, msg: "Usuário criado com sucesso" });
        });
      }
    });
});

// Construção de rota para login de usuários

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const findEmail = await prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then((findEmail) => {
      if (!findEmail) {
        return res.json({ success: false, msg: "Credenciais incorretas" });
      }
      bcrypt.compare(
        password,
        findEmail.password,
        async function (err, isMatch) {
          if (isMatch) {
            const token = jwt.sign(findEmail, config.secret, {
              expiresIn: 86400, // 1 week
            });
            // Don't include the password in the returned user object
            //const query = {userId: user._id, token: 'JWT ' + token};
            const CriarSessão = await prisma.activeSession
              .create({
                data: {
                  userId: findEmail.id,
                  token: token,
                },
              })
              .then((CriarSessão) => {
                findEmail.password = null;
                return res.json({
                  success: true,
                  token: token,
                  findEmail,
                });
              });
          } else {
            return res.json({ success: false, msg: "Credenciais erradas" });
          }
        }
      );
    });
});

// Função para solicitar envio de email para resetar senha
router.post("/forgotpassword", (req, res) => {
  const { email } = req.body;
  const errors = [];

  if (!email) {
    errors.push({ msg: "Por favor, informe um e-mail válido" });
  }

  const findEmail = prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then((findEmail) => {
      if (!findEmail) {
        errors.push({ msg: "E-mail informado não existe" });
        res.json({ success: false, errors: errors });
      } else {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport(smtpConf);

        if (process.env.DEMO != "yes") {
          // send mail with defined transport object
          transporter.sendMail({
            from: '"Automação Fiscal" <' + smtpConf.auth.user + ">", // sender address
            to: email, // list of receivers
            subject: "Automação Fiscal - Resetar Senha", // Subject line
            // eslint-disable-next-line max-len
            html:
              "<h1>Olá, " +
              findEmail.name +
              '</h1><br><p>Se você quer resetar sua senha, por favor, clique no link a seguir:</p><br><p><a href="' +
              "http://localhost:3000/auth/confirm-password/" +
              findEmail.id +
              '">' +
              "Resete sua senha clicando aqui" +
              '</a></p><br><p>Se não foi você que solicitou esse pedido, contate-nos através do nosso endereço de e-mail: "' +
              smtpConf.auth.user +
              "</p>", // html body
          });
        }
        res.json({ success: true });
      }
    });
});

// rota para redifinição de senha
router.post("/resetpass/:id", (req, res) => {
  const errors = [];
  const userID = +req.params.id;

  let { password } = req.body;

  if (password.length < 6) {
    errors.push({ msg: "A senha deve conter pelo menos 6 caracteres" });
  }
  if (errors.length > 0) {
    res.json({ success: false, msg: errors });
  } else {
    // const query = { _id: userID };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        var data = new Date();
        var idUser = userID;
        if (err) throw err;
        password = hash;
        const reset = prisma.users
          .update({
            where: {
              id: idUser,
            },
            data: {
              modified: data,
              password: password,
            },
          })
          .then((reset) => {
            if (err) {
              res.json({ success: false, msg: err });
            }
            res.json({ success: true });
          });
      });
    });
  }
});

// logout de usuário em tela logada
router.post("/logout", reqAuth, async function (req, res) {
  const token = req.body.token;

  const deleteToken = await prisma.activeSession
    .deleteMany({
      where: {
        token: token,
      },
    })
    .then((deleteToken) => {
      res.json({ sucess: true, msg: "Usuário não está mais logado" });
    });
});

router.post("/edit", reqAuth, async function (req, res) {
  const { userID, name, email } = req.body;

  const userEdit = await prisma.users
    .findUnique({
      where: {
        id: userID,
      },
    })
    .then((userEdit) => {
      if (userEdit) {
        const update = prisma.users
          .update({
            where: {
              id: userID,
            },
            data: {
              name: name,
              email: email,
            },
          })
          .then((update) => {
            if (err) {
              res.json({
                success: false,
                msg: "Algo deu errado, procure o administrador",
              });
            }
            res.json({ success: true });
          });
      } else {
        res.json({ success: false });
      }
    });
});

router.post("/check/resetpass/:id", (req, res) => {
  const userID = req.params.id;
  const restPass = prisma.users.findUnique({ _id: userID }).then((restPass) => {
    if (restPass.length == 1 && restPass[0].resetPass == true) {
      res.json({ success: true }); // reset password was made for this user
    } else {
      res.json({ success: false });
    }
  });
});

router.post("/checkSession", reqAuth, function (req, res) {
  res.json({ success: true });
});

/* router.post("/teste", reqAuth, async function (req, res) {
  //res.json({ sucesso: true, msg: "OK" });
  const user = await prisma.users.findMany().then((user) => {
    res.json(user);
  });
}); */

/*
router.post('/all', reqAuth, function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.json({success: false});
    }
    users = users.map(function(item) {
      const x = item;
      x.password = undefined;
      x.__v = undefined;
      return x;
    });
    res.json({success: true, users: users});
  });
});

router.post('/edit', reqAuth, function(req, res) {
  const {userID, name, email} = req.body;

  User.find({_id: userID}).then((user) => {
    if (user.length == 1) {
      const query = {_id: user[0]._id};
      const newvalues = {$set: {name: name, email: email}};
      User.updateOne(query, newvalues, function(err, cb) {
        if (err) {
          // eslint-disable-next-line max-len
          res.json({success: false, msg: 'There was an error. Please contract the administator'});
        }
        res.json({success: true});
      });
    } else {
      res.json({success: false});
    }
  });
});


router.post('/check/resetpass/:id', (req, res) => {
  const userID = req.params.id;
  User.find({_id: userID}).then((user) => {
    if (user.length == 1 && user[0].resetPass == true) {
      res.json({success: true}); // reset password was made for this user
    } else {
      res.json({success: false});
    }
  });
});

router.post('/resetpass/:id', (req, res) => {
  const errors = [];
  const userID = req.params.id;

  let {password} = req.body;

  if (password.length < 6) {
    errors.push({msg: 'Password must be at least 6 characters'});
  }
  if (errors.length > 0) {
    res.json({success: false, msg: errors});
  } else {
    const query = {_id: userID};
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) throw err;
        password = hash;
        const newvalues = {$set: {resetPass: false, password: password}};
        User.updateOne(query, newvalues, function(err, usr) {
          if (err) {
            res.json({success: false, msg: err});
          }
          res.json({success: true});
        });
      });
    });
  }
});

router.post('/forgotpassword', (req, res) => {
  const {email} = req.body;
  const errors = [];

  if (!email) {
    errors.push({msg: 'Please enter all fields'});
  }
  User.find({email: email}).then((user) => {
    if (user.length != 1) {
      errors.push({msg: 'Email Address does not exist'});
    }
    if (errors.length > 0) {
      res.json({success: false, errors: errors});
    } else {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(smtpConf);

      const query = {_id: user[0]._id};
      const newvalues = {$set: {resetPass: true}};
      User.updateOne(query, newvalues, function(err, usr) {});

      // don't send emails if it is in demo mode
      if (process.env.DEMO != 'yes') {
        // send mail with defined transport object
        transporter.sendMail({
          from: '"Creative Tim" <' + smtpConf.auth.user + '>', // sender address
          to: email, // list of receivers
          subject: 'Creative Tim Reset Password', // Subject line
          // eslint-disable-next-line max-len
          html: '<h1>Hey,</h1><br><p>If you want to reset your password, please click on the following link:</p><p><a href="' + 'http://localhost:3000/auth/confirm-password/' + user._id + '">"' + 'http://localhost:3000/auth/confirm-email/' + user._id + + '"</a><br><br>If you did not ask for it, please let us know immediately at <a href="mailto:' + smtpConf.auth.user + '">' + smtpConf.auth.user + '</a></p>', // html body
        });
        res.json({success: true});
      }
      res.json({success: true, userID: user[0]._id});
    }
  });
});

router.post('/register', (req, res) => {
  const {name, email, password} = req.body;

  User.findOne({email: email}).then((user) => {
    if (user) {
      res.json({success: false, msg: 'Email already exists'});
    } else if (password.length < 6) {
      // eslint-disable-next-line max-len
      res.json({success: false, msg: 'Password must be at least 6 characters long'});
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) throw err;
          const query = {name: name, email: email,
            password: hash};
          User.create(query, function(err, user) {
            if (err) throw err;

            const transporter = nodemailer.createTransport(smtpConf);

            // don't send emails if it is in demo mode
            if (process.env.DEMO != 'yes') {
            // send mail with defined transport object
              transporter.sendMail({
                from: '"Creative Tim" <' + smtpConf.auth.user + '>',
                to: email, // list of receivers
                subject: 'Creative Tim Confirm Account', // Subject line
                // eslint-disable-next-line max-len
                html: '<h1>Hey,</h1><br><p>Confirm your new account </p><p><a href="' + 'http://localhost:3000/auth/confirm-email/' + user._id + '">"' + 'http://localhost:3000/auth/confirm-email/' + user._id + '"</a><br><br>If you did not ask for it, please let us know immediately at <a href="mailto:' + smtpConf.auth.user + '">' + smtpConf.auth.user + '</a></p>', // html body
              });
              // eslint-disable-next-line max-len
              res.json({success: true, msg: 'The user was succesfully registered'});
            }
            // eslint-disable-next-line max-len
            res.json({success: true, userID: user._id, msg: 'The user was succesfully registered'});
          });
        });
      });
    }
  });
});

router.post('/confirm/:id', (req, res) => {
  const userID = req.params.id;

  const query = {_id: userID};

  const newvalues = {$set: {accountConfirmation: true}};
  User.updateOne(query, newvalues, function(err, usr) {
    if (err) {
      res.json({success: false});
    }
    res.json({success: true});
  });
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, (err, user) => {
    if (err) throw err;

    if (!user) {
      return res.json({success: false, msg: 'Wrong credentials'});
    }

    if (!user.accountConfirmation) {
      return res.json({success: false, msg: 'Account is not confirmed'});
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 86400, // 1 week
        });
        // Don't include the password in the returned user object
        const query = {userId: user._id, token: 'JWT ' + token};
        ActiveSession.create(query, function(err, cd) {
          user.password = null;
          user.__v = null;
          return res.json({
            success: true,
            token: 'JWT ' + token,
            user,
          });
        });
      } else {
        return res.json({success: false, msg: 'Wrong credentials'});
      }
    });
  });
});

router.post('/checkSession', reqAuth, function(req, res) {
  res.json({success: true});
});

router.post('/logout', reqAuth, function(req, res) {
  const token = req.body.token;
  ActiveSession.deleteMany({token: token}, function(err, item) {
    if (err) {
      res.json({success: false});
    }
    res.json({success: true});
  });
});
*/

module.exports = router;
