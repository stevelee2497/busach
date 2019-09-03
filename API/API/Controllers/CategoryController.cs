using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstractions;
using Services.DTOs.Input;
using Services.DTOs.Output;

namespace API.Controllers
{
	[Route("api/categories")]
	public class CategoryController : Controller
	{
		private readonly ICategoryService _categoryService;

		public CategoryController(ICategoryService categoryService)
		{
			_categoryService = categoryService;
		}

		[HttpGet]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<IEnumerable<CategoryOutputDto>> All([FromHeader] IDictionary<string, string> @params)
		{
			return _categoryService.All(@params);
		}

		[HttpPost]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> CreateCategory([FromBody] CategoryInputDto categoryInputDto)
		{
			return _categoryService.CreateCategory(categoryInputDto);
		}

		[HttpPost("import")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<int> CreateManyCategories([FromBody] string[] categories)
		{
			return _categoryService.CreateManyCategories(categories);
		}

		[HttpPut("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> UpdateCategory(Guid id, [FromBody] CategoryInputDto categoryInputDto)
		{
			return _categoryService.UpdateCategory(id, categoryInputDto);
		}

		[HttpDelete("{id}")]
		[Authorize]
		[Produces("application/json")]
		public BaseResponse<bool> DeleteCategory(Guid id)
		{
			return _categoryService.DeleteCategory(id);
		}
	}
}