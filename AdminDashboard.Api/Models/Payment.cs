namespace AdminDashboard.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public decimal AmountT { get; set; }
        public DateTime Timestamp { get; set; }
        public Client Client { get; set; } = null!;
    }
}
