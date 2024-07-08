using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication1.Controllers
{
    [ApiController]
    public class todoController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public todoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("get_tasks")]
        public JsonResult get_tasks()
        {
            string query = "SELECT * FROM todo";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("mydb");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return new JsonResult(table);
        }
        [HttpPost("add_tasks")]

        public JsonResult add_tasks([FromForm] string task)
        {
            string query = "insert into todo values (@task)";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("mydb");
            
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@task", task);

                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return new JsonResult("Added Succesfuly");
        }
        [HttpPost("delete_tasks")]

        public JsonResult delete_tasks([FromForm] string id)
        {
            string query = "delete from todo where id=@id";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("mydb");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@id", id);

                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return new JsonResult("Deleted Succesfuly");
        }
        // Dans votre contrôleur todoController
        [HttpPost("update_tasks")]
        public JsonResult update_tasks([FromForm] int id, [FromForm] string task)
        {
            string query = "UPDATE todo SET task = @task WHERE id = @id";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("mydb");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    myCommand.Parameters.AddWithValue("@task", task);

                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return new JsonResult("Tâche mise à jour avec succès !");
        }

    }
}
