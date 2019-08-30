using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using AutoMapper;
using DAL.Exceptions;
using DAL.Extensions;
using DAL.Models;
using Services.Abstractions;
using Services.DTOs.Input;
using Services.DTOs.Output;
using Services.Extensions;

namespace Services.Implementations
{
	public class CategoryService : EntityService<Category>, ICategoryService
	{
		#region GetAllCategories

		public BaseResponse<IEnumerable<CategoryOutputDto>> All(IDictionary<string, string> @params)
		{
			var categories = Where(@params, out var total).Select(Mapper.Map<CategoryOutputDto>);

			return new SuccessResponseWithPagination<IEnumerable<CategoryOutputDto>>(total, data: categories);
		}

		private IEnumerable<Category> Where(IDictionary<string, string> predicate, out int total)
		{
			var queries = predicate.ToObject<PagingRequest>();

			total = Where(x => x.IsActivated()).Count();

			return Include(x => x.BookCategories)
				.Where(x => x.IsActivated())
				.Skip(queries.Limit * (queries.Page - 1))
				.Take(queries.Limit);
		}

		#endregion

		#region Create a category

		public BaseResponse<bool> CreateCategory(CategoryInputDto categoryInputDto)
		{
			if (Contains(x => x.IsActivated() && x.Name.Equals(categoryInputDto.Name, StringComparison.InvariantCultureIgnoreCase)))
			{
				throw new BadRequestException($"Thể loại {categoryInputDto.Name} đã tồn tại");
			}

			var category = Mapper.Map<Category>(categoryInputDto);
			Create(category, out var isSaved);
			if (!isSaved)
			{
				throw new BadRequestException($"Không thể tạo thể loại {category.Name}");
			}

			return new BaseResponse<bool>(HttpStatusCode.OK, data: true);
		}

		#endregion

		#region Create many categories

		public BaseResponse<int> CreateManyCategories(string[] categories)
		{
			var existedCategories = Where(x => x.IsActivated()).Select(c => c.Name);
			var nonExistedCategories = categories.Where(c => !existedCategories.Contains(c)).ToList();

			CreateMany(nonExistedCategories.Select(c => new Category {Name = c}), out var isSaved);
			if (!isSaved)
			{
				throw new BadRequestException($"Không thể import categories");
			}

			return new SuccessResponse<int>(nonExistedCategories.Count);
		}

		#endregion

		#region Update a category

		public BaseResponse<bool> UpdateCategory(Guid id, CategoryInputDto categoryInputDto)
		{
			var category = Find(id);
			if (category == null)
			{
				throw new BadRequestException($"Không tìm thấy thể loại {id}");
			}

			category.Name = categoryInputDto.Name;
			var isUpdated = Update(category);
			if (!isUpdated)
			{
				throw new InternalServerErrorException($"Không thể update thể loại {category.Name}");
			}

			return new BaseResponse<bool>(HttpStatusCode.OK, data: true);
		}

		#endregion

		#region Delete a category

		public BaseResponse<bool> DeleteCategory(Guid id)
		{
			var category = Find(id);
			if (category == null)
			{
				throw new BadRequestException($"Không tìm thấy thể loại {id}");
			}

			var deleted = Delete(category);
			if (!deleted)
			{
				throw new InternalServerErrorException($"Không thể delete thể loại {category.Name}");
			}

			return new BaseResponse<bool>(HttpStatusCode.OK, data: true);
		}

		#endregion
	}
}