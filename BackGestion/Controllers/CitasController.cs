using BackGestion.DTO;
using BackGestion.Models;
using BackGestion.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace BackGestion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private readonly CitaService _citaService;
        public CitasController(CitaService citaService)
        {
            _citaService = citaService;
        }

        [HttpGet("disponibilidad")]
        public async Task<IActionResult> ObtenerDisponibilidad([FromQuery] long idMedico, [FromQuery] DateOnly fecha)
        {
            var result = await _citaService.VerDisponibilidad(fecha, idMedico);
            if (result == null) NotFound();

            return Ok(result);
        }

        

        [HttpPost("agendar")]
        public async Task<IActionResult> AgendarCita([FromBody] AgendarCitaDTO data)
        {
            var resultado = await _citaService.AgendarCita(data);
            if (resultado == null) return StatusCode(500, "Error al agendar cita");

            return Ok(resultado);
        }

        
        [HttpGet]
       public async Task<IActionResult> GetTodasLasCitas()
        {
            var citas = await _citaService.ObtenerTodasLasCitasAsync();

            if (citas == null || !citas.Any()) return NotFound("No hay citas registradas");

            return Ok(citas);
        }

        [HttpGet("medico")]
        public async Task<ActionResult<List<CitaDTO>>> GetCitasPorMedico(
            [FromQuery] DateOnly fechaDesde,
            [FromQuery] DateOnly fechaHasta,
            [FromQuery] long idMedico)
        {
            var citas = await _citaService.ObtenerCitasEnRangoDeFechaPorMedico(fechaDesde, fechaHasta, idMedico);
            return Ok(citas);
        }

        [HttpGet("paciente/{idPaciente}")]
        public async Task<ActionResult<List<CitaDTO>>> GetCitasPorPaciente(long idPaciente)
        {
            var citas = await _citaService.ObtenerCitasPorUsuario(idPaciente);
            return Ok(citas);
        }

        [HttpGet]
        public async Task<ActionResult<List<CitaDTO>>> GetCitasEnRangoDeFechas([FromQuery] DateOnly fechaDesde, [FromQuery] DateOnly fechaHasta)
        {
            var citas = await _citaService.ObtenerCitasEnRangoDeFecha(fechaDesde, fechaHasta);
            return Ok(citas);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCita(int id)
        {
            var cita = await _citaService.DeleteCita(id);
            if (!cita) return BadRequest("Error al eliminar la cita");

            return Ok("Cita eliminada");
        }

    }

}

