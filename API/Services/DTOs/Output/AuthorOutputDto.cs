using System;

namespace Services.DTOs.Output
{
	public class AuthorOutputDto
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public int BookCount { get; set; }
		public DateTimeOffset CreatedTime { get; set; }
	}
}