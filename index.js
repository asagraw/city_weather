const express = require('express');
const app = express();
const Datastore = require('nedb');
const fetch = require('node-fetch');
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
var co_data = new Datastore('database.db');
co_data.loadDatabase();
app.post('/api', async (request, response) => {
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    co_data.insert(data);
    const api_resp = await get_weather(request, response);
    // console.log(api_resp);
    response.json({
        "fulfillmentText": "This is for Dialog Flow from My App on Heroku",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        `Lattitude is ${api_resp.coord.lat} and longitude is ${api_resp.coord.lon}`
                    ]
                }
            }
        ],
        "source": "",
        "status": 'Success',
        "api_data": api_resp,
        "timestamp": data.timestamp
    });
});

async function get_weather(req, res){
    const city = req.body.city;
    // console.log("Inside Get Weather",city);
    const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=3d6eada4484bdf062436926124c2e162`;
    // console.log(api_url);
    const api_resp = await fetch(api_url);
    const api_json = await api_resp.json();
    return api_json;
};