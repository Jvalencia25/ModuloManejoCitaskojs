using System.ComponentModel.DataAnnotations;

namespace BackGestion.Models
{
    public class Especialidad
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Nombre { get; set; }

        [Required]
        public int DuracionMin { get; set; } = 15;
    }
}
