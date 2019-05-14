using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Recipe.Mvc.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipe.Mvc.Controllers
{
    public class HomeController : Controller
    {
        private readonly RecipeService _recipeService;

        public HomeController(RecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        public IActionResult Index() => View();

        //[Produces("application/json")]
        public IActionResult Search() => View();
            //var resultObj = await _recipeService.GetRecipesByName(query);
            //JsonResult json = Json(resultObj);

    }

}
