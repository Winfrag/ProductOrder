using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ProductOrder.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {

        const string _apiKey = "136085";
        const string _encodedCredentials = "bWluaXByb2plY3Q6UHIhbnQxMjM=";



        // GET api/values
        // Gets the text from the PFL API and returns it as a string
        [HttpGet]
        public async Task<ActionResult<string>> GetAsync()

        {

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://testapi.pfl.com/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "bWluaXByb2plY3Q6UHIhbnQxMjM=");
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


            string uri = String.Format("products?apikey={0}", _apiKey);
            HttpResponseMessage response = client.GetAsync(uri).Result;

            string result = await response.Content.ReadAsStringAsync();

            Debug.WriteLine("Here is is the recieved JSON");
            Debug.WriteLine(result);

            return result;

        }

        // POST api/values
        // We're going to get a payload from the javascript code, and will send it in to the main API from here
        [HttpPost]
        public async Task<ActionResult<string>> Post(object payload)
        {
            string serializedPayload = JsonConvert.SerializeObject(payload);

            HttpContent sendPayload = new StringContent(serializedPayload, Encoding.UTF8, "application/json");

            Debug.WriteLine("Here is the recieved payload");
            Debug.WriteLine(payload.ToString());



            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://testapi.pfl.com/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "bWluaXByb2plY3Q6UHIhbnQxMjM=");
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            string uri = String.Format("orders?apikey={0}", _apiKey);

            HttpResponseMessage response = client.PostAsync(uri, sendPayload).Result;


            string result = await response.Content.ReadAsStringAsync();

            //Debug.WriteLine("Here is the response");
            //Debug.WriteLine(result);
            return result;
        }
    }
}
