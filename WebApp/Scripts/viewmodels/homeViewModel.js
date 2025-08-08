function LoginForm() {
    const self = this;

    self.id = ko.observable('');
    self.password = ko.observable('');
    self.tipoUsuario = ko.observable('paciente');

    self.iniciarSesion = function () {
        const body = {
            Id: self.id(),
            Password: self.password(),
            TipoUsuario: self.tipoUsuario()
        };
        console.log({ login: body });
    };
}

function RegistroForm() {
    var self = this;

    // Especialidades
    self.especialidades = ko.observableArray([
        'Cardiología',
        'Pediatría',
        'Neurología',
        'Dermatología'
    ]);
    self.especialidadSeleccionada = ko.observable('');

    self.tipoUsuario = ko.observable('paciente');
    self.nombre = ko.observable('');
    self.fechaNacimiento = ko.observable('');
    self.tipoDocumento = ko.observable('cc');
    self.idRegistro = ko.observable('');
    self.genero = ko.observable('m');
    self.celular = ko.observable('');
    self.passwordRegistro = ko.observable('');


    self.registrar = function () {
        const body = {
            Id : self.idRegistro(),
            Nombre : self.nombre(),
            FechaNac : self.fechaNacimiento(),
            TipoDoc : self.tipoDocumento(),
            Genero : self.genero(),
            Celular : self.celular(),
            Password : self.passwordRegistro(),
            TipoUsuario : self.tipoUsuario(),
            Especialidad : self.especialidadSeleccionada()
        };
        console.log({ registro: body });
    }
}

function homeViewModel() {
    var self = this;

    self.login = new LoginForm();
    self.registro = new RegistroForm();

    self.mostrarRegistro = ko.observable(false);

    self.toggleRegistro = function () {
        self.mostrarRegistro(!self.mostrarRegistro());
    };
    
}

ko.applyBindings( homeViewModel() );