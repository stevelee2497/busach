using System;
using System.Collections.Generic;
using DAL.Models;
using Services.DTOs.Input;
using Services.DTOs.Output;

namespace Services.Abstractions
{
	public interface ICategoryService : IEntityService<Category>
	{
		BaseResponse<IEnumerable<CategoryOutputDto>> All(IDictionary<string, string> @params);
		BaseResponse<bool> CreateCategory(CategoryInputDto categoryInputDto);
		BaseResponse<int> CreateManyCategories(string[] categories);
		BaseResponse<bool> UpdateCategory(Guid id, CategoryInputDto categoryInputDto);
		BaseResponse<bool> DeleteCategory(Guid id);
	}
}