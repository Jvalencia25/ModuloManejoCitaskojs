
# Módulo de gestión de citas médicas en ASP.NET

Pequeño módulo de gestión de citas

## Tecnologías usadas
- .NET framework
- ASP.NET
- Bootstrap
- Knockout.js
- Postgres (base de datos)





## API

#### Usuarios

```http
/api/usuarios
```

| Función | HTTP     |  Ruta |Descripción                |
| :-------- | :------- | :------- | :------------------------- |
| `registro` | `POST` |/registro |Registro (sirve para ambos tipos de usuarios), devuelve objeto usuario |
| `login` | `PUT` |/login |Inicio de sesión (sirve para ambos tipos de usuarios), devuelve objetousuario |
| `buscarPorId` | `GET` | /{id}|Obtener usuario por id |

#### Citas

```http
  /api/citas
```

| Función | HTTP     |  Ruta |Descripción                |
| :-------- | :------- | :------- | :------------------------- |
| `agendar`      | `POST` | |Agendar una cita |
| `{id} borrarCita`      | `DELETE` | /{id_cita}|Eliminar una cita |
| `rango`      | `GET` |/rango?desde=YYYY-MM-DD&hasta=YYYY-MM-DD |Buscar citas en un rango de fechas |
| `usuario/{id}`      | `GET` | /usuario/{id}|Buscar citas por usuario |



