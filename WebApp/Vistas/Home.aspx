<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Home.aspx.cs" Inherits="Vistas_Home" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <meta charset="utf-8" />
        <title>Inicio de sesi�n</title>
        <link href="/Content/bootstrap.min.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/Scripts/knockout-3.5.1.js"></script>
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/Home.css" />
        <link rel="stylesheet" type="text/css" href="/Content/Estilos/General.css" />
    </head>

    <body>
        <div class="py-3 justify-content-center row">
            <div class="card p-5 shadow" style="max-width: 400px; width: 100%">
                <h1 class="text-center mb-4">Bienvenido</h1>

                <h2 class ="text-center mb-4">Iniciar Sesi�n</h2>
                <div class="container" data-bind="with: login">

                    <div class="mb-3">
                        <label for="id" class="form-label">N�mero de identificaci�n</label>
                        <input class="form-control" placeholder="N�mero de identificaci�n" data-bind="value: id" />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contrase�a</label>
                        <input class="form-control" placeholder="Contrase�a" type="password" data-bind="value: password" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Tipo de usuario:</label>
                        <select class="form-select" data-bind="value: tipoUsuario">
                            <option value="paciente">Paciente</option>
                            <option value="medico">M�dico</option>
                        </select>
                    </div>

                    <button data-bind="click: iniciarSesion" class="btn btn-primary mt-3 w-100">Ingresar</button>

                </div> <div class="text-center mt-5">
                    <p>�No tienes cuenta?</p>
                    <button type="button" class="btn btn-link" data-bind="click: toggleRegistro">Reg�strate</button>
                </div>

                <div data-bind="visible: mostrarRegistro" class="mt-3">

                    <div class="container" data-bind="with: registro">
                        <h2 class="text-center mb-4">Registrarse</h2>

                        <form>
                            <div class="mb-3">
                                <label class="form-label">Tipo de usuario:</label>
                                <select id="selMedPac" class="form-select" data-bind="value: tipoUsuario">
                                    <option value="paciente">Paciente</option>
                                    <option value="medico">M�dico</option>
                                </select>
                            </div>

                            <div class="mb-3" data-bind="visible: tipoUsuario() === 'medico'">
                                <label class="form-label">Especialidad</label>
                                <select class="form-select" data-bind="options: especialidades, 
                                                                       optionsText: 'nombre',
                                                                       optionsValue: 'id',
                                                                       value: especialidadSeleccionada, 
                                                                       optionsCaption: 'Seleccione una especialidad'">
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Nombre</label>
                                <input type="text" class="form-control" data-bind="value: nombre" required />
                            </div>

                            <div class="mb-3">
                                <label class="form-label" >Fecha de nacimiento</label>
                                <input type="date" id="fechaNacimiento" class="form-control" data-bind="value: fechaNacimiento" required/>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Tipo de documento</label>
                                <select id="seltipoDoc" class="form-select" data-bind="value: tipoDocumento" required>
                                    <option value="cc">C�dula de ciudadan�a</option>
                                    <option value="rc">Registro civil</option>
                                    <option value="ti">Tarjeta de identidad</option>
                                    <option value="ce">C�dula de extranjer�a</option>
                                    <option value="pa">Pasaporte</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">N�mero de identificaci�n</label>
                                <input type="tel" class="form-control" data-bind="value: idRegistro" pattern="[0-9]{5,}" required/>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">G�nero</label>
                                <select class="form-select" data-bind="value: genero" required>
                                    <option value="m">Masculino</option>
                                    <option value="f">Femenino</option>
                                    <option value="o">Otro</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Celular</label>
                                <input type="tel" class="form-control" data-bind="value: celular" pattern="[0-9]{8,}" required/>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Contrase�a</label>
                                <input type="password" class="form-control" data-bind="value: passwordRegistro" />
                            </div>

                            <button data-bind="click: registrar" type="submit" class="btn btn-success w-100 mt-2">Registrarse</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script src="/Scripts/viewmodels/homeViewModel.js"></script>
    </body>
</html>
```