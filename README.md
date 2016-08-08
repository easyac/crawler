# Crawler Easyac

Nesse repositório estão os crawlers usados para buscar dados do portal do aluno.

Dentro de suas funcionalidades estão **Login** e **Consultar Frequencia**, por exemplo.

Foi desenvolvido principalmente utilizando [Nightmarejs](https://github.com/segmentio/nightmare) como navegação inicial e [Cheerio](https://github.com/cheeriojs/cheerio) para as demais requisições.

* [Exemplos](https://github.com/easyac/crawler#exemplos)
* [API](https://github.com/easyac/crawler#api)
    * [login](https://github.com/easyac/crawler#senacapiloginuser-pass-unidade)
    * [isLoggedIn](https://github.com/easyac/crawler#senacapiisloggedincookie)
    * [getParamsSituacaoCurricular]
    * [getSituacaoCurricular]
    * [getTitulos]
    * [getParamsFrequencia]
    * [getFrequencia]
* [FAQ](https://github.com/easyac/crawler#faq)    

    
## Exemplos
 
### Login
Para efetuar o login, basta fazer a chamada ao login passando o usuário, senha e unidade. Caso o login seja efetuado com sucesso, será retornado o cookie contento o valor de sua sessão. É a partir dele que as próximas requisições serão feitas.
```javascript
senacApi
    .login(user, password, unidade)
    .then((cookie) => {
        fs.writeFile('./cookie.json', JSON.stringify(cookie));
    })
    .catch((err) => console.log(err) );
```

### Ver Frequência
Para retornar a frequência são nessesários alguns passos: 
1. Deve-se buscar os parâmetros disponíveis para o usuário
2. A partir deles consultar a frequência da turma.

No exemplo abaixo lemos o cookie já salvo e buscamos a frequência do primeiro semestre de 2016.
```javascript
fs.readFile('./cookie.json', function (err, data) {
    let cookie = JSON.parse(data.toString());
    let codigoAluno = 1070153;

    senacApi.isLoogedIn(cookie.value)
      .then(function (data) {
        return senacApi.getParamsFrequencia(cookie.value, codigoAluno);
      })
      .then(function (data) {
        let periodo = '2016|1';

        let turma = data.modulos
          .filter((el, i) => el.periodo == periodo)
          .map((el, i) => el.turma)
          .reduce((prev, el) => el);

        return senacApi.getFrequencia(cookie.value, codigoAluno, turma);
      })
      .then(function(situacaoCurricular){
        console.log(JSON.stringify(situacaoCurricular));
      })
      .catch(function(err){
        console.log(err);
      });
});
```

## API

### login(user, pass, unidade)

Chamada de login ao portal do aluno. A api cria uma nova "janela" com o Nightmare, navega até o formulário de login do portal e preenche as credenciais. 

Caso o login seja efetuado com sucesso, será retornado o cookie contendo o valor da sessão. Se o login for negado, retornada um erro.

Parâmetros:

* `user`: Usuário usado para acessar o portal
* `pass`: Senha do usuário
* `unidade`: Unidade do usuário 

### isLoggedIn(cookie)

Verifica se a sessão ainda está ativa para o cookie passado. 

Parâmetros:

* `cookie`: Valor para `PHPSESSID`, ou cookie.value retornado do login

### getParamsSituacaoCurricular(cookie, codAluno)

Navega até a página de situação curricular e retorna os dados necessários para o método [getSituacaoCurricular](#getSituacaoCurricular).

Parâmetros: 

* `cookie`: Valor para `PHPSESSID`, ou cookie.value retornado do login
* `codAluno`: Código do Aluno


### getSituacaoCurricular(cookie, codAluno, codTurma)

Retorna o histórico de disciplinas. É possível visualizar as disciplinas aprovadas, cursando e reprovadas(ou que não compareceu).
 
Parâmetros: 

* `cookie`: Valor para `PHPSESSID`, ou cookie.value retornado do login
* `codAluno`: Valor retornado em [getCodigoAluno]()
* `codTurma`: Valor retornado em [getParamsSituacaoCurricular]



## FAQ

**Nome**

O nome **easyac** vem da combinação de *Easy* ("fácil", em inglês) e Senac (nome da instituição de ensino). Uma analogia ao que está sendo pregado nesse projeto: a facilidade de acesso aos dados do Portal do aluno. 


**É seguro?**

O projeto é opensource por alguns motivos, um deles é: Você pessoalmente pode verificar todas as requições feitas, de onde vem e para onde vai. Não guardamos sua senha em nenhum local, pode ficar tranquilo :smile:.


**É legal?**

Não sou perito em leis mas acho que é sim :smile:. Não há nenhum tipo de invasão sendo feita. O que é feito é uma automação de ações comumente tomadas por você, após o login o Easyac apenas navega por você e exibe os dados de forma mais limpa.

**Meus dados são gravados?**

Sim e Não. Não gravamos seus dados de acesso (usuário, senha, unidade), mas criamos uma camada de cache com a data de última atualização dos dados. 
Funciona assim: Ao acessar o Easyac o sistema faz, sem você perceber, uma busca nos dados no Portal do aluno, esses dados são salvos dentro de uma camada de Cache e a próxima vez que você acessar o Easyac os dados serão buscados diretamente do cache local e não mais do portal do aluno.

**Posso ajudar?**

Toda e qualquer ajuda, crítica, pull request, são bem vindas. Basta criar uma issue para isso :smile: 


## Instituição

Esse projeto não possue **NENHUM** vínculo com a [Faculdade SENACRS](http://www.senacrs.com.br/) nem com a empresa [GVDASA](http://www.gvdasa.com.br/).
