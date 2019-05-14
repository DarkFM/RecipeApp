using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Recipe.Mvc.Services
{
    public class RecipeService
    {
        private HttpClient httpClient;
        public RecipeService()
        {
            httpClient = new HttpClient();
        }

        public async Task<JObject> GetRecipeByIdAsync(int id)
        {
            const string apiKey = "1";
            string endpoint = $"https://www.themealdb.com/api/json/v1/{apiKey}/";

            var url = new Uri(endpoint + $"lookup.php?i={id}");

            var response = await httpClient.GetAsync(url).ConfigureAwait(false);

            if (!response.IsSuccessStatusCode)
            {
                return new JObject();
            }

            string responseStr = await response.Content.ReadAsStringAsync();

            return JObject.FromObject(JObject.Parse(responseStr).GetValue("meals"));
        }

        public async Task<JObject> GetRecipesByName(string name)
        {
            const string apiKey = "1";
            string endpoint = $"https://www.themealdb.com/api/json/v1/{apiKey}/";

            var url = new Uri(endpoint + $"search.php?s=");

            var response = await httpClient.GetAsync(url).ConfigureAwait(false);

            if (!response.IsSuccessStatusCode)
            {
                return new JObject();
            }

            string responseStr = await response.Content.ReadAsStringAsync();

            JArray data = JObject.Parse(responseStr).GetValue("meals") as JArray;

            return data.First as JObject;
        }
    }
}
