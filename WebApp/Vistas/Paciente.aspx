<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Paciente.aspx.cs" Inherits="Vistas_Usuario" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <meta charset="utf-8" />
        <title>Gestión de citas</title>
        <link href="/Content/bootstrap.min.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/Scripts/knockout-3.5.1.js"></script>
        <script src="/Scripts/knockout.mapping-latest.js"></script>
        <script src="/Scripts/jquery-3.4.1.min.js"></script>
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/Paciente.css" />
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/General.css" />
    </head>

    <body class="d-flex flex-column align-items-center p-4">
        <div class="container">
            <h1 class="text-center text-white text-primary mb-4">Bienvenid@, <span class="fw-bold" data-bind="text: usuario.nombre"></span></h1>

            <!-- Lista de citas pendientes -->
            <div class="card p-4 shadow w-100 mb-4">
                <h2 class="text-center mb-3">Citas pendientes</h2>
                <ul class="list-group p-4" data-bind="foreach: citas">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <strong data-bind="text: especialidad"></strong> -
                            <span data-bind="text: fechaCita"></span> a las
                            <span data-bind="text: hora"></span>
                        </span>
                        <button class="btn btn-sm btn-outline-danger" data-bind="click: $parent.cancelarCita">Cancelar</button>
                    </li>
                </ul>
            </div>

            <!-- Formulario de agendar cita -->
            <div class="card p-4 mb-4 shadow" data-bind="with: agendarCita">
                <h2 class="text-center mb-3">Agendar nueva cita</h2>

                <form>
                    <div class="mb-3">
                        <label class="form-label">Selecciona la especialidad</label>
                        <select class="form-select" data-bind="options: especialidades, 
                                           optionsText: 'nombre',
                                           optionsValue: 'nombre',
                                           value: especialidadSeleccionada, 
                                           optionsCaption: 'Seleccione una especialidad'">
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Selecciona un doctor</label>
                        <select class="form-select" data-bind="options: medicos, 
                                           optionsText: 'nombre',
                                           optionsValue: 'id',
                                           value: medicoSeleccionado, 
                                           optionsCaption: 'Seleccione un médico',
                                            enable: especialidadSeleccionada">
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Selecciona una fecha:</label>
                        <input type="date" id="fechaInput" class="form-control" data-bind="value: fechaCita, enable: medicoSeleccionado" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Selecciona la hora:</label>
                        <select class="form-select" data-bind="options: horasDisponibles, 
                                           value: horaSeleccionada, 
                                           optionsCaption: 'Seleccione una hora',
                                            enable: fechaCita">
                        </select>
                    </div>

                    <button type="submit" data-bind="click: $root.agendar" class="btn btn-success w-100">Agendar</button>
                </form>
            </div>

            <button class="btn btn-danger" data-bind="click: cerrarSesion">Cerrar sesión</button>

            <script src="/Scripts/viewmodels/pacienteViewModel.js"></script>



        </div>
    </body>
</html>