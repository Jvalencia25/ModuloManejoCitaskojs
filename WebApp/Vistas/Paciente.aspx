<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Paciente.aspx.cs" Inherits="WebApp.Vistas.Usuario" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <meta charset="utf-8" />
        <title>Gestión de citas</title>
        <link href="/Content/bootstrap.min.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/Scripts/knockout-3.5.1.js"></script>
        <script src="/Scripts/viewmodels/pacienteViewModel.js"></script>
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/Paciente.css" />
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/General.css" />
    </head>

    <body class="d-flex flex-column align-items-center p-4" data-bind="with: usuario">
        <div class="container">
            <h1 class="text-center text-white text-primary mb-4">Bienvenid@, <span class="fw-bold" data-bind="text: nombrePaciente"></span></h1>

            <div class="card p-4 mb-4 shadow">
                <h2 class="text-center mb-3">Agendar nueva cita</h2>
                <form data-bind="submit: agendarCita">
                    <div class="mb-3">
                        <label class="form-label">Fecha:</label>
                        <input type="date" class="form-control" data-bind="value: fechaCita" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Hora:</label>
                        <select class="form-control" data-bind="option: horasDisponibles, value: horaCita, optionsCaption: 'selecciona una hora'" required></select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Especialidad</label>
                        <select class="form-select" data-bind="value: especialidad" required>
                            <option value="general">Medicina General</option>
                            <option value="pediatria">Pediatría</option>
                            <option value="odontologia">Odontología</option>
                            <option value="psicologia">Psicología</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-success w-100">Agendar</button>
                </form>
            </div>

            <div class="card p-4 shadow w-100 mb-4">
                <h2 class="text-center mb-3">Citas pendientes</h2>
                <ul class="list-group p-4" data-bind="foreach: citasPendientes">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <strong data-bind="text: especialidad"></strong> -
                            <span data-bind="text: fecha"></span> a las
                            <span data-bind="text: hora"></span>
                        </span>
                        <button class="btn btn-sm btn-outline-danger" data-bind="click: $parent.cancelarCita">Cancelar</button>
                    </li>
                </ul>
            </div>

            <button class="btn btn-danger" data-bind="click: cerrarSesion">Cerrar sesión</button>

        </div>
    </body>
</html>