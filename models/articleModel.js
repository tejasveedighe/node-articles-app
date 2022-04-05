const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	markdown: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	slug: {
		// this is used to make the url of a article to the title instead of using a id
		type: String,
		required: true,
		unique: true,
	},
	sanitizedHtml: {
		type: String,
		required: true,
	},
});

articleSchema.pre("validate", function (next) {
	// so the title is conveted to a slug
	// all the characters are removed from the title
	if (this.title) {
		this.slug = slugify(this.title, {
			lower: true,
		});
	}

	// used to santize the markdown with malicious code
	// if anyone uses malicious code it will be removed
	if (this.markdown) {
		this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
	}

	next();
});

module.exports = mongoose.model("Article", articleSchema);
