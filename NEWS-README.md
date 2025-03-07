# Husian News Article Automation System

This system allows you to automatically update the Husian website with new news articles by providing a properly formatted text document.

## Requirements

- Node.js (v14 or higher)
- Access to the website file system

## Installation

1. Make sure the following files are in your website root directory:
   - `news-upload.js` - Core article processing script
   - `news-cli.js` - Command line interface
   - `news-server.js` - Web server for the uploader interface
   - `news-uploader.html` - Web interface for uploading articles
   - `process-article.bat` - Windows batch file for right-click processing
   - `css/article-styles.css` - Styling for article pages

2. Ensure the CSS import is added to your main CSS file:
   - In `css/style.css`, make sure this line is present at the end: `@import 'article-styles.css';`

3. Install the required dependencies:
   ```
   npm install
   ```

4. Create a `news` directory in your website root if it doesn't already exist:
   ```
   mkdir news
   ```

5. Create a `News_Articles` directory to store your article files:
   ```
   mkdir News_Articles
   ```

## How to Add a New Article

There are three ways to add a new article:

### Method 1: Command Line Interface

1. Create a text file for your article following the required format (see below).
2. Run the news article automation script:
   ```
   node news-cli.js your-article-file.txt
   ```

### Method 2: Web Interface

1. Start the web server:
   ```
   npm run server
   ```

2. Open the web interface in your browser:
   ```
   http://localhost:3000/news-uploader.html
   ```

3. Drag and drop your article file onto the uploader or click to select a file.
4. Click "Process Article" to upload and process the file.

### Method 3: Right-click Processing (Windows)

1. Create a text file for your article following the required format.
2. Save the file in the `News_Articles` folder (or any location).
3. Right-click on the file and select "Open with" then choose `process-article.bat`.
4. Alternatively, you can drag and drop the file onto `process-article.bat`.

#### Setting Up Right-Click Menu Integration (Optional)

To add a "Process as Husian News Article" option to the right-click menu for all .txt files:

1. Run the `setup-right-click.bat` script as administrator (right-click and select "Run as administrator").
2. After running the script, you can right-click on any .txt file and select "Process as Husian News Article" to process it.

Note: This requires administrator privileges as it modifies the Windows registry.

## Article Format Requirements

Your article document must follow this specific format:

```
Title: Your Article Title (max 280 characters)

Summary: A brief summary of your article (max 100 words)

Article: The full content of your article (500-2000 words)
```

Important formatting rules:

1. The document must contain these three sections exactly as shown, with each section name followed by a colon.
2. Leave a blank line between sections.
3. The title must be 280 characters or less.
4. The summary must be 100 words or less.
5. The article must be between 500 and 2000 words.

## Article Content Formatting

Within the article content, you can use basic formatting:

- **Paragraphs**: Separate paragraphs with blank lines
- **Headings**: Use `##` for section headings and `###` for subsection headings
- **Lists**: Use `1.`, `2.`, etc. for numbered lists or `-` for bullet points
- **Emphasis**: Use `*asterisks*` or `_underscores_` for emphasis
- **Blockquotes**: Use `>` at the beginning of a line for blockquotes

Example:

```
## Section Heading

This is a paragraph.

This is another paragraph with *emphasized text*.

- List item 1
- List item 2

> This is a blockquote
```

## Example Articles

An example article document is provided in `article-template.txt`.

A more complete sample article is available in `sample-article.txt`.

## File Organization

- `News_Articles/` - Store your article text files here
- `news/` - The system will create HTML pages for each article here
- `css/article-styles.css` - Styling for article pages

## Troubleshooting

If you encounter errors:

1. Check that your article follows the required format exactly
2. Verify that the title, summary, and article content meet the length requirements
3. Make sure you have Node.js installed and all dependencies are installed
4. Check that the required files are in the correct locations
5. When using the web interface, make sure the server is running

## Support

For assistance with the news article automation system, contact the website administrator. 