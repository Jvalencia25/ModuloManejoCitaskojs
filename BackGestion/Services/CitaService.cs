using BackGestion.Data;
using BackGestion.DTO;
using BackGestion.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BackGestion.Services
{
    public class CitaService
    {
        private readonly ApplicationDbContext _context;

        private readonly UsuarioService _usuarioService;

        public CitaService(ApplicationDbContext context, UsuarioService usuarioService)
        {
            _context = context;
            _usuarioService = usuarioService;
        }

        public async Task<List<Cita>> ObtenerTodasLasCitasAsync()
        {
            return await _context.Citas
                .Include(c => c.Medico)
                .Include(c => c.Paciente)
                .ToListAsync();
        }

        public async Task<List<CitaDTO>> ObtenerCitasEnRangoDeFecha(DateOnly fechaDesde, DateOnly fechaHasta)
        {
            return await _context.Citas
                .Include(c => c.Medico)
                .Include(c => c.Paciente)
                .Where(c => c.FechaCita >= fechaDesde && c.FechaCita <= fechaHasta)
                .Select(c => new CitaDTO
                {
                    IdCita = c.IdCita,
                    FechaCita = c.FechaCita,
                    Hora = c.Hora,
                    NombreMedico = c.Medico.Nombre,
                    Especialidad = c.Medico.Especialidad.Nombre,
                    NombrePaciente = c.Paciente.Nombre
                })
                .ToListAsync();
        }

        public async Task<List<CitaDTO>> ObtenerCitasEnRangoDeFechaPorMedico(DateOnly fechaDesde, DateOnly fechaHasta, long idMedico)
        {
            return await _context.Citas
                .Include(c => c.Medico)
                    .ThenInclude(m => m.Especialidad)
                .Include(c => c.Paciente)
                .Where(c => c.FechaCita >= fechaDesde && c.FechaCita <= fechaHasta && c.IdMed == idMedico)
                .Select(c => new CitaDTO
                {
                    IdCita = c.IdCita,
                    FechaCita = c.FechaCita,
                    Hora = c.Hora,
                    NombreMedico = c.Medico.Nombre,
                    Especialidad = c.Medico.Especialidad.Nombre,
                    NombrePaciente = c.Paciente.Nombre
                })
                .ToListAsync();
        }


        public async Task<List<CitaDTO>> ObtenerCitasPorUsuario(long idPaciente)
        {
            return await _context.Citas
                .Include(c => c.Medico)
                    .ThenInclude(m => m.Especialidad)
                .Include(c => c.Paciente)
                .Where(c => c.IdPac == idPaciente)
                .Select(c => new CitaDTO
                {
                    IdCita = c.IdCita,
                    FechaCita = c.FechaCita,
                    Hora = c.Hora,
                    NombreMedico = c.Medico.Nombre,
                    Especialidad = c.Medico.Especialidad.Nombre,
                    NombrePaciente = c.Paciente.Nombre
                })
                .ToListAsync();
        }


        public async Task<object?> VerDisponibilidad(DateOnly fecha, long idMedico)
        {
            //Valida si es fecha anterior
            if (fecha <= DateOnly.FromDateTime(DateTime.Now)) return "No hay disponibilidad";

            //valida si es domingo
            var fechaDateTime = fecha.ToDateTime(TimeOnly.MinValue);
            if (fechaDateTime.DayOfWeek == DayOfWeek.Sunday) return "No hay disponibilidad";

            var medico = await _context.Medicos
                .Include(m => m.Especialidad)
                .FirstOrDefaultAsync(m => m.Id == idMedico);

            if (medico == null || medico.Especialidad == null) return new List<TimeOnly>();

            int duracion = medico.Especialidad.DuracionMin;
            TimeOnly inicio = new(8, 0);
            TimeOnly fin = new(17, 0);

            // Genera bloques de horas
            var bloques = new List<TimeOnly>();
            for (var hora = inicio; hora.AddMinutes(duracion) <= fin; hora = hora.AddMinutes(duracion)) bloques.Add(hora);

            // Obtener citas
            var ocupados = await _context.Citas
                .Where(c => c.IdMed == idMedico && c.FechaCita == fecha)
                .Select(c => c.Hora)
                .ToListAsync();

            // Filtrar
            var disponibles = bloques
                .Where(b => !ocupados.Contains(b))
                .ToList();

            return disponibles;
        }

        public async Task<object?> AgendarCita(AgendarCitaDTO data)
        {
            if (!await ValidarDisponibilidad(data.IdMed, data.FechaCita, data.Hora)) return "No hay disponibilidad";

            if (!await ValidarLimiteCitasPorDia(data.IdPac, data.FechaCita)) return "No se puedena agendar más de dos citas en un día";

            var nuevaCita = new Cita
            {
                IdPac = data.IdPac,
                IdMed = data.IdMed,
                FechaCita = data.FechaCita,
                Hora = data.Hora
            };

            _context.Citas.Add(nuevaCita);
            await _context.SaveChangesAsync();
            return nuevaCita;
        }

        public async Task<bool> ValidarDisponibilidad(long idMedico, DateOnly fecha, TimeOnly hora)
        {
            //Valida si es fecha anterior
            if (fecha <= DateOnly.FromDateTime(DateTime.Now)) return false;
            
            //valida si es domingo
            var fechaDateTime = fecha.ToDateTime(TimeOnly.MinValue);
            if (fechaDateTime.DayOfWeek == DayOfWeek.Sunday) return false;

            //valida si es horario laboral
            var horaManana = new TimeOnly(8, 0);
            var horaTarde = new TimeOnly(17, 0);
            if (hora < horaManana || hora > horaTarde) return false;

            //Valida si está disponible
            var medico = await _context.Medicos
                .Include(m => m.Especialidad)
                .FirstOrDefaultAsync(m => m.Id == idMedico);

            if (medico == null || medico.Especialidad == null) return false;

            int duracion = medico.Especialidad.DuracionMin;
            TimeOnly horaFin = hora.AddMinutes(duracion);

            var hayConflicto = await _context.Citas
                .Where(c => c.IdMed == idMedico && c.FechaCita == fecha)
                .AnyAsync(c =>
                    hora < c.Hora.AddMinutes(duracion) &&
                    horaFin > c.Hora);

            return !hayConflicto;
        }

        public async Task<bool> ValidarLimiteCitasPorDia(long idPaciente, DateOnly fecha)
        {
            var cantidadCitas = await _context.Citas
                .Where(c => c.IdPac == idPaciente && c.FechaCita == fecha)
                .CountAsync();

            return cantidadCitas < 2;
        }

        public async Task<bool> DeleteCita(long id)
        {
            var cita = await _context.Citas.FirstOrDefaultAsync(c => c.IdCita == id);
            if (cita == null) return false;

            _context.Citas.Remove(cita);
            _context.SaveChanges();
            return true;
        }

    }
}
