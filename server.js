const http = require('http');
const fs = require('fs');
const url = require('url');
const db = require('./db');

const server = http.createServer(async(req, res)=> {
    //carga inicial de la pagina '/'
    if(req.url == '/' && req.method == 'GET'){
        fs.readFile('index.html', (err,file)=>{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(file);
            res.end();
        });
    }
    // RUTAS de candidato
    // POST
    if(req.url == '/candidato' && req.method == 'POST'){
        let params = null;
        req.on('data', body => {
            params = body
        });
        req.on('end', async() => {
            const paramsArray = Object.values(JSON.parse(params));
            const result = await db.crearCandidato(paramsArray);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end();
        });
    }
    // GET
    if(req.url == '/candidatos' && req.method == 'GET'){
        const result = await db.getCandidatos();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result.rows));
        res.end();
    }
    // PUT
    if(req.url.startsWith('/candidato') && req.method == 'PUT'){
        const id = url.parse(req.url, true).query.id;
        let params = null;
        req.on('data', body => {
            params = body;
        })
        req.on('end', async()=>{
            const paramsArray = Object.values(JSON.parse(params));
            paramsArray.unshift(id);
            const result = await db.actualizarCandidato(paramsArray);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end();
        });    
    }
    // DELETE
    if(req.url.startsWith('/candidato') && req.method == 'DELETE'){
        const id = url.parse(req.url, true).query.id;
        const result = await db.eliminarCandidato(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result));
        res.end();
    }

    // RUTAS de historial
    if(req.url == '/votos' && req.method == 'POST'){
        let params = null;
        req.on('data', body => {
            params = body
        });
        req.on('end', async() => {
            const paramsArray = Object.values(JSON.parse(params));
            const result = await db.crearHistorial(paramsArray);
            let responseCode = (result.name == 'error') ? 500 : 200;  
            res.writeHead(responseCode, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end(); 
        });
    }
    if(req.url == '/historial' && req.method == 'GET'){
        const result = await db.getHistorial();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result.rows));
        res.end();
    }



});
server.listen(3000, ()=> console.log('conected port: 3000'));