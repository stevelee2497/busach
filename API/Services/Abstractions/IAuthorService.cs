using System;
using System.Collections.Generic;
using DAL.Models;
using Services.DTOs.Input;
using Services.DTOs.Output;

namespace Services.Abstractions
{
	public interface IAuthorService : IEntityService<Author>
	{
		BaseResponse<IEnumerable<AuthorOutputDto>> All(IDictionary<string, string> @params);
		BaseResponse<bool> CreateAuthor(AuthorInputDto authorInputDto);
		BaseResponse<bool> UpdateAuthor(Guid id, AuthorInputDto authorInputDto);
		BaseResponse<bool> DeleteAuthor(Guid id);
	}
}