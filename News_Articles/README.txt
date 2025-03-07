HUSIAN NEWS ARTICLE FORMATTING GUIDE
=====================================

This folder contains your news article text files that can be processed by the Husian website automation system.

ARTICLE FORMAT
-------------

Each article must follow this specific structure:

1. Title Section
   - Start with "Title:" followed by your article title
   - Maximum 280 characters
   - Example: "Title: Husian Launches New AI Solution for Public Sector Procurement"

2. Summary Section
   - Start with "Summary:" followed by a brief summary of your article
   - Maximum 100 words
   - This will appear on the home page and in news listings
   - Example: "Summary: We're excited to announce our latest AI-driven solution..."

3. Article Section
   - Start with "Article:" followed by the full content of your article
   - Must be between 500 and 2000 words
   - Contains the full text that will appear on the article's dedicated page

IMPORTANT FORMATTING RULES
-------------------------

- Always include all three sections: Title, Summary, and Article
- Leave a blank line between sections
- Keep titles under 280 characters
- Keep summaries under 100 words
- Articles should be between 500-2000 words

MARKDOWN FORMATTING
------------------

You can use these formatting options in your article content:

HEADINGS:
## Major Section Heading
### Subsection Heading

LISTS:
1. First item
2. Second item
3. Third item

- Bullet point one
- Bullet point two
- Bullet point three

EMPHASIS:
*Italicized text* or _also italicized text_
**Bold text**

BLOCKQUOTES:
> This is a blockquote. It will be formatted specially in the final article.

PARAGRAPHS:
Separate paragraphs with a blank line between them.

PROCESSING YOUR ARTICLE
---------------------

There are three ways to process your article:

1. DRAG AND DROP:
   Simply drag your .txt file onto process-article.bat

2. RIGHT-CLICK MENU (if set up):
   Right-click on the .txt file and select "Process as Husian News Article"

3. WEB INTERFACE:
   - Start the web server: npm run server
   - Open http://localhost:3000/news-uploader.html
   - Upload and process your article through the web interface

4. COMMAND LINE:
   Run: node news-cli.js path/to/your-article.txt

EXAMPLES
-------

See the included example files:
- article-template.txt - A basic template showing the required structure
- sample-article.txt - A complete example article

For more information, see the NEWS-README.md file in the main directory. 