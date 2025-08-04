<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Medico.aspx.cs" Inherits="WebApp.Vistas.Medico" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <meta charset="utf-8" />
        <title>Gestionar citas</title>
        <link href="/Content/bootstrap.min.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/Scripts/knockout-3.5.1.js"></script>
        <script src="/Scripts/viewmodels/medicoViewModel.js"></script>
    </head>

    <body class="bg-light min-vh-100 py-4" data-bind="with: medico">
        <div class="container">
            <h1 class="text-center mb-4 text-primary">Gestión de citas</h1>

            <div class="card p-4 mb-4 shadow">
                <h4 class="mb-3">Mostrar citas en un rango de fechas</h4>

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
                        <button class="btn btn-primary mt-2" data-bind="click buscarCitas">Buscar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow mb-4">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover align-middle text-center">
                        <thead class="table-light">
                            <tr>
                                <th>Fecha y hora</th>
                                <th>Especialidad</th>
                                <th>Paciente</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody data-bind="foreach: citasFiltradas">
                            <tr>
                                <td>
                                    <span data-bind="text: fecha"></span> -
                                    <span data-bind="text: hora"></span>
                                </td>
                                <td data-bind="text: especialidad"></td>
                                <td data-bind="text: paciente"></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-danger" data-bind="click: $parent.eliminarCita">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div>
            <button class="btn btn-danger" data-bind="click: cerrarSesion">Cerrar sesión</button>
        </div>

    </body>

</html>