require('dotenv').config();

const   express = require('express'),
        {MongoClient} = require('mongodb'),
        port = 5000,
        app = express(),
        imageSearch = require('node-google-image-search');


app.get('/api/imagesearch/:searchTerm', (req, res)=>{
    var searchTerm = req.params.searchTerm;
    var results = imageSearch(searchTerm, callback, 0, 5);
    function callback(results){

        var filteredResults = new Array();

        for(i = 0; i<results.length; i++){
            filteredResults.push({  
                url: results[i].link,
                snippet: results[i].snippet,
                thumbnail: results[i].image.thumbnailLink,
                context: results[i].image.contextLink
             });
        }
        res.send(filteredResults);
    }
});

app.get('/api/latest/imagesearch/', (req, res)=>{
    res.send('data from mongoDB with recend search info');
})

app.listen(port, ()=>console.log('app listening on port: ', port));

