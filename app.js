//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);


/////////////////////////Requests Targetting all the Articles///////////////////////////

//express gives special method combination trick to help reduce typos
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    } else{
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the articles.")
    }else{
      res.send(err);
    }
  });
});

// // client tries to get request means wants something to be seen on the screen
// app.get("/articles", );
//
// // client want to send data to our Server
// app.post("/articles", );
//
// // client is sending http delete request
// app.delete("/articles", );
//

/////////////////////////Requests Targetting a specific Articles///////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle ){
      res.send(foundArticle);
    }else{
      res.semd("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {
      title: req.body.title,
      content: req.body.content
    },
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }
  )
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article!");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the correspoinding article");
      }else{
        res.send(err);
      }
    }
  );
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
