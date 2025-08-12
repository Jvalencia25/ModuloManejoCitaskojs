var modelo = {
    usuario: {
        id: null,
        nombre: "",
        especialidad: ""
    },
    citas: [],
    fechaDesde: new Date().toISOString().split('T')[0],
    fechaHasta: new Date().toISOString().split('T')[0]
}

function MedicoViewModel() {
    const self = this;

    ko.mapping.fromJS(modelo, {}, self);

    self.init = function () {
        var user = JSON.parse(localStorage.getItem("usuario") || "null");
        if (user) ko.mapping.fromJS(user, {}, self.usuario);
        else window.location.href = "/Home.aspx";

        self.getCitas();
    }

    self.getCitas = function () {

        $.ajax({
            url: "https://localhost:44345/api/Citas?fechaDesde=" +
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
        window.location.href = "/Home.aspx";
    }

    self.init();
}

ko.applyBindings(new MedicoViewModel());