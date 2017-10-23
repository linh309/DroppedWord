using DroppedWord.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Mvc;

namespace DroppedWord.Controllers
{
    public class DropController : Controller
    {
        public string FilePath = @"~/Store/score.json";

        // GET: Drop
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SaveScore(Score score)
        {
            //Read JSON file
            var fileContents = System.IO.File.ReadAllText(Server.MapPath(FilePath));
            var currentList = GetListScore(fileContents);

            var userScore = currentList.FirstOrDefault(s => s.User.ToLower() == score.User.ToLower());
            if (userScore != null)
            {
                userScore.UserScore = score.UserScore;
            }
            else
            {
                currentList.Add(score);
            }

            //re-order current list
            currentList = currentList.OrderBy(s => s.UserScore).ToList();
            var writeContent = SerializeJson(currentList);
            System.IO.File.WriteAllText(Server.MapPath(FilePath), writeContent);
                                                
            return Json(new
            {
                msg = "OK",
                list = writeContent
            });
        }

        private string SerializeJson(List<Score> list)
        {
            var content = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(list);
            return content;
        }

        private List<Score> GetListScore(string json)
        {
            var listScore = new List<Score>();
            try
            {
                listScore = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<List<Score>>(json);
            }
            catch (Exception ex)
            {

            }            

            return listScore == null ? new List<Score>() : listScore;
        }
    }
}