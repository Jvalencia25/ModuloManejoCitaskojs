namespace BackGestion.DTO
{
    public class UsuarioLoginDTO
    {
        public long Id { get; set; }
        public string Password { get; set; } = null!;
        public string TipoUsuario { get; set; } = null!;
    }
}
