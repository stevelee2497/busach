namespace Services.DTOs.Output
{
	public class SuccessResponseWithPagination<T> : SuccessResponse<T>
	{
		public SuccessResponseWithPagination(int total, T data = default) : base(data)
		{
			Total = total;
		}
	}
}