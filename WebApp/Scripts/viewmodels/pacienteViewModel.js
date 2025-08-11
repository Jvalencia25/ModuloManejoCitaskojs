function agendarCita() {
    const self = this;

    //Especialidades
    self.especialidades = ko.observableArray([]);
    self.especialidadSeleccionada = ko.observable('');

    self.getEspecialidades = function () {
        fetch("https://localhost:44345/api/Usuarios/especialidades")
            .then(res => {
                if (!res.ok) throw new Error("Error obteniendo especialidades");
                return res.json();
            })
            .then(data => {
                self.especialidades(data);
            })
            .catch(err => console.error(err));
    };

    //Medicos
    self.medicos = ko.observableArray([]);
    self.medicoSeleccionado = ko.observable('');

    //Horas
    self.medicos = ko.observableArray([]);
    self.horaSeleccionada = ko.observable('');

    self.fechaCita = ko.observable('');
}

function pacienteViewModel() {
    var self = this;

    self.agendarCita = new agendarCita();
    
}

ko.applyBindings(pacienteViewModel());