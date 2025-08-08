using BackGestion.Data;
using BackGestion.Models;
using Microsoft.EntityFrameworkCore;

namespace BackGestion.Services
{
    public class EspecialidadService
    {
        private readonly ApplicationDbContext _context;

        public EspecialidadService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Especialidad>> ObtenerEspecialidad()
        {
            return await _context.Especialidades.ToListAsync();
        }
    }
}
