/* eslint no-param-reassign: 0*/
const crawler = require('./api');

module.exports = (function alunoFacade(sessionCookie) {
  const aluno = {
    turmas: [],
  };

  function getAluno() {
    return new Promise((resolve, reject) => {
      if (!sessionCookie) reject('missing sessionCookie');

      return crawler.getCodigoAluno(sessionCookie)
        .then((data) => {
          aluno.codigo = data;
          return resolve(aluno);
        }, reject)
        .catch(err => reject(err));
    });
  }

  function getParamsBoletim(codAluno) {
    aluno.codigo = codAluno;
    return crawler.getParamsBoletim(sessionCookie, codAluno);
  }

  function getNotasAllTurmas(turmas) {
    aluno.turmas = turmas;

    const promises = turmas.map(turma => crawler.getNotas(sessionCookie, turma.CODIGOENTURMACAO));

    return Promise.all(promises);
  }

  function mapTurmas(disciplinas) {
    const cleanClasses = turmas => turmas.map(t => ({
      cursoId: t.CODIGOCURSO,
      codigoEnturmacao: t.CODIGOENTURMACAO,
      ano: t.ANO,
      semestre: t.SEMESTRE,
      descricao: t.DESCRICAO,
      codigo: t.TURMA,
      periodo: `${t.ANO}|${t.SEMESTRE}`,
    }));

    const cleanSubject = (subjects, turmas) => {
      subjects.map((d) => {
        const boletim = d.boletim.map((c) => {
          const aps = c.aps ? parseInt(c.aps, 10) : 0;
          const parciais = c.parciais ? c.parciais : [];
          const faltasTotal = c.faltas ? parseInt(c.faltas, 10) : 0;

          return {
            descricaoDisciplina: c.cadeira,
            faltas: {
              total: faltasTotal,
              aps,
            },
            notas: {
              conceito: c.conceitoFinal,
              resultado: c.resultado,
              parciais,
            },
          };
        });

        return turmas.find((turma, idx, turmaArray) => {
          if (turma.codigoEnturmacao === d.enturmacao) {
            turmaArray[idx].disciplinas = boletim;
          }

          return turmaArray;
        });
      });

      return turmas;
    };

    let turmas = cleanClasses(aluno.turmas);
    turmas = cleanSubject(disciplinas, turmas);

    return { codigo: aluno.codigo, turmas };
  }

  function getTurmas() {
    return new Promise((resolve, reject) => {
      if (!aluno || !aluno.codigo) throw new Error('missing aluno.codigo');

      crawler
        .then(getParamsBoletim)
        .then(getNotasAllTurmas)
        .then(mapTurmas)
        .then((resAluno) => {
          resolve(resAluno);
        })
        .catch(reject);
    });
  }

  return {
    get: getAluno,
    getTurmas,
  };
});
