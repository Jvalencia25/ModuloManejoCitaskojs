using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackGestion.Models
{
    [Table("especialidad")]
    public class Especialidad
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [Column("duracion_min")]
        public int DuracionMin { get; set; } = 15;
    }
}
