var Hapi = require('hapi')
var Path = require('path')
var Good = require('good')
var Inert = require('inert')
var Fs = require('fs')
var DummyFileRelativePath = 'images/global.jpg'
var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({port:3000})

server.route({
  method : 'GET',
  path : '/images/{category}/{entry}',
  handler : function (request, reply){
    var fileRelativePath = 'images/' + encodeURIComponent(request.params.category)+ '/' + encodeURIComponent(request.params.entry);
    var fileExist = Fs.existsSync(__dirname + '/public/' + fileRelativePath);
    if (fileExist){
       reply.file(fileRelativePath);
    }else{
       reply.file(DummyFileRelativePath);
    }
  }
});

server.ext('onRequest', function(request, next){
  console.log(request.path, request.query);
  next();
})

server.register({
  register : Inert,
  options : {
  }
}, function (err) {
    if (err) { 
        throw err;
    }
    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});

server.register({
  register : Good,
  options : {
    reporters : [
      {
        reporter : require('good-console'),
        events : {
          response : '*',
          log : '*'
        }
      }
    ]
  }
}, function (err){
  if (err){
    throw err;
  }
})
