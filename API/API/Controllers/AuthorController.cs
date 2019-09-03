using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstractions;
using Services.DTOs.Input;
using Services.DTOs.Output;

namespace API.Controllers
{
	[Route("api/authors")]
	public class AuthorController : Controller
	{
		private readonly IAuthorService _authorService;

		public AuthorController(IAuthorService authorService)
		{
			_authorService = authorService;
		}

		[HttpGet]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<IEnumerable<AuthorOutputDto>> All([FromHeader] IDictionary<string, string> @params)
		{
			return _authorService.All(@params);
		}

		[HttpPost]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> Create([FromBody] AuthorInputDto authorInputDto)
		{
			return _authorService.CreateAuthor(authorInputDto);
		}

		[HttpPut("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> Update(Guid id, [FromBody] AuthorInputDto authorInputDto)
		{
			return _authorService.UpdateAuthor(id, authorInputDto);
		}

		[HttpDelete("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> DeleteAuthor(Guid id)
		{
			return _authorService.DeleteAuthor(id);
		}
	}
}