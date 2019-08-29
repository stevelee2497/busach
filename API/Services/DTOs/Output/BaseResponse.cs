using System.Net;

namespace Services.DTOs.Output
{
	public class BaseResponse<T> 
	{
		public HttpStatusCode StatusCode { get; set; }

		public string ErrorMessage { get; set; }

		public T Data { get; set; }

		public int Total { get; set; }

		public BaseResponse(HttpStatusCode statusCode, string errorMessage = null, T data = default)
		{
			StatusCode = statusCode;
			ErrorMessage = errorMessage;
			Data = data;
		}
	}
}