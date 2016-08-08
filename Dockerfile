FROM node:argon

RUN apt-get update &&\
    apt-get install -y libgtk2.0-0 libgconf-2-4 \
    libasound2 libxtst6 libxss1 libnss3 xvfb

WORKDIR /app

COPY . ./

RUN npm install
RUN chmod +x ./entrypoint.sh

ENV PASSWORD ${PASSWORD}

ENTRYPOINT ["./entrypoint.sh"]

CMD DEBUG=nightmare node index.js ${PASSWORD}
