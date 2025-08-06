using BackGestion.Data;
using BackGestion.DTO;
using BackGestion.Models;
using Microsoft.EntityFrameworkCore;

namespace BackGestion.Services
{
    public class UsuarioService
    {
        private readonly ApplicationDbContext _context;

        public UsuarioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string?> RegistrarUsuarioAsync(UsuarioRegistroDTO data)
        {
            string tipo = data.TipoUsuario;
            long id = data.Id;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(data.Password);

            if (data.Nombre.Length < 2) return ("Nombre inválido");

            if ((data.TipoDoc != "cc" ) &&
                (data.TipoDoc != "ce") && 
                (data.TipoDoc != "ti") && 
                (data.TipoDoc != "pa") &&
                (data.TipoDoc != "rc")) return("Documento inválido");

            if ((data.Genero != "m") &&
                (data.Genero != "f") &&
                (data.Genero != "o")) return("Género inválido");

            if (!IsDigitOnly(data.Celular) || data.Celular.Length > 15 || data.Celular.Length < 7) return ("Número de celular inválido");

            if (data.FechaNac > DateOnly.FromDateTime(DateTime.UtcNow)) return("La fecha de nacimiento no puede ser en el futuro");

            int edad = CalcularEdad(data.FechaNac);
            if ((edad < 18 && data.TipoDoc == "cc") || (edad < 18 && data.TipoDoc == "ce")) return ("Documento inválido");
            else if ((edad >= 18 && data.TipoDoc == "rc") || (edad < 18 && data.TipoDoc == "ti")) return ("Documento inválido");
            

            if (tipo == "paciente")
            {

                var existe = await _context.Pacientes.AnyAsync(p => p.Id == id);
                if (existe) return "Paciente ya registrado.";

                var nuevo = new Paciente
                {
                    Id = id,
                    Nombre = data.Nombre,
                    FechaNac = data.FechaNac,
                    TipoDoc = data.TipoDoc,
                    Genero = data.Genero,
                    Celular = data.Celular,
                    Password = passwordHash
                };

                _context.Pacientes.Add(nuevo);
                await _context.SaveChangesAsync();
                return null;
            }
            else if (tipo == "medico")
            {
                if (data.IdEspecialidad == null) return "Debe seleccionar una especialidad para registrar un médico.";

                var existe = await _context.Medicos.AnyAsync(p => p.Id == id);
                if (existe) return "Médico ya registrado.";

                var nuevo = new Medico
                {
                    Id = id,
                    Nombre = data.Nombre,
                    FechaNac = data.FechaNac,
                    TipoDoc = data.TipoDoc,
                    Genero = data.Genero,
                    Celular = data.Celular,
                    Password = passwordHash,
                    IdEspecialidad = data.IdEspecialidad.Value
                };

                _context.Medicos.Add(nuevo);
                await _context.SaveChangesAsync();
                return null;
            }
            return ("Tipo de usuario no válido");
        }

        public async Task<object?> LoginAsync(long id, string password, string tipo)
        {

            if (tipo == "paciente")
            {
                var paciente = await _context.Pacientes.FirstOrDefaultAsync(p => p.Id == id);

                if (paciente == null) return null;

                if (BCrypt.Net.BCrypt.Verify(password, paciente.Password)) return paciente;
            }
            else if (tipo == "medico")
            {
                var medico = await _context.Medicos
                    .Include(m => m.Especialidad)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (medico == null) return null;

                if (BCrypt.Net.BCrypt.Verify(password, medico.Password)) return medico;
            }

            return null;
        }


        public async Task<object?> ObtenerNombrePorIdAsync(long id, string tipo)
        {
            if (tipo == "paciente")
            {
                var paciente = await _context.Pacientes.FindAsync(id);
                return paciente?.Nombre;
            }
            else if (tipo == "medico")
            {
                var medico = await _context.Medicos.FindAsync(id);
                return medico?.Nombre;
            }

            return null;
        }

        public async Task<object?> ObtenerUsuarioPorIdAsync(long id, string tipo)
        {
            if (tipo == "paciente") return await _context.Pacientes.FindAsync(id);
            else if (tipo == "medico") return await _context.Medicos.FindAsync(id);

            return null;
        }

        public async Task<object?> ObtenerMedicosPorEspecialidad(string especialidad)
        {
            return await _context.Medicos
                .Include(m => m.Especialidad)
                .Where(m => m.Especialidad.ToString().ToLower() == especialidad.ToLower())
                .ToListAsync();
        }

        public int CalcularEdad(DateOnly fecha)
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            int edad = hoy.Year - fecha.Year;
            int mes = hoy.Month - fecha.Month;

            if (hoy.Month < fecha.Month || (hoy.Month == fecha.Month && hoy.Day < fecha.Day)) edad--;

            return edad;
        }

        public bool IsDigitOnly(String str)
        {
            foreach (char c in str)
            {
                if (c<'0' ||  c>'9') return false;
            }
            return true;
        }
    }

}
