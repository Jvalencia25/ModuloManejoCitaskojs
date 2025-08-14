namespace BackGestion.DTO
{
    public class CitaDTO
    {
        public long IdCita { get; set; }
        public DateOnly FechaCita { get; set; }
        public TimeOnly Hora { get; set; }
        public string NombreMedico { get; set; } = string.Empty;
        public string Especialidad { get; set; } = string.Empty;
        public string NombrePaciente { get; set; } = string.Empty;
        public int Duracion { get; set; }
    }

}
