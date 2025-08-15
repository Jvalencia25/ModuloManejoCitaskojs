var modelo = {
    usuario: {
        id: null,
        nombre: "",
        especialidad: ""
    },
    citas: [],
    fechaDesde: new Date().toISOString().split('T')[0],
    fechaHasta: new Date().toISOString().split('T')[0],

    agendarCita: {
        idPaciente: "",
        fechaCita: "",
        duracion: ko.observable(15),
        horaSeleccionada: "",
        horasDisponibles: []
    }
}

function MedicoViewModel() {
    const self = this;

    ko.mapping.fromJS(modelo, {}, self);

    self.init = function () {
        var user = JSON.parse(localStorage.getItem("usuario") || "null");
        if (user) {
            ko.mapping.fromJS(user, {}, self.usuario);
            if (user.especialidad && user.especialidad.duracionDef) {
                self.agendarCita.duracion(user.especialidad.duracionDef);
            }
        }
        else window.location.href = "/Vistas/Home.aspx";

        self.getCitas();
    }

    self.getCitas = function () {

        console.log("https://localhost:44345/api/Citas/medico/" +
            self.usuario.id() +
            "?fechaDesde=" +
            self.fechaDesde() +
            "&fechaHasta=" +
            self.fechaHasta())
        $.ajax({
            url: "https://localhost:44345/api/Citas/medico/" +
                self.usuario.id() +
                "?fechaDesde=" +
                self.fechaDesde() +
                "&fechaHasta=" +
                self.fechaHasta(),
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.citas);
                console.log(data)
            },
            error: function (xhr) {
                alert("Error al obtener citas: " + xhr.responseText);
            }
        })
    }

    self.filtrar = function () {
        console.log(self.fechaDesde() + " " + self.fechaHasta())
        self.getCitas();
    }

    self.getHorasDisponibles = function () {

        if (!self.agendarCita.fechaCita() || !self.agendarCita.duracion()) return;
        const idmed = self.usuario.id();
        const dur = self.agendarCita.duracion();
        const fechaSel = self.agendarCita.fechaCita();

        $.ajax({
            url: "https://localhost:44345/api/Citas/disponibilidad/?idMedico="
                + idmed
                + "&duracion="
                + dur
                + "&fecha="
                + fechaSel,
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.agendarCita.horasDisponibles);
                //console.log(data);
            },
            error: function (xhr) {
                alert("Error al obtener horas: " + xhr.responseText);
            }
        })
    }

    // Obtener fechas disponibles
    self.agendarCita.fechaCita.subscribe(function () {
        self.getHorasDisponibles();
    })

    self.agendarCita.duracion.subscribe(function () {
        self.getHorasDisponibles();
    });


    self.agendarCita.agendar = function () {

        const medicoId = self.usuario.id()
        const pacienteId = self.agendarCita.idPaciente();
        const dur = self.agendarCita.duracion();
        const fechaSel = self.agendarCita.fechaCita();
        const horaSel = self.agendarCita.horaSeleccionada();

        if (!medicoId || !pacienteId || !pacienteId || !horaSel || !dur || !fechaSel) {
            alert("Error de datos");
            return;
        }

        var body = {
            idPac: pacienteId,
            idMed: medicoId,
            FechaCita: fechaSel,
            Hora: horaSel,
            duracion: dur
        };

        //console.log(body)

        $.ajax({
            url: "https://localhost:44345/api/Citas",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log("Respuesta API: ", data);

                alert("Cita agendada correctamente para el día "
                    + fechaSel
                    + " A las "
                    + horaSel);

                self.getCitas();
            },
            error: function (xhr, status, error) {
                console.error("Error al agendar cita:", error);
                alert(xhr.responseText);
            }
        })
    }

    self.eliminarCita = function (Cita) {
        console.log(Cita)
        $.ajax({
            url: "https://localhost:44345/api/Citas/" + Cita.idCita(),
            type: "DELETE",
            success: function (data) {
                alert(data);
                self.getCitas();
            },
            error: function (xhr) {
                alert("Error al eliminar cita: "+xhr.responseText);
            }
        })
    }

    self.cerrarSesion = function () {
        localStorage.removeItem("usuario");
        window.location.href = "/Vistas/Home.aspx"
    }

    self.init();
}

ko.applyBindings(new MedicoViewModel());

//JS
const fechaInput = document.getElementById("fechaInput");

document.addEventListener('DOMContentLoaded', function () {

    //Bloquear fechas anteriores
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    const fechaMin = manana.toISOString().split('T')[0];
    fechaInput.min = fechaMin;
});

fechaInput.addEventListener('input', function (e) {
    var day = new Date(this.value).getUTCDay();
    if ([0].includes(day)) {
        e.preventDefault();
        this.value = '';
        alert('No hay disponibilidad los domingos');
    }
});