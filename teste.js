'use strict';

const Easyac = require('./lib/index');

const data = {
  username: "631420378",
  unity: "63",
  password: process.env.password
}

const cookie = "plgpogipjmfngh6d1kmkpfeia0"
const { username, password, unity } = data;

// Easyac
//   .login(username, password, unity)
//   .then((cookie) => {
//     console.log(cookie);
//   });

let aluno = {
  turmas: [],
  codigo: null,
};

Easyac
  .getCodigoAluno(cookie)
  .then((codAluno) => {
    aluno.codigo = codAluno;
    return Easyac.getParamsBoletim(cookie, codAluno);
  })
  .then(turmas => {
    aluno.turmas = turmas;

    let promises = turmas.map((turma) => {
      return Easyac.getNotas(cookie, turma.CODIGOENTURMACAO);
    });

    return Promise.all(promises);
  })
  .then(res => {
    res.map(console.log);
    return;
  })
  // .then(() => {
  //   let promises = aluno.turmas.map((turma) => {
  //     return Easyac.getFrequencia(cookie, aluno, turma.ANO, turma.SEMESTRE);
  //   });
  //
  //   return Promise.all(promises);
  // })
  // .then(res => {
  //   res.map(console.log);
  // });

// const StudentBot = Easyac.aluno(cookie);
// StudentBot.get()
//   .then(() => StudentBot.getTurmas())
//   .then((botData) => {
//
//   })
//   .catch(err => debug(err));
