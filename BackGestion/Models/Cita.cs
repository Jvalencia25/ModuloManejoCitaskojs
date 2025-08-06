using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackGestion.Models
{
    [Table("citas")]
    public class Cita
    {
        [Key]
        [Column("id_cita")]
        public long IdCita { get; set; }

        [Required]
        [Column("id_pac")]
        public long IdPac { get; set; }

        [ForeignKey("IdPac")]
        public Paciente? Paciente { get; set; }

        [Required]
        [Column("id_med")]
        public long IdMed { get; set; }

        [ForeignKey("IdMed")]
        public Medico? Medico { get; set; }

        [Required]
        [Column("fecha_cita")]
        public DateOnly FechaCita { get; set; }

        [Required]
        [Column("hora")]
        public TimeSpan Hora { get; set; }

        [Required]
        [Column("especialidad")]
        public string Especialidad { get; set; } = string.Empty;

        [Required]
        [Column("duracion")]
        public int Duracion { get; set; }
    }
}

