/* eslint no-param-reassign: 0, global-require: 0*/
const debug = require('debug')('crawler');

module.exports = (function alunoFacade(sessionCookie) {
  const crawler = require('./api');
  const aluno = {
    turmas: [],
  };

  function getAluno() {
    debug('Aluno.get() started');
    return new Promise((resolve, reject) => {
      if (!sessionCookie) reject('missing sessionCookie');

      return crawler.getCodigoAluno(sessionCookie)
        .then((data) => {
          aluno.codigo = data;
          debug('Aluno.get() finished');
          return resolve(aluno);
        }, reject)
        .catch((err) => {
          debug('Aluno.get() err: %o', err);
          reject(err);
        });
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

        turmas.find((turma, idx) => {
          if (turma.codigoEnturmacao === d.enturmacao) {
            turmas[idx].disciplinas = boletim;
            return boletim;
          }
          return false;
        });
        return turmas;
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

      getParamsBoletim(aluno.codigo)
        .then(getNotasAllTurmas)
        .then(mapTurmas)
        .then(resolve)
        .catch(reject);
    });
  }

  return {
    get: getAluno,
    getTurmas,
  };
});
