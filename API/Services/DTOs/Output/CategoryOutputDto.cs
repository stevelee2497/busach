using System;

namespace Services.DTOs.Output
{
	public class CategoryOutputDto
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public int BookCount { get; set; }
		public DateTimeOffset CreatedTime { get; set; }
	}
}