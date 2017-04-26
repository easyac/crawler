const Easyac = require('./lib/index');

const data = {
  username: '631420378',
  unity: '63',
  password: process.env.PASS,
};

const { username, password, unity } = data;

Easyac
  .login(username, password, unity)
  .then((cookie) => {
    const StudentBot = Easyac.aluno(cookie);
    StudentBot.get()
      .then(() => StudentBot.getTurmas())
      .then((botData) => {
        console.log(JSON.stringify(botData));
      });
  });
