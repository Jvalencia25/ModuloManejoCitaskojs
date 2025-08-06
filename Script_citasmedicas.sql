-- Con usuario Root: se accede desde la terminal de docker desktop con psql -U postgres

-- crear el esquema la base de datos
create citasmedicas_db;

-- crear el usuario con el que se realizarán las acciones
create user citasmedicas_usr with encrypted password 'unaClav3';

psql -U postgres -d citasmedicas_db
\c citasmedicas_db citasmedicas_usr_usr

-- asignación de privilegios para el usuario
grant all privileges on database citasmedicas_db to citasmedicas_usr;

-- Conectado a la base de datos
grant all privileges on schema public to citasmedicas_usr;

-- Tabla paciente
CREATE TABLE paciente (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_nac DATE NOT NULL,
    tipo_doc VARCHAR(50) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla especialidad
CREATE TABLE especialidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL unique,
    duracion_min INTEGER not null default 15
);

-- Tabla medico
CREATE TABLE medico (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_nac DATE NOT NULL,
    tipo_doc VARCHAR(50) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_especialidad INTEGER NOT null,
    
    CONSTRAINT fk_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidad(id) ON DELETE RESTRICT
);

-- Tabla citas
CREATE TABLE citas (
    id_cita BIGSERIAL PRIMARY KEY,
    id_pac BIGINT NOT NULL,
    id_med BIGINT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora TIME WITHOUT TIME ZONE NOT null,

    CONSTRAINT fk_paciente foreign KEY (id_pac) REFERENCES paciente(id) ON DELETE CASCADE,
    CONSTRAINT fk_medico FOREIGN KEY (id_med) REFERENCES medico(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_citas_id_pac ON citas(id_pac);
CREATE INDEX idx_citas_id_med ON citas(id_med);
CREATE INDEX idx_citas_fecha_cita ON citas(fecha_cita);

-- Registros de prueba
INSERT INTO especialidad (nombre, duracion_min) VALUES
('Pediatría', 30),
('Medicina Interna', 45),
('Dermatología', 20);


INSERT INTO medico (id, nombre, fecha_nac, tipo_doc, genero, celular, password, id_especialidad) VALUES
(1234567890, 'Dra. Ana María Ríos', '1980-03-15', 'CC', 'Femenino', '3001234567', 'clave123', 1),
(1122334455, 'Dr. Carlos Gómez', '1975-09-22', 'CC', 'Masculino', '3007654321', 'segura456', 2),
(9988776655, 'Dra. Luisa Martínez', '1988-07-10', 'CC', 'Femenino', '3101112222', 'luisaPass', 3);

-- Pacientes
INSERT INTO paciente (id, nombre, fecha_nac, tipo_doc, genero, celular, password) VALUES
(100000001, 'Juan Pérez', '2005-01-20', 'TI', 'Masculino', '3111111111', 'juan123'),
(100000002, 'María García', '1990-05-14', 'CC', 'Femenino', '3122222222', 'maria456'),
(100000003, 'Carlos Sánchez', '1985-12-03', 'CC', 'Masculino', '3133333333', 'carlos789');

-- Citas
INSERT INTO citas (id_pac, id_med, fecha_cita, hora) VALUES
(100000001, 1234567890, '2025-08-10', '09:00'),
(100000002, 1122334455, '2025-08-11', '11:00'),
(100000003, 9988776655, '2025-08-12', '15:30'),
(100000001, 9988776655, '2025-08-13', '14:00');