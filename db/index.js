const { Pool } = require('pg');

const config = {
    users: 'manuel',
    password: 'Cats1989',
    host: 'localhost',
    database: 'elecciones',
    port: 5432
}

const pool = new Pool(config);

// Funciones para candidatos
async function crearCandidato(paramsArray){
    const qryObj = {
        text: 'INSERT INTO candidatos(nombre, foto, color, votos) VALUES ($1, $2, $3, 0)',
        values: paramsArray
    }

    const result = await pool.query(qryObj);
    return result;
}
async function getCandidatos(){
    const result = await pool.query('SELECT * FROM candidatos');
    return result;
}
async function actualizarCandidato(paramsArray){
    const qryObj = {
        text: "UPDATE candidatos SET nombre = $2, foto = $3, color = $4 WHERE id = $1 RETURNING *",
        values: paramsArray
    }
    const result = await pool.query(qryObj);
    return result;
}
async function eliminarCandidato(id){
    const result = await pool.query(`DELETE FROM candidatos WHERE id = '${id}'`);
    return result;    
}

//Funciones para historial
async function crearHistorial(paramsArray){
    const qryInsert = {
        text: "INSERT INTO historial(estado, votos, ganador) VALUES ($1, $2, $3)", 
        values: paramsArray
    }
    const qryUpdate = {
        text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2 RETURNING *", 
        values: [paramsArray[1],paramsArray[2]]
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(qryUpdate);
        const result = await client.query(qryInsert);
        await client.query('COMMIT');
        console.log('La transacción se realizó correctamente');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        //console.log(error);
        return error;
    } finally {
        client.release();
    }
    
}
async function getHistorial(){
    const result = await pool.query('SELECT * FROM historial');
    return result;
}

module.exports = {
    crearCandidato,
    getCandidatos,
    actualizarCandidato,
    eliminarCandidato,
    crearHistorial,
    getHistorial,
}