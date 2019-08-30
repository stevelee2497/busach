using API.Filters;
using DAL.Constants;
using DAL.Contexts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Repositories.Helpers;
using Services.Extensions;
using Services.Helpers;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace API
{
	public class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IHostingEnvironment env)
		{
			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", true, true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", true)
				.AddEnvironmentVariables();
			Configuration = builder.Build();

			AutoMapperConfig.RegisterModel();
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton((IConfigurationRoot) Configuration);
			services.AddSingleton(Configuration);
			services.AddCors();
			services.AddMvc(MvcOptions).AddJsonOptions(JsonOptions).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
			services.AddWebDataLayer();
			services.AddDbContext<DatabaseContext>(DbContextOptions);
			services.AddSwaggerGen(SwaggerConfigs);
			services.AddAuthentication(JwtHelper.ConfigureAuthenticationOptions).AddJwtBearer(Jwt.DefaultScheme, JwtHelper.ConfigureJwtBearerOptions);
			JsonConvert.DefaultSettings = JsonConvertDefaultSettings;
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			ServiceProviderHelper.Init(app.ApplicationServices);
			app.UseStaticFiles();
			app.UseCookiePolicy();
			app.UseAuthentication();
			app.UseSwagger();
			app.UseSwaggerUI(SwaggerUIConfig);
			app.UseCors(ConfigureCors);
			app.UseMvc();
			DbInitializer.DbInitializer.Seed(app.ApplicationServices);
		}

		private JsonSerializerSettings JsonConvertDefaultSettings() => new JsonSerializerSettings
		{
			Formatting = Formatting.Indented,
			DefaultValueHandling = DefaultValueHandling.Ignore,
			ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
			ContractResolver = new CamelCasePropertyNamesContractResolver()
		};

		private void ConfigureCors(CorsPolicyBuilder builder)
		{
			builder
				.AllowAnyOrigin()
				.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials();
		}

		private void MvcOptions(MvcOptions options)
		{
			options.Filters.Add<JsonExceptionFilter>();
			options.Filters.Add(typeof(ValidatorActionFilter));
		}

		private void JsonOptions(MvcJsonOptions options)
		{
			options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
			options.SerializerSettings.DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate;
		}

		private void DbContextOptions(DbContextOptionsBuilder options)
		{
			options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
		}

		private void SwaggerConfigs(SwaggerGenOptions c)
		{
			c.SwaggerDoc("v1", new Info {Title = "Server API", Version = "v1"});
		}

		private void SwaggerUIConfig(SwaggerUIOptions c)
		{
			c.SwaggerEndpoint("/swagger/v1/swagger.json", "Chat Server Api v1");
			c.RoutePrefix = string.Empty;
		}
	}
}