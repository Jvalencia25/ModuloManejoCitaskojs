using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackGestion.Models
{
    //TODO: eliminar estas validaciones
    [Table("paciente")]
    public class Paciente
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
    }
}

