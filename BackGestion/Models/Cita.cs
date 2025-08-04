namespace BackGestion.Models
{
    public class Cita
    {
        public int Id { get; set; }
        public string NombrePaciente { get; set; }
        public DateTime FechaHora { get; set; }
        public string Motivo { get; set; }
        public bool Cancelada { get; set; }
    }
}
