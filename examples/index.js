var Nark = require('./../index');

nark = Nark.config({});

nark.log('Hola bartola Ü');

nark.log({foo:'12',bar:'13'});

nark.log(['hey there']);

var hey = function () {
  var hola = 'asd';
};

nark.log(hey);

nark.warning('Warning!!');

nark.danger('There was an error somewhere',{foo:'hola',bar:'bartola'});

nark.important('HEY, this is an important message, look at me');

nark.log('This is a table',{
  'Value 1 ':'123',
  'Value 2':'234'
});
