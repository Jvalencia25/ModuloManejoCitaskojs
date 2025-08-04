<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Home.aspx.cs" Inherits="Vistas_Home" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <title>Inicio de sesi�n</title>
        <link href="/Content/bootstrap.min.css" rel="stylesheet" />
    </head>

    <body>
        <h2 class="text-center mb-4">Bienvenido</h2>

        <div class="containter mt-5" data-bind="with: login">
            <h2 class ="text-center mb-4">Iniciar Sesi�n</h2>
            <div class="mb-3">
                <input class="form-control" placeholder="N�mero de identificaci�n" data-bind="value: id" />
            </div>
            <div class="mb-3">
                <input class="form-control" placeholder="Contrase�a" type="password" data-bind="value: password" />
            </div>
            <button data-bind="click: loginUser" class="btn btn-primary w-100">Ingresar</button>
        </div>

        <script src="/Scripts/knockout-3.5.1.js"></script>
        <script src="/Scripts/viewmodels/loginViewModel.js"></script>
    </body>
</html>