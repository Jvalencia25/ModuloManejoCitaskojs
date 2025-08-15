function LoginForm() {
    const self = this;

    ko.mapping.fromJS({
        id: '',
        password: '',
        tipoUsuario: 'paciente'
    }, {}, self)

    self.iniciarSesion = function () {
        const body = ko.mapping.toJS(self);
        console.log({ login: body });

        $.ajax({
            url: "https://localhost:44345/api/Usuarios/Login",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log("respuesta API:", data);

                localStorage.setItem("usuario", JSON.stringify(data));

                if (self.tipoUsuario() === "medico") window.location.href = "/Vistas/Medico.aspx";      
                else if (self.tipoUsuario() === "paciente") window.location.href = "/Vistas/paciente.aspx";
                else alert("Tipo de usuario no reconocido");
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert(xhr.responseText)
            }
        })
    
    };
}

function RegistroForm() {
    var self = this;

    var model = {
        especialidades: [],
        especialidadSeleccionada: '',
        tipoUsuario: 'paciente',
        nombre: '',
        fechaNacimiento: '',
        tipoDocumento: 'cc',
        idRegistro: '',
        genero: 'm',
        celular: '',
        passwordRegistro: ''
    };

    ko.mapping.fromJS(model, {}, self);

    self.getEspecialidades = function () {
        //(console.log("obteniendo especialidades"))
        $.ajax({
            url: "https://localhost:44345/api/Usuarios/especialidades",
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.especialidades);
                //console.log(data);
            },
            error: function (xhr) {
                alert("Error al obtener especialidades: " + xhr.responseText);
            }
        })
    };


    self.tipoUsuario.subscribe(function (nuevoValor) {
        console.log("holaaa");
        if (nuevoValor === 'medico') {
            self.getEspecialidades();
        } else {
            self.especialidades([]);
            self.especialidadSeleccionada('');
        }
    });

    self.registrar = function () {
        if (!self.idRegistro() || !/^[0-9]+$/.test(self.idRegistro()) || self.idRegistro().length < 6) {
            alert("Número de identificación no válido");
            return;
        }

        if (!self.nombre() || self.nombre().length < 3) {
            alert("Nombre no válido");
            return;
        }

        const hoy = new Date().toISOString().split('T')[0];

        if (!self.fechaNacimiento() || self.fechaNacimiento() > hoy) {
            alert("Fecha no válida");
            return;
        }

        if (self.tipoDocumento() != "cc" &&
            self.tipoDocumento() != "rc" &&
            self.tipoDocumento() != "ti" &&
            self.tipoDocumento() != "ce" &&
            self.tipoDocumento() != "pa") {

            alert("Tipo de documento no válido");
            return;
        }

        if (self.tipoUsuario() != "medico" && self.tipoUsuario() != "paciente") {
            alert("Tipo de usuario no válido");
            return;
        }

        if (self.genero() != "m" &&
            self.genero() != "f" &&
            self.genero() != "o") {

            alert("Género no válido");
            return;
        }

        if (!self.celular() || !/^[0-9]+$/.test(self.celular()) || self.celular().length < 7) {
            alert("Número de celular no válido");
            return;
        }

        if (!self.passwordRegistro() || self.passwordRegistro().length < 6) {
            alert("La contraseña no es segura");
            return;
        }

        var body = {
            id: self.idRegistro(),
            nombre: self.nombre(),
            fechanac: self.fechaNacimiento(),
            tipodoc: self.tipoDocumento(),
            genero: self.genero(),
            celular: self.celular(),
            password: self.passwordRegistro(),
            tipoUsuario: self.tipoUsuario(),
            idEspecialidad: self.especialidadSeleccionada()
        };

        console.log(body)

        $.ajax({
            url: "https://localhost:44345/api/Usuarios",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log("respuesta API:", data);

                localStorage.setItem("usuario", JSON.stringify(body));

                if (body.tipoUsuario === "medico") window.location.href = "/Vistas/Medico.aspx";
                else if (body.tipoUsuario === "paciente") window.location.href = "/Vistas/paciente.aspx";
                else alert("Tipo de usuario no reconocido");
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert(xhr.responseText);
            }
        });
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

    const usuarioStr = localStorage.getItem("usuario");
    const usuario = JSON.parse(usuarioStr);

    if (usuario) {
        if (usuario.idEspecialidad)  window.location.href = "/Vistas/Medico.aspx"; 
        else window.location.href = "/Vistas/Paciente.aspx"; 
    }
    
    //Bloquear fechas posteriores
    const hoy = new Date().toISOString().split('T')[0];
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