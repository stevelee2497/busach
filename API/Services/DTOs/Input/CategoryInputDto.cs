using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Input
{
	public class CategoryInputDto
	{
		[Required]
		public string Name { get; set; }
	}
}