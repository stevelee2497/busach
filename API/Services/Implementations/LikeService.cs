using AutoMapper;
using DAL.Enums;
using DAL.Exceptions;
using DAL.Models;
using Services.Abstractions;
using Services.DTOs.Input;
using Services.DTOs.Output;
using DAL.Extensions;

namespace Services.Implementations
{
	public class LikeService : EntityService<Like>, ILikeService
	{

		public LikeService()
		{
		}

		public BaseResponse<LikeOutputDto> ChangeLikeStatus(LikeInputDto likeInputDto)
		{
			var like = Mapper.Map<Like>(likeInputDto);
			var likeFound = FirstOrDefault(x => x.BookId == like.BookId && x.UserId == like.UserId);
			if (likeFound == null)
			{
				likeFound = Create(like, out var isSaved);
				if (!isSaved)
				{
					throw new InternalServerErrorException($"Không thể like book id: {likeInputDto.BookId}");
				}
			}
			else
			{
				likeFound.EntityStatus = likeFound.IsActivated() ? EntityStatus.Deleted : EntityStatus.Activated;
				var isSaved = Update(likeFound);
				if (!isSaved)
				{
					throw new InternalServerErrorException("Something went wrong, try again later");
				}
			}

			return new SuccessResponse<LikeOutputDto>(Mapper.Map<LikeOutputDto>(likeFound));
		}
	}
}