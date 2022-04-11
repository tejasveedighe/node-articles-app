const express = require("express");
const mongoose = require("mongoose");
const articleModel = require("./models/articleModel");
const app = express();
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// used to override the method of the form
app.use(methodOverride("_method"));

// tells express to access the data in the request as object check in articles.js
app.use(express.urlencoded({ extended: false }));

// sets the html to view engine written in ejs
app.set("view engine", "ejs");

// simple route
app.get("/", async (req, res) => {
    const articles = await articleModel.find({}).sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);
app.listen(3001, () => console.log("Server running on port 3001"));
