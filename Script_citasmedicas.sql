-- Con usuario Root: se accede desde la terminal de docker desktop con psql -U postgres

-- crear el esquema la base de datos
create citasmedicas;

-- crear el usuario con el que se realizarán las acciones
create user citasmedicas_usr with encrypted password 'unaClav3';

psql -U postgres -d citasmedicas
\c citasmedicas citasmedicas_usr_usr

-- asignación de privilegios para el usuario
grant all privileges on database citasmedicas to citasmedicas_usr;

-- Conectado a la base de datos
grant all privileges on schema public to citasmedicas_usr;

-- Tabla paciente
CREATE TABLE paciente (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_nac DATE NOT NULL,
    tipo_doc VARCHAR(50) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla medico
CREATE TABLE medico (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_nac DATE NOT NULL,
    tipo_doc VARCHAR(50) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla citas
CREATE TABLE citas (
    id_cita BIGSERIAL PRIMARY KEY,
    id_pac BIGINT NOT NULL,
    id_med BIGINT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora TIME NOT NULL,
    especialidad VARCHAR(255) NOT NULL,
    duracion INTEGER NOT NULL,

    CONSTRAINT fk_paciente FOREIGN KEY (id_pac) REFERENCES paciente(id) ON DELETE CASCADE,
    CONSTRAINT fk_medico FOREIGN KEY (id_med) REFERENCES medico(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_citas_id_pac ON citas(id_pac);
CREATE INDEX idx_citas_id_med ON citas(id_med);
CREATE INDEX idx_citas_fecha_cita ON citas(fecha_cita);
