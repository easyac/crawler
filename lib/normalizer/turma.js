'use strict';

module.exports = (function(){

  const mergeEnturmaTurma = (turmas, enturmacoes) => {
    const mapEntur = (el) => {
      return {
        codigoEnturmacao: el.codigoEnturmacao,
        disciplinas: el.disciplinas,
      };
    };

    return turmas.map((turma) => {
      let entur = enturmacoes
      .filter((entur) => {
        if(entur.ano === turma.ano && entur.semestre === turma.semestre)
          return entur;
      })
      .map(mapEntur)
      .reduce((el,cur) => el+=cur);

      turma.codigoEnturmacao = entur.codigoEnturmacao;
      turma.disciplinas      = entur.disciplinas;
      return turma;
    });
  };

  const normalizeFromFrequencia = (data) => {
    return data.consultaFrequencia.turmas.map((turma) => {
      let periodo = turma.periodo.split('|');
      return {
        codigo: turma.codigo,
        codigoEnturmacao: null,
        cursoId: turma.curso,
        ano: periodo[0],
        semestre: periodo[1],
        periodo: turma.periodo,
        descricao: turma.descricao
      };
    });
  };

  const normalizeEnturmacao = (data) => {
    return data.map((data) => {

      let codigo = data.enturmacoes[0] ?
        data.enturmacoes[0].codigoEnturmacao
        : 0;

      let disciplinas = data.enturmacoes[0] ?
        data.enturmacoes[0].disciplinas
        : [];

      return {
        ano: data.ano,
        semestre: data.semestre,
        codigoEnturmacao: codigo,
        disciplinas: disciplinas
      };

    });
  };


  return {
    normalizeFromFrequencia: normalizeFromFrequencia,
    normalizeEnturmacao: normalizeEnturmacao,
    mergeEnturmaTurma: mergeEnturmaTurma
  };
})();
