using BackGestion.Data;
using BackGestion.DTO;
using BackGestion.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackGestion.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        private readonly EspecialidadService _especialidadService;

        public UsuariosController(UsuarioService usuarioService, EspecialidadService especialidadService)
        {
            _usuarioService = usuarioService;
            _especialidadService = especialidadService;
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarUsuario([FromBody] UsuarioRegistroDTO data)
        {
            var error = await _usuarioService.RegistrarUsuarioAsync(data);
            if (error != null) return Conflict(error);

            return Ok(new { mensaje = "Usuario registrado correctamente" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO data)
        {
            var result = await _usuarioService.LoginAsync(data.Id, data.Password, data.TipoUsuario);
            if (result == null) return Unauthorized("Credenciales inválidas");

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerUsuarioPorId(long id, [FromQuery] string tipo)
        {
            var usuario = await _usuarioService.ObtenerUsuarioPorIdAsync(id, tipo);
            if (usuario == null) return NotFound();

            return Ok(usuario);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPacientes([FromQuery] string term)
        {
            var result = await _usuarioService.SearchPacientes(term);
            if (result == null) return NotFound(); 
            
            return Ok(new { result });
        }

        [HttpGet("{id}/nombre")]
        public async Task<IActionResult> ObtenerNombrePorId(long id, [FromQuery] string tipo)
        {
            var nombre = await _usuarioService.ObtenerNombrePorIdAsync(id, tipo);
            if (nombre == null) return NotFound();

            return Ok(nombre);
        }

        [HttpGet("medicos/{especialidad}")]
        public async Task<IActionResult> ObtenerMedicosPorEspecialidad(string especialidad)
        {
            var medicos = await _usuarioService.ObtenerMedicosPorEspecialidad(especialidad);
            if (medicos == null) return NotFound();

            return Ok(medicos);
        }

        [HttpGet("especialidades")]
        public async Task<IActionResult> ObtenerEspecialidades()
        {
            var especialidades = await _especialidadService.ObtenerEspecialidad();
            if (especialidades  == null) return NotFound();

            return Ok(especialidades);
        }
    }
}
