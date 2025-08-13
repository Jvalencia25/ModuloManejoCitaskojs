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

        [HttpPost]
        public async Task<IActionResult> AgendarCita([FromBody] AgendarCitaDTO data)
        {
            var resultado = await _citaService.AgendarCita(data);
            if (resultado == null) return StatusCode(500, "Error al agendar cita");

            return Ok(resultado);
        }


        //[HttpGet]
        //public async Task<IActionResult> ObtenerCitas([FromQuery] DateOnly? fechaDesde, [FromQuery] DateOnly? fechaHasta)
        // {

        //     if (fechaDesde.HasValue && fechaHasta.HasValue)
        //     {
        //         var citas = await _citaService.ObtenerCitasEnRangoDeFecha(fechaDesde.Value, fechaHasta.Value);
        //         return Ok(citas);
        //     }

        //     var todas = await _citaService.ObtenerTodasLasCitasAsync();

        //     if (todas == null || !todas.Any()) return NotFound("No hay citas registradas");
        //     return Ok(todas);
        // }

        [HttpGet("medico/{idMedico}")]
        public async Task<ActionResult<List<CitaDTO>>> GetCitasPorMedico(
            [FromQuery] DateOnly? fechaDesde,
            [FromQuery] DateOnly? fechaHasta,
            long idMedico)
        {

            if (fechaDesde.HasValue && fechaHasta.HasValue)
            {
                var citas = await _citaService.ObtenerCitasEnRangoDeFechaPorMedico(fechaDesde.Value, fechaHasta.Value, idMedico);
                return Ok(citas);
            }

            var todas = await _citaService.ObtenerCitasPorMedico(idMedico);

            if (todas == null || !todas.Any()) return NotFound("No hay citas registradas");
            return Ok(todas);
        }

        [HttpGet("paciente/{idPaciente}")]
        public async Task<ActionResult<List<CitaDTO>>> ObtenerCitasPorPaciente(long idPaciente)
        {
            var citas = await _citaService.ObtenerCitasPorUsuario(idPaciente);
            return Ok(citas);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCita(long id)
        {
            var result = await _citaService.DeleteCita(id);
            if (!result) return BadRequest("Error al eliminar la cita");

            return Ok("Cita eliminada");
        }

    }

}

