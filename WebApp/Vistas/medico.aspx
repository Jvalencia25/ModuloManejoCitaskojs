<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Medico.aspx.cs" Inherits="WebApp.Vistas.Medico" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <meta charset="utf-8" />
        <title>Gestionar citas</title>
        <link href="/Content/bootstrap.min.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/Scripts/knockout-3.5.1.js"></script>
        <script src="/Scripts/knockout.mapping-latest.js"></script>
        <script src="/Scripts/jquery-3.4.1.min.js"></script>
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/Medico.css" />
    
    </head>

    <body class="bg-light min-vh-100 py-4">

        <h1 class="text-center mb-4 text-primary">Gestión de citas: <span class="fw-bold" data-bind="text: usuario.nombre"></span></h1>
        
        <!-- Filtro -->
        <div class="container">
            <div class="card p-4 mb-4 shadow">
                <h4 class="mb-3">Filtrar citas en un rango de fechas</h4>

                <div class="row g-2 align-items-end">
                    <div class="col-sm-6 col-md-4">
                        <label class="form-label">Desde:</label>
                        <input type="date" class="form-control" data-bind="value: fechaDesde" />
                    </div>

                    <div class="col-sm-6 col-md-4">
                        <label class="form-label">Hasta:</label>
                        <input type="date" class="form-control" data-bind="value: fechaHasta" />
                    </div>

                    <div class="col-sm-12 col-md-4 d-grid">
                        <button class="btn btn-primary mt-2" data-bind="click: filtrar">Buscar</button>
                    </div>
                </div>
            </div>
            
        </div>
        
        <!-- Lista de citas -->
        <div class="container">
            <div class="card p-4 mb-4 shadow">
                <h4 class="mb-3">Filtrar citas en un rango de fechas</h4>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover align-middle text-center">
                        <thead class="table-light">
                            <tr>
                                <th>Fecha y hora</th>
                                <th>Especialidad</th>
                                <th>Duracion (min)</th>
                                <th>Paciente</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody data-bind="foreach: citas">
                            <tr>
                                <td>
                                    <span data-bind="text: fechaCita"></span> -
                                    <span data-bind="text: hora"></span>
                                </td>
                                <td data-bind="text: especialidad"></td>
                                <td data-bind="text: duracion"></td>
                                <td data-bind="text: nombrePaciente"></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-danger" data-bind="click: $parent.eliminarCita">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Formulario de agendar cita -->
        <div class="container">
            <div class="card p-4 mb-4 shadow" data-bind="with: agendarCita">
                <h2 class="text-center mb-3">Agendar nueva cita</h2>
                <form>

                    <div class="mb-3">
                        <label class="form-label">Escribe el id del paciente:</label>
                        <input type="number" class="form-control" data-bind="value: idPaciente" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Duracion (en minutos):</label>
                        <input type="number" class="form-control" data-bind="value: duracion" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Selecciona una fecha:</label>
                        <input type="date" id="fechaInput" class="form-control" data-bind="value: fechaCita, enable: duracion() > 15" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Selecciona la hora:</label>
                        <select class="form-select" data-bind="options: horasDisponibles, 
                                           value: horaSeleccionada, 
                                           optionsCaption: 'Seleccione una hora',
                                            enable: fechaCita">
                        </select>
                    </div>

                    <button type="submit" data-bind="click: agendar" class="btn btn-success w-100">Agendar</button>
                </form>
            </div>
             <button class="btn btn-danger align" data-bind="click: cerrarSesion">Cerrar sesión</button>
        </div>

        <script src="/Scripts/viewmodels/medicoViewModel.js"></script>
    </body>

</html>