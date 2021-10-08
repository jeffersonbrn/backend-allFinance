const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const reqAuth = require("../middlewares/safeRoutes").reqAuth;
const { smtpConf } = require("../config/config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var os = require("os");
const fs = require("fs");

router.get("/teste", async function (req, res) {
  //DCTFM       202119300076364210001520340PARCERIAS INTELIGENTES - GESTAO EMPRESARIAL, CONSULTORIA E TRN00000000000002021070000000000001072021310720210000000000                                                                                                                                                                                                               0000000000
  let declaracao = "DCTFM";
  let cnpj = "07636421000152";
  let razao_social =
    "PARCERIAS INTELIGENTES - GESTAO EMPRESARIAL, CONSULTORIA E TREINAMENTO LTDA";
  let ano_declaracao = "2021";
  let mes_declaracao = "07";
  let base_inicial = "01072021";
  let base_final = "31072021";
  let data_ocorrencia = "00000000";
  let uf = "RN";
  let situacao = "00";

  //R010763642100015220210700000000001073107000000000000020700000500000000000240
  am = ano_declaracao + mes_declaracao;
  let inicio_periodo = "0107";
  let final_periodo = "3107";
  let forma_tributacao = "2";
  let qualificacao_pj = "07";
  let pj_levantou_balanco = "0";
  let pj_debitos_scp = "0";
  let pj_optante_simples = "0";
  let pj_optante_cprb = "0";
  let pj_inativa = "0";
  let pj_variacoespj_inativa = "5";
  let regime_apuracao = "2";
  let situacao_pj = "4";
  let opcoes_lei = "0";

  let length = razao_social.length;
  if (length < 60) razao_social = razao_social.padEnd(60, " ");

  // Header
  let str = declaracao; // 01-Sistema
  str = str.padEnd(8, " "); // 02-Reservado Brancos
  str = str.padEnd(12, " "); // 03-Reservado Brancos
  str = str.padEnd(16, ano_declaracao); // 04-Ano de Competência da Declaração
  str = str.padEnd(20, "1930"); // 05-Reservado - Constante preencher com "1930"
  str = str.padEnd(21, "0"); // 06-"0" - Original "1" - Retificadora
  str = str.padEnd(35, cnpj); // 07-CNPJ do Contribuinte
  str = str.padEnd(36, "0"); // 08-Reservado Brancos
  str = str.padEnd(39, "350"); // 09-Versão - Constante preencher com "350"
  str = str.padEnd(99, razao_social); // 10-Nome Empresarial
  str = str.padEnd(101, uf); // 11-UF Domicílio
  str = str.padEnd(111, "0"); // 12-Reservado - Zeros
  str = str.padEnd(112, "0"); // 13-Reservado - Zeros
  str = str.padEnd(114, situacao); // 14-Situacao - “00” – Normal “01” – Extinção “02” – Fusão “03” – Incorporação/ Incorporada “04” – Incorporação/ Incorporadora “05” – Cisão Total “06” – Cisão Parcial
  str = str.padEnd(118, ano_declaracao); // 15-Ano de Competência da Declaração
  str = str.padEnd(120, mes_declaracao); // 16-Mes de Competência da Declaração
  str = str.padEnd(131, "0"); // 17-Reservado - Zeros
  str = str.padEnd(139, base_inicial); // 18-Período Base Inicial
  str = str.padEnd(147, base_final); // 19-Período Base Final
  str = str.padEnd(155, data_ocorrencia); // 20-Data de Ocorrência do Evento, Data de Ocorrência do Evento
  str = str.padEnd(156, "0"); // 21-Reservado - Zeros
  str = str.padEnd(157, "0"); // 22-Reservado - Zeros
  str = str.padEnd(364, " "); // 23-Reservado - Espaço em branco
  str = str.padEnd(374, "0"); // 24-Reservado - Zeros
  str = str.padEnd(376, "\r\n"); // 25-Delimitador de Registro

  let r01 = "R01"; // 01-Tipo de declaração
  r01 = r01.padEnd(17, cnpj); // 02-CNPJ declaração
  r01 = r01.padEnd(23, am); // 03-Mês e ano de correspondência
  r01 = r01.padEnd(24, 0); // 04-Situação
  r01 = r01.padEnd(32, 0); // 05-Data do evento, se situação 0 preencher com 0
  r01 = r01.padEnd(36, inicio_periodo); // 06-Inicio do período
  r01 = r01.padEnd(40, final_periodo); // 07-Fim do período
  r01 = r01.padEnd(41, 0); // 08-Declaração Retificadora
  r01 = r01.padEnd(53, 0); // 09-Numero do recibo de entrada a ser retificada
  r01 = r01.padEnd(54, forma_tributacao); // 10-Forma de tributação de lucro
  r01 = r01.padEnd(56, qualificacao_pj); // 11-Qualidicação de PJ
  r01 = r01.padEnd(57, pj_levantou_balanco); // 12-PJ levantou balanço/balancete de suspensão no mês
  r01 = r01.padEnd(58, pj_debitos_scp); // 13-PJ com débitos de SCP a serem declarados
  r01 = r01.padEnd(59, pj_optante_simples); // 14-PJ optante pelo Simples Nacional
  r01 = r01.padEnd(60, pj_optante_cprb); // 15-PJ optante pela CPRB
  r01 = r01.padEnd(61, pj_inativa); // 16-PJ inativa no mês da declaração
  r01 = r01.padEnd(62, pj_variacoespj_inativa); // 17-PJ Critério de Reconhecimento das Variações Monetárias dos Direitos de Crédito
  r01 = r01.padEnd(73, 0); // 18-Reservado
  r01 = r01.padEnd(74, regime_apuracao); // 19-Regime de Apuração da Contribuição para o PIS/Pasep e/ou da Cofins
  r01 = r01.padEnd(75, situacao_pj); // 20-Situação da PJ no mês da declaração
  r01 = r01.padEnd(76, opcoes_lei); // 21-Opções referentes à Lei n° 12.973/2014 para o ano-calendário de 2014
  r01 = r01.padEnd(86, " "); // 22-Reservado espaço em branco
  r01 = r01.padEnd(88, "\r\n"); // 23-Delimitador de Registro

  //R0207636421000152202107000000000PARCERIAS INTELIGENTES  GESTAO EMPRESARIAL CONSULTORIA E TREINAMENTO LTDA                                          0000RUA Dona Maria C�mara                   0018890                    Capim Macio         Natal                                             RN5908243000840364200400084000000000                anaraquel@parceriasinteligentes.com.br
  let r20 = "R20";
  r20 = r20.padEnd(17, cnpj); // 02-CNPJ declaração
  r20 = r20.padEnd(23, am); // 03-Mês e ano de correspondência
  r20 = r20.padEnd(24, 0); // 04-Situação
  r20 = r20.padEnd(32, 0); // 05-Data do evento, se situação 0 preencher com 0

  gerarArquivoRFB(str + r01);

  res.json({
    sucesso: true,
    msg: "OK",
    str,
  });
});

function gerarArquivoRFB(text) {
  fs.open("DCTFM_100_07_2021.RFB", "w", function (e, id) {
    fs.write(id, text + os.EOL, null, "utf8", function () {
      fs.close(id, function () {
        console.log("file is updated");
      });
    });
  });
}

module.exports = router;
