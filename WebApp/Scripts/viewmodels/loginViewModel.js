function LoginViewModel() {
    var self = this;

    //Login
    self.id = ko.observable('');
    self.password = ko.observable('');
    self.loginUser = function () {

        //TODO: Aqui va la llamada al back
        if (datosLogin.id === "123" && datosLogin.password === "1234") {
            window.location.href = "Medico.aspx";
        }
        else {
            window.location.href = "Usuario.aspx";
        }

    };

    //Registro
    self.mostrarRegistro = ko.observable(false);
    self.toggleRegistro = function () {
        self.mostrarRegistro(!self.mostrarRegistro());
    };

    self.tipoUsuario = ko.observable('paciente');
    self.nombre = ko.observable('');
    self.fechaNacimiento = ko.observable('');
    self.tipoDocumento = ko.observable('cc');
    self.idRegistro = ko.observable('');
    self.genero = ko.observable('m');
    self.celular = ko.observable('');
    self.passwordRegistro = ko.observable('');

    self.registrarUsuario = function () {
        const nuevoUsuario = {
            tipoUsuario: self.tipoUsuario(),
            nombre: self.nombre(),
            fechaNacimiento: self.fechaNacimiento(),
            tipoDocumento: self.tipoDocumento(),
            identificacion: self.identificacionRegistro(),
            genero: self.genero(),
            celular: self.celular(),
            contrasena: self.contrasenaRegistro()
        };

        //TODO: Llamada a la API
        console.log("Registrando usuario:", nuevoUsuario);
        alert("Registro exitoso");

        self.nombre('');
        self.fechaNacimiento('');
        self.tipoDocumento('cc');
        self.identificacionRegistro('');
        self.genero('m');
        self.celular('');
        self.contrasenaRegistro('');
        self.mostrarRegistro(false);
    };
}  

ko.applyBindings({ login: new LoginViewModel });