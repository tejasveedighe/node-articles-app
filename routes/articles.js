const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router(); // router to create routes
const articleModel = require("../models/articleModel");

// this is used to create routes in the app for a particular part of router like here /articles/

// this is the route for adding a new article
router.get("/new", (req, res) => {
	res.render("articles/new", { article: new articleModel() });
});

router.get("/:slug", async (req, res) => {
	const article = await articleModel.findOne({ slug: req.params.slug });
	if (article) {
		res.render("articles/show", { article: article });
	} else {
		res.redirect("/");
	}
});

router.post("/", async (req, res) => {
	// since the schema demands markdown and description if they are not provided it cannot be saved as null as null is a way of telling the interpreter that it has no value so providing a default value avoids the authenticatoin error
	let article = new articleModel({
		title: req.body.title,
		description: req.body.description,
		markdown: req.body.markdown,
	});
	try {
		await article.save();
		res.redirect(`/articles/${article.slug}`);
	} catch (error) {
		console.log(error);
		// if for any reason article was not saved re render the entered text in the form
		res.render("articles/new", { article: article });
	}
});

router.put("/:id", async (req, res) => {
	let article = await articleModel.findById(req.params.id);
	if (article) {
		article.title = req.body.title;
		article.description = req.body.description;
		article.markdown = req.body.markdown;
		try {
			await article.save();
			res.redirect(`/articles/${article.slug}`);
		} catch (error) {
			console.log(error);
			res.render("articles/new", { article: article });
		}
	} else {
		res.redirect("/");
	}
});

router.delete("/:id", async (req, res) => {
	await articleModel.findByIdAndDelete(req.params.id);
	res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
	const article = await articleModel.findById(req.params.id);
	if (article) {
		res.render("articles/edit", { article: article });
	} else {
		res.redirect("/");
	}
});

module.exports = router;
