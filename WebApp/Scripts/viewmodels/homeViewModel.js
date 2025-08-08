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

ko.applyBindings(homeViewModel());

const fechaNacInput = document.getElementById("fechaNacimiento");
const tipoDocSelect = document.getElementById("seltipoDoc");
const rolSelect = document.getElementById("selMedPac");

document.addEventListener('DOMContentLoaded', function () {

    //Bloquear fechas posteriores
    const hoy = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    fechaNacInput.max = hoy;

   
});

//Bloquear documentos por edad
fechaNacInput.addEventListener("change", () => {
    const edad = calcularEdad(fechaNacInput.value);
    const opcionesDoc = tipoDocSelect.options;
    const opcionesRol = rolSelect.options;

    if (edad < 18) {
        for (let i = 0; i < opcionesDoc.length; i++) {
            const opcion = opcionesDoc[i];
            opcion.disabled = (edad < 18 && (opcion.value === "cc" || opcion.value === "ce"));
            if (opcion.disabled && tipoDocSelect.value === opcion.value) {
                tipoDocSelect.value = "ti";
            }
        }

        for (let i = 0; i < opcionesRol.length; i++) {
            const opcion = opcionesRol[i];
            opcion.disabled = (edad < 18 && opcion.value === "medico");
            if (opcion.disabled && rolSelect.value === opcion.value) {
                rolSelect.value = "paciente";
            }
        }
    }

    else {
        for (let i = 0; i < opcionesDoc.length; i++) {
            const opcion = opcionesDoc[i];
            opcion.disabled = (edad >= 18 && (opcion.value === "rc" || opcion.value === "ti"));
            if (opcion.disabled && tipoDocSelect.value === opcion.value) {
                tipoDocSelect.value = "cc";
            }
        }
    }

});


function calcularEdad(fechaNacStr) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacStr);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;

    return edad;
}