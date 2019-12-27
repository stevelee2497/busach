using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstractions;
using Services.DTOs.Input;
using Services.DTOs.Output;
using Services.Extensions;

namespace API.Controllers
{
	[Route("api/books")]
	public class BookController : Controller
	{
		private readonly IBookService _bookService;

		public BookController(IBookService bookService)
		{
			_bookService = bookService;
		}

		[HttpGet]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<IEnumerable<BookOutputDto>> All([FromHeader] IDictionary<string, string> @params)
		{
			return _bookService.All(@params);
		}

		[HttpGet("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<BookOutputDto> GetBook(Guid id)
		{
			return _bookService.GetBook(id, User.GetUserId());
		}

		[HttpPost]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<BookOutputDto> CreateBook([FromBody] BookInputDto bookInputDto)
		{
			return _bookService.CreateBook(bookInputDto);
		}

		[HttpPost("import")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<IEnumerable<BookOutputDto>> CreateMany([FromBody] IEnumerable<BookInputDto> booksInputDto)
		{
			var userId = User.GetUserId();
			return _bookService.CreateMany(userId, booksInputDto);
		}

		[HttpPut("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> UpdateBook(Guid id, [FromBody] BookInputDto bookInputDto)
		{
			return _bookService.UpdateBook(id, bookInputDto);
		}

		[HttpDelete("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> DeleteBook(Guid id)
		{
			return _bookService.DeleteBook(id);
		}
	}
}