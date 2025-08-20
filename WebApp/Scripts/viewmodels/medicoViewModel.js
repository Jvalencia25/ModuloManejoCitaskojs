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
        idPaciente: ko.observable(""),
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

    self.editarCita = function (cita) {
        console.log("En desarrollo")

        //self.agendarCita.idCita = cita.idCita; 
        //self.agendarCita.fechaCita(cita.fechaCita);
        //self.agendarCita.horaSeleccionada(cita.hora);
        //self.agendarCita.duracion(cita.duracion);

        //$('#modalEditarCita').modal('show');

        //self.getHorasDisponibles()

        //$.ajax({
        //    url: "https://localhost:44345/api/Citas/"
        //        + cita.idCita() 
        //        + "$fecha="
        //        + cita.fechaCita
        //        + "&hora="
        //        + cita.hora
        //        + "&duracion="
        //        +cita.duracion, 
        //    type: "PUT",
        //    success: function (data) {
        //        alert(data);
        //        self.getCitas();
        //    },
        //    error: function (xhr) {
        //        alert("Error al editar cita: " + xhr.responseText);
        //    }
        //})
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

    self.citas.subscribe(function (nuevaLista) {

        $('#tablaCitas').dxDataGrid({
            dataSource: self.citas(),
            keyExpr: "idCita",
            showBorders: true,
            columnAutoWidth: true,
            rowAlternationEnabled: true,
            showColumnLines: true,
            showRowLines: true,
            noDataText: "No hay citas pendientes para este rango de fechas",
            columns: [
                { dataField: 'fechaCita', caption: 'Fecha' },
                { dataField: 'hora', caption: 'Hora' },
                { dataField: 'duracion', caption: 'Duración (en minutos)', alignment: 'left' },
                { dataField: 'nombrePaciente', caption: 'Paciente' },
                {
                    caption: "Acctiones",
                    type: "buttons",
                    buttons: [
                        {
                            hint: 'Editar',
                            icon: 'edit',
                            onClick: function(e) {
                                self.editarCita(e.row.data)
                            }
                        },
                        {
                            hint: 'Eliminar',
                            icon: 'trash',
                            onClick: function (e) {
                                self.eliminarCita(e.row.data)
                            }
                        }

                    ]
                }
            ]
        });
        
    })

    self.cerrarSesion = function () {
        localStorage.removeItem("usuario");
        window.location.href = "/Vistas/Home.aspx"
    }

    self.init();
}

ko.applyBindings(new MedicoViewModel());

//JS
const fechaInput = document.getElementById("fechaInput");



$(document).ready(function () {

    $('#selectUsuario').select2({
        placeholder: 'Selecciona una opción',
        minimumInputLength: 2,
        ajax: {
            url: "https://localhost:44345/api/Usuarios/search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    term: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.result
                };
            }
        }
    }).on('select2:select', function (e) {
        var data = e.params.data;
        modelo.agendarCita.idPaciente(data.id);
    })
});

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