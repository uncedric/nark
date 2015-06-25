# Nark
Send alerts (emails) when something goes terrible wrong or an important event happens in your app, it also helps to keep track of the logs of your application to generate reports with that information.

## Introduction
Nark uses nodemailer to send email alerts and sequelize to store all the logs with additional information.

## Installation

```
npm install nark
```

## Configuration
Enter your own credentials.

```
var Nark = require('nark');

nark = Nark.config({
  reportTo:'jhondoe@xyz.com',
  mailSettings:{
    service: 'Gmail',
    auth: {
        user: 'alerts@gmail.com',
        pass: '123456'
    }
  },
  dbSettings:{
    database:'mydb',
    user:'myuser',
    password:'mypasswd',
    host:'localhost'
  }
});
```

# Documentation
Save log and print it:

```
nark.log('Hola bartola');
```

Save warning and print it in console

```
nark.warning('this is a warning that won\'t be sent');
```

Important message, will be saved in your database, printed in console and sent by email

```
nark.important('This is an important message that will be sent to the  "reportTo" value');
```

Errors, when shit hit the fan :/

```
nark.danger('Bad news :(');
```

Do you need to send additional information? nark can help you

```
nark.important('Important message with extra information',{foo:123123,bar:4234234});
```

The information will arrive to your emails like this

![]()
