'use strict';

const cheerio = require('cheerio');
var Parser = {};


const parseSummary = (html) => {
    let $ = cheerio.load(html);
    let data = [];

    $('table.quadro tr').each((i, tr) => {
        $(tr).find('td').each((j, td) => {
            if($(td).hasClass('label')){
                data.push({
                    title: $(td).text().replace(':', '').trim(),
                    value: $(td).next().text().trim(),
                });
            }

        });
    });

    return data;
};

const parseData = (html) => {
    let $ = cheerio.load(html);
    let data = [];

    $('table.tabeladados tbody tr').each((i, tr) => {
        let tds = $(tr).find('td:not(.grupo)');

        if($(tds).eq(2).text().trim() !== '') {
            data.push({
                semestre: $(tds).eq(0).text(),
                periodo: $(tds).eq(1).text(),
                disciplina: $(tds).eq(2).text(),
                creditos: $(tds).eq(3).text(),
                cargaHoraria: $(tds).eq(4).text(),
                situacao: $(tds).eq(5).text(),
                nota: $(tds).eq(6).text(),
            });
        }
    });

    return data;
}


Parser.parse = function (html) {
    return {
        summary: parseSummary(html),
        data: parseData(html),
    };

};

module.exports = Parser;