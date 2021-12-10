//hint esversion:6

const express = require("express");
const app = express();

const ejs = require("ejs");

const _ = require("lodash");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    }
})

const Article = mongoose.model('Article', articleSchema);

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")

app.route("/articles")

   .get((req,res)=>{
       Article.find({}, (err,articles)=>{
           res.send(articles)
        });
    })

   .post((req,res)=>{
       const title = req.body.title;
       const content = req.body.content;
       const newArticle = new Article({
           title: title,
           content: content
        })
        newArticle.save((err)=>{
            if(!err){
                res.send("An article was added successfuly.")
            }else{
                res.send(err);
            }
        });
    })

   .delete((req,res)=>{
       Article.deleteMany({}, (err)=>{
           if(!err){
               res.send('All the articles have been deleted successfully!');
            }else{
                res.send(err);
            }
        })
    })

app.route("/articles/:article")

   .get((req,res) => {
       const article = req.params.article;
       Article.findOne({title:article}, (err,foundArticle) => {
           if(foundArticle){
               res.send(foundArticle)
           }else{
               res.send("No matching articles was found!")
           }
       })
   })

   .put((req,res) => {
       Article.replaceOne(
           {title: req.params.article},
           {title: req.body.title, content: req.body.content},
           (err) => {
               if(!err){
                   res.send("Successfuly updated")
               }else{
                   res.send(err);
               }
           }
       )
   })

   .patch((req,res) => {
       Article.update(
           {title: req.params.article},
           {$set: req.body},
           (err) => {
               if(!err){
                   res.send("Successfuly updated");
               }else{
                   res.send(err);
               }
           }
       )
   })

   .delete((req,res) => {
       Article.deleteOne({title: req.params.article}, (err) => {
           if(!err){
               res.send("Article deleted")
           }else{
               res.send(err);
           }
       })
   })     


app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is running on port 3000");
})