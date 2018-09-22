# Dependencies
import requests
from flask import Flask, render_template, redirect
from config import api_key
import time

app = Flask(__name__)

url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?"

# Store a search term

@app.route("/")
def index():
    return render_template("index.html", {})

@app.route("/articles")
def articles(country_name, issue):
  country_name = "Somalia"
  issue = "drought"

  query = country_name + "%20" + issue

  # We also want to be able to do this dyanmically... but not yet
  begin_date = "20170922"
  end_date = "20180922"

  query_url ="https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=8dc500a25dad40edb659702411b52ca5&q={query}&begin_date=20160101&end_date=20160130"

  # Retrieve articles
  articles = requests.get(query_url).json()
  articles_list = [article for article in articles["response"]["docs"]]

  for article in articles_list:
     print f'A snippet from the article: {article["snippet"]}'

  articles_dict = {}
  # for x in in range(0,4):
     articles_dict.push({"article[x] title": articles_list[x]["title"], "article[x] snippet": articles_list[x]["snippet"], "article[x] link": articles_list[x]["link"])
  return jsonify(articles_dict)
  return redirect("/", code=302)
# Create a dictionary that picks the top five articles, and saves article title - article snippet - article link
# then returns that somewhere else


if __name__ == "__main__":
app.run(debug=True)
