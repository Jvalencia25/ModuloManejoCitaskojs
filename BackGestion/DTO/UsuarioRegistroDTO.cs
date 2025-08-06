using System.ComponentModel.DataAnnotations;

namespace BackGestion.DTO
{
    public class UsuarioRegistroDTO
    {
        [Required]
        [RegularExpression(@"^\d{5,}$", ErrorMessage = "El número de identificación debe tener al menos 5 dígitos.")]
        public long Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Nombre { get; set; }

        [Required]
        public DateOnly FechaNac { get; set; }

        [Required]
        [RegularExpression("^(cc|ti|ce|rc|pa)$", ErrorMessage = "Tipo de documento no válido.")]
        public string TipoDoc { get; set; }

        [Required]
        [RegularExpression("^(m|f|o)$", ErrorMessage = "Género no válido.")]
        public string Genero { get; set; }

        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Número de celular no válido.")]
        public string Celular { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        [RegularExpression("^(paciente|medico)$", ErrorMessage = "Tipo de usuario no válido.")]
        public string TipoUsuario { get; set; }

        public int? IdEspecialidad { get; set; }
    }

}
