(function () {
  'use strict';

  var nodemailer = require('nodemailer');
  var colors = require('colors');
  var Sequelize = require('sequelize');

  module.exports.config = function (params) {
    console.log('Iniciando Nark :B');

    return new Nark(params);

  };

  function Nark(params) {

    if (typeof params.dbSettings==='object') {
      var sequelize = new Sequelize(
        params.dbSettings.database,
        params.dbSettings.user,
        params.dbSettings.password,{
        host:params.dbSettings.host,
        logging:false,
        dialect:'mysql'
      });

      var Log = sequelize.define('nark_log', {

        date: {
          type: Sequelize.DATE,
          defaultValue: new Date()
        },
        type: {
          type: Sequelize.STRING(10),
        },
        text: {
          type: Sequelize.STRING(250),
        },
        details:{
          type: Sequelize.STRING
        }

      }, {
        freezeTableName: true
      });

      Log
        .sync()
          .done(function (data) {
          });

      this.Log = Log;
    }

    this.database = params.dbSettings;
    this.mail = params.mailSettings;
    this.reportTo = params.reportTo;

    this.transporter = nodemailer.createTransport({
        service: this.mail.service,
        auth: {
            user: this.mail.auth.user,
            pass: this.mail.auth.pass
        }
    });
  }

  Nark.prototype.log = function (text,data) {
    console.log(text);

    data = Nark._table(data);

    this.Log.create({
      text:text,
      type:'log',
      datails:text + data
    }).catch(function (err) {
      console.error(err);
    });
  };

  Nark.prototype.error = function (text,data) {
    console.error(colors.red(text));
    this.Log.create({
      text:text,
      type:'error',
      datails:'Descripción detallada'
    }).catch(function (err) {
      console.error(err);
    });
  };

  Nark.prototype.alert = function (text,data,callback) {

    console.error(colors.red(text));
    data = Nark._table(data);

    this.Log.create({
      text:text,
      type:'alerta',
      datails:text + data
    }).catch(function (err) {
      console.error(err);
    });


    var mailOptions = {
			from: 'Nark <alerts@nark.com>',
			to: this.reportTo,
			subject: 'Nark Alert',
			text: text + data,
			html: text + data
		};

    var transporter = this.transporter;

    transporter.sendMail(mailOptions,function (err,data) {
      if (err)
        console.error(err);
    });
  };

  Nark._table = function (data) {

    var table = '<h3>Details</h3>';
    table += '<table width="100%" border="1" style="margin-top:50px">';

    for(var i in data){
      table += '<tr>';
      table += '<td>' + i + '</td>';
      table += '<td>' + data[i] + '</td>';
      table += '</tr>';
    }

    table += '</table>';
    return table;
  };

})();