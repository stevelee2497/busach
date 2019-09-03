using AutoMapper;
using DAL.Exceptions;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Services.Abstractions;
using Services.DTOs.Input;
using Services.DTOs.Output;
using Services.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using DAL.Constants;
using DAL.Extensions;

namespace Services.Implementations
{
	public class BookService : EntityService<Book>, IBookService
	{
		#region Fields

		private readonly ILikeService _likeService;
		private readonly IBookCategoryService _bookCategoryService;

		#endregion

		#region Constructor

		public BookService(IBookCategoryService bookCategoryService, ILikeService likeService)
		{
			_bookCategoryService = bookCategoryService;
			_likeService = likeService;
		}

		#endregion

		#region Get books

		public BaseResponse<IEnumerable<BookOutputDto>> All(IDictionary<string, string> @params)
		{
			var books = Where(@params).Select(Mapper.Map<BookOutputDto>);

			return new BaseResponse<IEnumerable<BookOutputDto>>(HttpStatusCode.OK, data: books);
		}

		private IEnumerable<Book> Where(IDictionary<string, string> @params)
		{
			var queries = @params.ToObject<BookRequest>();

			var linqQuery = Include(x => x.Author)
				.Include(x => x.Owner)
				.Include(x => x.BookCategories).ThenInclude(x => x.Category)
				.Where(b => b.IsActivated());

			if (queries.CategoryId != Guid.Empty)
			{
				linqQuery = linqQuery.Where(b => b.BookCategories.Any(bc => bc.IsActivated() && bc.CategoryId == queries.CategoryId));
			}

			if (queries.AuthorId != Guid.Empty)
			{
				linqQuery = linqQuery.Where(book => book.AuthorId == queries.AuthorId);
			}

			if (!string.IsNullOrEmpty(queries.BookType))
			{
				linqQuery = FilterBookType(linqQuery, queries.BookType);
			}

			return linqQuery
				.Skip(queries.Limit * (queries.Page - 1))
				.Take(queries.Limit);
		}

		private IQueryable<Book> FilterBookType(IQueryable<Book> books, string bookType)
		{
			switch (bookType)
			{
				case BookType.NewBooks:
					return books.OrderByDescending(b => b.CreatedTime);

				case BookType.RecommendingBooks:
					return books.OrderByDescending(b => b.LikedCount);

				case BookType.TrendingBooks:
					return books.OrderByDescending(b => b.ReadCount);

				case BookType.FeaturingBooks:
					return books.OrderByDescending(b => b.AverageRating);

				default:
					throw new BadRequestException($"Không tồn tại filter {bookType}");
			}
		}

		#endregion

		#region Get a book

		public BaseResponse<BookOutputDto> GetBook(Guid id, Guid userId)
		{
			var book = Include(x => x.Author)
				.Include(x => x.Owner)
				.Include(x => x.BookCategories).ThenInclude(x => x.Category)
				.FirstOrDefault(x => x.Id == id);

			if (book == null)
			{
				throw new BadRequestException($"Không tìm thấy tác phẩm với id: {id}");
			}

			var bookOutputDto = Mapper.Map<BookOutputDto>(book);
			var liked = _likeService.FirstOrDefault(x => x.BookId == id && x.UserId == userId)?.IsActivated() ?? false;
			bookOutputDto.Liked = liked;

			return new SuccessResponse<BookOutputDto>(bookOutputDto);
		}

		#endregion

		#region Create a book

		public BaseResponse<BookOutputDto> CreateBook(BookInputDto bookInputDto)
		{
			if (Contains(x => x.Name.Equals(bookInputDto.Name, StringComparison.InvariantCultureIgnoreCase)))
			{
				throw new BadRequestException($"Tác phẩm {bookInputDto.Name} đã tồn tại");
			}

			var book = Mapper.Map<Book>(bookInputDto);
			book = Create(book, out var isSaved);
			if (!isSaved)
			{
				throw new BadRequestException($"Không thể tạo tác phẩm {book.Name}");
			}

			var bookCategories = _bookCategoryService.CreateMany(bookInputDto.CategoryIds.Select(categoryId =>
				new BookCategory
				{
					BookId = book.Id,
					CategoryId = Guid.Parse(categoryId)
				}), out isSaved);

			if (!isSaved)
			{
				throw new BadRequestException($"Không thể set category cho tác phẩm {book.Name}");
			}

			book.BookCategories = bookCategories as ICollection<BookCategory>;

			return new BaseResponse<BookOutputDto>(HttpStatusCode.OK, data: Mapper.Map<BookOutputDto>(book));
		}

		#endregion

		#region Import books

		public BaseResponse<IEnumerable<BookOutputDto>> CreateMany(Guid userId, IEnumerable<BookInputDto> booksInputDto)
		{
			var existedBooks = Where(b => booksInputDto.Any(dto => dto.Name.Equals(b.Name, StringComparison.InvariantCultureIgnoreCase)));
			var nonExistedBooks = FilterNonExistedBooks(booksInputDto, existedBooks);
			var createdBooks = CreateMany(SelectBookEntities(nonExistedBooks, userId), out var isSaved).ToList();
			if (!isSaved)
			{
				throw new BadRequestException($"Không thể import books");
			}

			// import categories for created books
			var bookCategories = SelectBookCategories(createdBooks, nonExistedBooks);
			_bookCategoryService.CreateMany(bookCategories, out isSaved);
			if (!isSaved)
			{
				throw new BadRequestException($"Không thể import books");
			}

			return new SuccessResponse<IEnumerable<BookOutputDto>>(createdBooks.Select(Mapper.Map<BookOutputDto>));
		}

		private static List<BookInputDto> FilterNonExistedBooks(IEnumerable<BookInputDto> booksInputDto, IQueryable<Book> existedBooks)
		{
			return booksInputDto
				.Where(dto => existedBooks.All(book => !book.Name.Equals(dto.Name, StringComparison.InvariantCultureIgnoreCase)))
				.ToList();
		}

		private IEnumerable<Book> SelectBookEntities(List<BookInputDto> nonExistedBooks, Guid userId)
		{
			return nonExistedBooks.Select(x =>
			{
				var b = Mapper.Map<Book>(x);
				b.OwnerId = userId;
				return b;
			});
		}

		private IEnumerable<BookCategory> SelectBookCategories(List<Book> createdBooks, IEnumerable<BookInputDto> nonExistedBooks)
		{
			foreach (var nonExistedBook in nonExistedBooks)
			{
				var createdBook = createdBooks.First(b => b.Name.Equals(nonExistedBook.Name, StringComparison.InvariantCultureIgnoreCase));
				foreach (var categoryId in nonExistedBook.CategoryIds)
				{
					yield return new BookCategory { BookId = createdBook.Id, CategoryId = Guid.Parse(categoryId) };
				}
			}
		}

		#endregion

		#region Update a book

		public BaseResponse<bool> UpdateBook(Guid id, BookInputDto bookInputDto)
		{
			var oldBook = Find(id);
			var newBook = Mapper.Map<Book>(bookInputDto);
			if (oldBook == null)
			{
				throw new BadRequestException($"Không tìm thấy tác phẩm {id}");
			}

			oldBook = UpdateBookInformation(oldBook, newBook, out var isSaved);
			oldBook = UpdateBookCategories(oldBook, bookInputDto.CategoryIds.Select(Guid.Parse).ToList(), ref isSaved);

			if (!isSaved)
			{
				throw new InternalServerErrorException($"Không thể update cho tác phẩm {oldBook.Name}");
			}

			return new BaseResponse<bool>(HttpStatusCode.OK, data: true);
		}

		private Book UpdateBookInformation(Book oldBook, Book newBook, out bool isSaved)
		{
			oldBook.Name = newBook.Name;
			oldBook.Description = newBook.Description;
			oldBook.BookCoverUrl = newBook.BookCoverUrl;
			oldBook.AuthorId = newBook.AuthorId;
			isSaved = Update(oldBook);
			return oldBook;
		}

		private Book UpdateBookCategories(Book oldBook, List<Guid> newCategoryIds, ref bool isSaved)
		{
			var oldBookCategories = _bookCategoryService.Where(x => x.BookId == oldBook.Id).ToList();

			// create new book - category ids
			var newIdsAdded = newCategoryIds.Where(id => oldBookCategories.All(bc => bc.CategoryId != id)).ToList();
			if (newIdsAdded.Any())
			{
				_bookCategoryService.CreateMany(
					newIdsAdded.Select(id => new BookCategory { CategoryId = id, BookId = oldBook.Id }), out isSaved
				);
			}

			// delete old book - category ids
			var oldIdsRemoved = oldBookCategories.Where(bc => !newCategoryIds.Contains(bc.CategoryId)).ToList();
			if (oldIdsRemoved.Any())
			{
				_bookCategoryService.Delete(oldIdsRemoved, out isSaved);
			}

			return oldBook;
		}

		#endregion

		#region Delete a book

		public BaseResponse<bool> DeleteBook(Guid id)
		{
			var book = Find(id);
			if (book == null)
			{
				throw new BadRequestException($"Không tìm thấy tác phẩm {id}");
			}

			var isDeleted = Delete(book);
			if (!isDeleted)
			{
				throw new InternalServerErrorException($"Không thể delete tác phẩm {book.Name}");
			}

			return new BaseResponse<bool>(HttpStatusCode.OK, data: true);
		}


		#endregion
	}
}