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
        window.location.href = "/Vistas/Home.aspx";
    }

    self.init = function () {
        var userLS = JSON.parse(localStorage.getItem("usuario") || "null");
        if (userLS) ko.mapping.fromJS(userLS, {}, self.usuario);
        else window.location.href = "/Vistas/Home.aspx";

        self.getEspecialidades();
        self.getCitas();

    }

    self.getEspecialidades = function () {

        $.ajax({
            url: "https://localhost:44345/api/Usuarios/especialidades",
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.agendarCita.especialidades);
                //console.log(data)
            },
            error: function (xhr) {
                alert("Error al obtener especialidades: " + xhr.responseText);
            }
        })
    };

    // Obtener médicos al seleccionar especialidad
    self.getMedicos = function (especialidad) {
        const esp = especialidad || self.agendarCita.especialidadSeleccionada();

        if (!esp) {
            self.agendarCita.medicos([]);
            self.agendarCita.medicoSeleccionado && self.agendarCita.medicoSeleccionado(null);
            return;
        }

        const nombre = ko.unwrap(esp.nombre);
        if (!nombre) {
            self.agendarCita.medicos([]);
            return;
        }

        $.ajax({
            url: "https://localhost:44345/api/Usuarios/medicos/" + nombre,
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.agendarCita.medicos);
                console.log(data)
            },
            error: function (xhr) {
                alert("Error al obtener médicos: " + xhr.responseText);
            }
        })
    }


    // Obtener fechas disponibles
    self.getHorasDisponibles = function () {
        
        const medicoSel = self.agendarCita.medicoSeleccionado();
        const fechaSel = self.agendarCita.fechaCita();

        const dur = ko.unwrap(self.agendarCita.especialidadSeleccionada()?.duracionDef);

        //console.log(medicoSel + fechaSel + dur)

        if (!medicoSel || !fechaSel || !dur) return;

        const medicoId = typeof medicoSel === "object" ? medicoSel.id() : medicoSel;

        $.ajax({
            url: "https://localhost:44345/api/Citas/disponibilidad/?idMedico="
                + medicoId
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

    self.agendarCita.especialidadSeleccionada.subscribe(function (esp) {
        self.agendarCita.medicos([]);
        self.agendarCita.medicoSeleccionado && self.agendarCita.medicoSeleccionado(null);
        self.agendarCita.fechaCita && self.agendarCita.fechaCita(null);
        self.agendarCita.horasDisponibles && self.agendarCita.horasDisponibles([]);
        self.agendarCita.horaSeleccionada && self.agendarCita.horaSeleccionada(null);

        self.getMedicos(esp);
    });

    self.agendarCita.medicoSeleccionado.subscribe(function () {
        self.agendarCita.fechaCita(null);
        self.agendarCita.horasDisponibles([]);
        self.agendarCita.horaSeleccionada(null);
    });

    self.agendarCita.fechaCita.subscribe(function () {
        self.agendarCita.horasDisponibles([]);
        self.agendarCita.horaSeleccionada(null);
        self.getHorasDisponibles();
    });

    self.agendar = function () {

        const pacienteId = self.usuario.id()
        const medicoSel = self.agendarCita.medicoSeleccionado();
        const fechaSel = self.agendarCita.fechaCita();
        const horaSel = self.agendarCita.horaSeleccionada();
        const dur = ko.unwrap(self.agendarCita.especialidadSeleccionada()?.duracionDef);

        if (!medicoSel || !fechaSel || !pacienteId || !horaSel || !dur) {
            alert("Error de datos");
            return;
        }

        const medicoId = typeof medicoSel === "object" ? medicoSel.id() : medicoSel;

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

    self.citas.subscribe(function (nuevaLista) {
        if (nuevaLista.length > 0) {
            $('#tablaCitas').dxDataGrid({
                dataSource: self.citas(),
                keyExpr: "idCita",
                showBorders: true,
                columnAutoWidth: true,
                rowAlternationEnabled: true,
                showColumnLines: true,
                showRowLines: true,
                columns: [
                    { dataField: 'especialidad', caption: 'Especialidad' },
                    { dataField: 'fechaCita', caption: 'Fecha' },
                    { dataField: 'hora', caption: 'Hora' },
                    { dataField: 'duracion', caption: 'Duración (en minutos)', alignment: 'left' },
                    { dataField: 'nombreMedico', caption: 'Médico' }
                ]
            });
        }
    })

    self.getCitas = function () {
        $.ajax({
            url: "https://localhost:44345/api/Citas/paciente/" + self.usuario.id(),
            type: "GET",
            success: function (data) {
                ko.mapping.fromJS(data, {}, self.citas);
                console.log(data);
            },
            error: function (xhr, error) {
                console.error("Error al obtener citas: ", error);
                alert(xhr.responseText);
            }
        })
    }

    self.init();
    
}

ko.applyBindings(new PacienteViewModel());

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



