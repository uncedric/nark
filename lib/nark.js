(function () {
  'use strict';

  var nodemailer = require('nodemailer');
  var colors = require('colors');
  var Sequelize = require('sequelize');
  var moment = require('moment');
  var Table = require('cli-table');

  module.exports.config = function (params) {

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
          .catch(function (err) {
            console.error(err);
          });

      this.Log = Log;
    }
    this.app = params.app||''; // Name of the project, it will be sent in the email so you can track different apps

    if (typeof params.dbSettings === 'object') {
        this.database = params.dbSettings;
    }

    if (typeof params.mailSettings === 'object') {
        this.mail = params.mailSettings;
    }

    if (typeof params.mail === 'object') {
      this.transporter = nodemailer.createTransport({
          service: this.mail.service,
          auth: {
              user: this.mail.auth.user,
              pass: this.mail.auth.pass
          }
      });
    }


    this.reportTo = params.reportTo;
  }

  //  Print a message and save it on the database
  Nark.prototype.log = function (text,data) {

    text = Nark._string(text);
    console.log(Nark._date() + text);

    data = Nark._table(data);

    if(this.Log){
      this.Log.create({
        text:text,
        type:'log',
        datails:data
      }).catch(function (err) {
        console.error(err);
      });
    }

  };

  // Print an error message (red color) and save it
  Nark.prototype.warning = function (text,data) {

    console.error(Nark._date() + colors.yellow(text));

    data = Nark._table(data)||'';

    if (this.Log) {
      this.Log.create({
        text:text,
        type:'warning',
        datails:data
      }).catch(function (err) {
        console.error(err);
      });
    }
  };

  //  Print an error message and send an alert by email to notify about it
  Nark.prototype.danger = function (text,data,callback) {

    text = Nark._string(text);

    console.error(Nark._date() + colors.red(text));

    data = Nark._table(data)||'';

    if (this.Log) {
      this.Log.create({
        text:text,
        type:'danger',
        datails:data
      }).catch(function (err) {
        console.error(err);
      });
    }


    if (this.transporter) {
      var mailOptions = {
  			from: 'Nark <alerts@nark.com>',
  			to: this.reportTo,
  			subject: 'Nark Alert: ' + this.app,
  			text: text + data,
  			html: text + data
  		};

      var transporter = this.transporter;

      transporter.sendMail(mailOptions,function (err,data) {
        if (err)
          console.error(err);
      });
    }
  };

  // Print message and send notification by email
  Nark.prototype.important = function (text,data,callback) {

    text = Nark._string(text);

    console.log(Nark._date() + colors.blue(text));

    data = Nark._table(data)||'';

    if (this.Log) {
      this.Log.create({
        text:text,
        type:'important',
        datails:text + data
      }).catch(function (err) {
        console.error(err);
      });
    }

    if (this.transporter) {
      var mailOptions = {
  			from: 'Nark <alerts@nark.com>',
  			to: this.reportTo,
  			subject: 'Nark Alert: ' + this.app,
  			text: text + data,
  			html: text + data
  		};

      var transporter = this.transporter;

      transporter.sendMail(mailOptions,function (err,data) {
        if (err)
          console.error(err);
      });
    }

  };

  // Consume an array and make a table out of it that will be sent by email
  Nark._table = function (data) {

    var table = new Table({
      head: ['Field', 'Value']
    });

    if (data) {

      for(var key in data){
        table.push([key,data[key]]);
      }

      console.log(table.toString());
    }


    table = '<h3>Details</h3>';
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

  // Date before printing text
  Nark._date = function () {
    return colors.green(moment(new Date()).format('YYYY/MM/DD HH:mm') + ' ');
  };

  // Convert the user input to string in order to be able to insert it to the DB
  Nark._string = function (text) {
    if (typeof text === 'object') {
      return JSON.stringify(text);
    }else{
      return text;
    }
  };

})();
