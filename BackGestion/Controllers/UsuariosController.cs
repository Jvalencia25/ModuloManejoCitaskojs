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

        public UsuariosController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("registro")]
        public async Task<IActionResult> RegistrarUsuario([FromBody] UsuarioRegistroDTO data)
        {
            var error = await _usuarioService.RegistrarUsuarioAsync(data);
            if (error != null) return Conflict(error);

            return Ok("Usuario registrado correctamente");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO data)
        {
            var result = await _usuarioService.LoginAsync(data.Id, data.Password, data.TipoUsuario);
            if (result == null) return Unauthorized("Credenciales inválidas");

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerUsuario(long id, [FromQuery] string tipo)
        {
            var usuario = await _usuarioService.ObtenerUsuarioPorIdAsync(id, tipo);
            if (usuario == null) return NotFound();

            return Ok(usuario);
        }

        [HttpGet("{id}/nombre")]
        public async Task<IActionResult> ObtenerNombre(long id, [FromQuery] string tipo)
        {
            var nombre = await _usuarioService.ObtenerNombrePorIdAsync(id, tipo);
            if (nombre == null) return NotFound();

            return Ok(nombre);
        }
    }
}
