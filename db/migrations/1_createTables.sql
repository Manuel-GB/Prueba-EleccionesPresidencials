CREATE TABLE candidatos (
    id SERIAL, 
    nombre VARCHAR(50), 
    foto varchar(200), 
    color varchar(9), 
    votos INT
);

CREATE TABLE historial (
    estado varchar(35) UNIQUE, 
    votos INT, 
    ganador varchar(40)
);