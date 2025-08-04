using BackGestion.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackGestion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private static List<Cita> citas = new List<Cita>();
        private static int currentId = 1;

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
        

    }
}
