var modelo = {
    usuario: {
        id: null,
        nombre: "",
    },
    citas: [],
    agendarCita: {
        especialidades: [],
        especialidadSeleccionada: "",
        medicos: [],
        medicoSeleccionado: null,
        fechaCita: "",
        horaSeleccionada: "",
        horasDisponibles: []
    }
};

function PacienteViewModel() {
    const self = this;

    ko.mapping.fromJS(modelo, {}, self);

    self.cerrarSesion = function () {
        localStorage.removeItem("usuario");
        window.location.href = "/Home.aspx";
    }

    self.init = function () {
        var userLS = JSON.parse(localStorage.getItem("usuario") || "null");
        if (userLS) ko.mapping.fromJS(userLS, {}, self.usuario);
        else window.location.href = "Home.aspx";

        self.getEspecialidades();

    }

    self.getEspecialidades = function () {

        $.ajax({
            url: "https://localhost:44345/api/Usuarios/especialidades",
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.agendarCita.especialidades);
            },
            error: function (xhr) {
                alert("Error al obtener especialidades: " + xhr.responseText);
            }
        })
    };

    // Obtener médicos al seleccionar especialidad
    self.agendarCita.especialidadSeleccionada.subscribe(function (nombreEspecialidad) {
        if (!nombreEspecialidad) {
            ko.mapping.fromJS([], {}, self.agendarCita.medicos);
            return;
        }

        $.ajax({
            url: "https://localhost:44345/api/Usuarios/medicos/" + nombreEspecialidad,
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.agendarCita.medicos);
                //console.log(data)
            },
            error: function (xhr) {
                alert("Error al obtener médicos: " + xhr.responseText);
            }
        })
    })

    // Obtener fechas disponibles
    self.agendarCita.fechaCita.subscribe(function () {

        const medicoSel = self.agendarCita.medicoSeleccionado();
        const fechaSel = self.agendarCita.fechaCita();

        if (!medicoSel || !fechaSel) return;

        const medicoId = typeof medicoSel === "object" ? medicoSel.id() : medicoSel;

        $.ajax({
            url: "https://localhost:44345/api/Citas/disponibilidad/?idMedico="
                + medicoId
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
    })

    self.agendar = function () {

        const pacienteId = self.usuario.id()
        const medicoSel = self.agendarCita.medicoSeleccionado();
        const fechaSel = self.agendarCita.fechaCita();
        const horaSel = self.agendarCita.horaSeleccionada();

        if (!medicoSel || !fechaSel || !pacienteId || !horaSel) {
            alert("Error de datos");
            return;
        }

        const medicoId = typeof medicoSel === "object" ? medicoSel.id() : medicoSel;

        var body = {
            idPac: pacienteId,
            idMed: medicoId,
            FechaCita: fechaSel,
            Hora: horaSel
        };
            
        console.log(body)

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
                    + "A las "
                    + horaSel);
            },
            error: function (xhr, status, error) {
                console.error("Error al agendar cita:", error);
                alert(xhr.responseText);
            }
        })
    }

    self.init();
    
}

ko.applyBindings(new PacienteViewModel());

const fechaInput = document.getElementById("fechaInput");

document.addEventListener('DOMContentLoaded', function () {

    //Bloquear fechas posteriores
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    const fechaMin = manana.toISOString().split('T')[0];
    fechaInput.min = fechaMin;
});

