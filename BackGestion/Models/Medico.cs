using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackGestion.Models
{
    [Table("medico")]
    public class Medico
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Column("fecha_nac")]
        public DateOnly FechaNac { get; set; }

        [Required]
        [Column("tipo_doc")]
        public string TipoDoc { get; set; } = string.Empty;

        [Required]
        [Column("genero")]
        public string Genero { get; set; } = string.Empty;

        [Required]
        [Column("celular")]
        public string Celular { get; set; } = string.Empty;

        [Required]
        [Column("password")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Column("id_especialidad")]
        public int IdEspecialidad { get; set; }

        public ICollection<Cita>? Citas { get; set; }

        [ForeignKey("IdEspecialidad")]
        public Especialidad Especialidad { get; set; }
    }
}

