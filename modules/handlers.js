var fs = require('fs');
var formidable = require('formidable');
var mime = require('mime-types');

var fileName,
    filePath = './uploaded/'; //path for uploading files

exports.welcome = function(request, response) {
    console.log("Rozpoczynam obsługę żądania welcome.");
    fs.readFile('templates/start.html', function(err, html) {
        response.writeHead(200, mime.contentType('templates/start.html'));
        //response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.write(html);
        response.end();
    });
};

exports.error = function(request, response) {
    console.log("Nie wiem co robić.");
    response.write("404 :(");
    response.end();
};

exports.upload = function(request, response) {
    console.log("Rozpoczynam obsługę żądania upload.");
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
        response.writeHead(200, mime.contentType('templates/upload.html'));
        //response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        if (files.upload.size) {
            fileName = files.upload.name;
            fs.renameSync(files.upload.path, filePath + fileName);
            fs.readFile('templates/upload.html', function(err, html) {
                html = html.toString().replace('%fileName%', fileName);
                response.write(html);
                response.end();
            });
        } else {
            response.write('<h1>You forgot to add file! <a href="/">Try Again</a><h1>');
            response.end();
        }
    });
};

exports.show = function(request, response) {
    fs.readFile(filePath + fileName, "binary", function(error, file) {
        response.writeHead(200, mime.contentType(filePath + fileName));
        response.write(file, "binary");
        response.end();
    });
};

exports.style = function(reguest, response) {
    fs.readFile('templates/style.css', function(err, style) {
        response.writeHead(200, { 'Content-Type': "text/css" });
        response.write(style);
        response.end();
    });
};