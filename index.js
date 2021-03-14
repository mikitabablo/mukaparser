const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const config = require("./config.json");

// Connect to MongoDB
mongoose
  .connect(
    // `mongodb://${config.database.root_username}:${config.database.root_password}@${config.database.host}:${config.database.port}/${config.database.name}`,
    // `mongodb://${config.database.host}:${config.database.port}/${config.database.name}`,
    `mongodb://${config.database.host}/${config.database.name}`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Article = require("./models/Article");

const urlBase = "https://www.sb.by";
const newsPageBase = urlBase + "/author/894796-andrey-mukovozchik/?PAGEN_1=";

for (var i = 1; i <= 56; i++) {
  axios
    .get(newsPageBase + i)
    .then((response) => processPageLinks(response.data))
    .catch((error) => console.log(console.error));
}

let processPageLinks = (html) => {
  // let data = [];
  const $ = cheerio.load(html);
  $(".news-list a.news-link").each((i, elem) => {
    // data.push(elem.href);
    getArticlePage(elem.attribs.href);
  });
};

let getArticlePage = (articleUrl) => {
  axios
    .get(urlBase + articleUrl)
    .then((response) => processArticle(response.data))
    .catch((error) => console.log(error));
};

let processArticle = (html) => {
  let data = [];
  const $ = cheerio.load(html);

  // let article = $("article .news-block");
  let articleDate = $("article div.like-rating div.disp-inline-block time.time")
    .eq(0)
    .text()
    .trim();

  let articleTitle = $("h1.title").eq(0).text().trim();
  let articleSubTitle = $("h2.article-subtitle").eq(0).text().trim();
  let articleText = $(".cont.ent").eq(0).text().trim().replaceAll("\n", "");

  if (articleTitle && articleText) {
    console.log(articleTitle);
    const article = new Article({
      _id: mongoose.Types.ObjectId(),
      title: articleTitle,
      subtitle: articleSubTitle,
      text: articleText,
      date: articleDate,
    });

    article
      .save()
      .then((result) => {
        console.log(`"${result.title}" succusfully saved!`);
      })
      .catch((err) => console.error(err));
  } else {
    console.error("Wrong data");
  }
};
