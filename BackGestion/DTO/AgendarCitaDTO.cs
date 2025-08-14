namespace BackGestion.DTO
{
    public class AgendarCitaDTO
    {
        public long IdPac { get; set; }
        public long IdMed { get; set; }
        public DateOnly FechaCita { get; set; }
        public TimeOnly Hora { get; set; }
        public int Duracion { get; set; }
    }
}
