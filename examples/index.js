var Nark = require('./../index');

nark = Nark.config({});

nark.log('Hola bartola Ü');

nark.warning('Warning!!');

nark.danger('There was an error somewhere',{foo:'hola',bar:'bartola'});

nark.important('HEY, this is an important message, look at me');
