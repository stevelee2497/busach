using System.Linq;
using AutoMapper;
using AutoMapper.Configuration;
using DAL.Enums;
using DAL.Extensions;
using DAL.Models;
using Services.DTOs.Input;
using Services.DTOs.Output;

namespace API
{
	public static class AutoMapperConfig
	{
		public static void RegisterModel()
		{
			var configuration = new MapperConfigurationExpression();

			#region User

			configuration.CreateMap<UserInputDto, User>();

			configuration.CreateMap<User, UserOutputDto>().ForMember(
				destination => destination.Roles,
				map => map.MapFrom(source => source.GetRoles())
			);

			#endregion

			#region Author

			configuration.CreateMap<AuthorInputDto, Author>();

			configuration.CreateMap<Author, AuthorOutputDto>().ForMember(
				destination => destination.BookCount,
				map => map.MapFrom(source => source.Books.Count)
			);

			#endregion

			#region Category

			configuration.CreateMap<CategoryInputDto, Category>();

			configuration.CreateMap<Category, CategoryOutputDto>().ForMember(
				destination => destination.BookCount,
				map => map.MapFrom(source => source.BookCategories.Count)
			);

			#endregion

			#region Book

			configuration.CreateMap<BookInputDto, Book>();

			configuration.CreateMap<Book, BookOutputDto>().ForMember(
				destination => destination.Author,
				map => map.MapFrom(source => Mapper.Map<AuthorOutputDto>(source.Author))
			).ForMember(
				destination => destination.Owner,
				map => map.MapFrom(source => Mapper.Map<UserOutputDto>(source.Owner))
			).ForMember(
				destination => destination.Categories,
				map => map.MapFrom(source =>
					source.BookCategories.Select(x => Mapper.Map<CategoryOutputDto>(x.Category)))
			).ForMember(
				destination => destination.Comments,
				map => map.MapFrom(source => source.Comments.Select(Mapper.Map<CommentOutputDto>))
			).ForMember(
				destination => destination.Chapters,
				map => map.MapFrom(source => source.Chapters.Select(Mapper.Map<ChapterOutputDto>))
			);

			#endregion

			#region Chapter

			configuration.CreateMap<ChapterInputDto, Chapter>();

			configuration.CreateMap<Chapter, ChapterOutputDto>();

			configuration.CreateMap<Chapter, ChapterDetailOutputDto>();

			#endregion

			#region Like

			configuration.CreateMap<LikeInputDto, Like>();

			configuration.CreateMap<Like, LikeOutputDto>().ForMember(
				destination => destination.Liked,
				map => map.MapFrom(source => source.EntityStatus == EntityStatus.Activated)
			);

			#endregion

			Mapper.Initialize(configuration);
		}
	}
}