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
            if (result == null || !result.Any()) NotFound();

            return Ok(result);
        }

        /*
        [HttpGet]
        public ActionResult<List<Cita>> Get() => citas;

        [HttpPost]
        public ActionResult<Cita> Post(Cita cita)
        {
            cita.Id = currentId++;
            citas.Add(cita);
            return CreatedAtAction(nameof(GetById), new { ud = cita.Id }, cita);
        }

        [HttpGet("{id}")]
        public ActionResult<Cita> GetById(int id)
        {
            var cita = citas.FirstOrDefault(c => c.Id == id);
            if (cita == null) return NotFound();
            return cita;
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Cita updated)
        {
            var cita = citas.FirstOrDefault(c => c.Id == id);
            if (cita == null) return NotFound();

            cita.NombrePaciente = updated.NombrePaciente;
            cita.FechaHora = updated.FechaHora;
            cita.Motivo = updated.Motivo;
            cita.Cancelada = updated.Cancelada;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cita = citas.FirstOrDefault(c => c.Id==id);
            if (cita == null) return NotFound();

            citas.Remove(cita);
            return NoContent();
        }
        */
        

    }
    
}

