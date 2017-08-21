require('dotenv').config();

const   express = require('express'),
        {MongoClient} = require('mongodb'),
        port = process.env.PORT || 5000,
        app = express(),
        imageSearch = require('node-google-image-search'),
        url = 'mongodb://username:password@ds153413.mlab.com:53413/photosearch',
        collectionName = 'searchTerms';


app.get('/api/imagesearch/:searchTerm', (req, res)=>{
    var searchTerm = req.params.searchTerm;
    var offset = req.query.offset;
    //add searchTerm do mongoDB:
    MongoClient.connect(url, (err, db)=>{
        if(err) console.log('Unable to connect to mongoDB', err);
        db.collection(collectionName).insertOne({
            term: searchTerm,
            when: new Date()
        },(err, result)=>{
            if(err) console.log('Unable insert data', err);
            db.close();
        });
    });


    // this code comes with node-google-image-search package, creates responde with image search information:
    var results = imageSearch(searchTerm, callback, 0, offset);
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

// this code will pull and send do front-end data from mongoDB:
app.get('/api/latest/imagesearch/', (req, res)=>{
    // connect and pull data form mongo DB, look for "10 newest"!!!
    MongoClient.connect(url, (err, db)=>{
        if(err) console.log('Unable to connect api/latest/imagesearch', err);
        db.collection(collectionName).find().toArray((err, doc)=>{
            var outputArr = doc.slice(-10).reverse();
            var outputArrFiltered = new Array();

            for(var i = 0; i < outputArr.length; i++){
                outputArrFiltered.push({
                    term: outputArr[i].term,
                    when: outputArr[i].when
                  }); // end of push
            }; //end of loop

            res.send(outputArrFiltered);
            db.close();

        });//end of db collection operations
    }); // end of mongo connection
}); // end of get latest 

app.listen(port, ()=>console.log('app listening on port: ', port));

