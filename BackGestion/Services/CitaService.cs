using BackGestion.Data;
using Microsoft.EntityFrameworkCore;

namespace BackGestion.Services
{
    public class CitaService
    {
        private readonly ApplicationDbContext _context;

        public CitaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TimeOnly>> VerDisponibilidad(DateOnly fecha, long idMedico)
        {
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

    }
}
