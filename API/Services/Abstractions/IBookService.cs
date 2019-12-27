using System;
using System.Collections.Generic;
using DAL.Models;
using Services.DTOs.Input;
using Services.DTOs.Output;

namespace Services.Abstractions
{
	public interface IBookService : IEntityService<Book>
	{
		BaseResponse<IEnumerable<BookOutputDto>> All(IDictionary<string, string> @params);
		BaseResponse<BookOutputDto> GetBook(Guid id, Guid userId);
		BaseResponse<BookOutputDto> CreateBook(BookInputDto bookInputDto);
		BaseResponse<IEnumerable<BookOutputDto>> CreateMany(Guid userId, IEnumerable<BookInputDto> booksInputDto);
		BaseResponse<bool> UpdateBook(Guid id, BookInputDto bookInputDto);
		BaseResponse<bool> DeleteBook(Guid id);
	}
}