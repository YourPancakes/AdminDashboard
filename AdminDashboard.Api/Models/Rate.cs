namespace AdminDashboard.Api.Models
{
    public class Rate
    {
        public int Id { get; set; }
        public decimal CurrentRate { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
