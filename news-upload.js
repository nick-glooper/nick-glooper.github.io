/**
 * News Article Automation Script
 * 
 * This script processes a news article document and updates the website
 * with the new content across multiple pages.
 */

// Configuration
const config = {
    dateFormat: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    },
    maxTitleLength: 280,
    maxSummaryWords: 100
};

/**
 * Process the article document and extract its components
 * @param {string} documentContent - The raw document content
 * @returns {Object} The processed article data
 */
function processArticleDocument(documentContent) {
    // Extract title, summary, and article content using regex patterns
    const titleMatch = documentContent.match(/Title\s*:\s*([\s\S]*?)(?=Summary|$)/i);
    const summaryMatch = documentContent.match(/Summary\s*:\s*([\s\S]*?)(?=Article|$)/i);
    const articleMatch = documentContent.match(/Article\s*:\s*([\s\S]*?)(?=$)/i);
    
    if (!titleMatch || !summaryMatch || !articleMatch) {
        throw new Error('Document format is invalid. Must contain Title, Summary, and Article sections.');
    }
    
    const title = titleMatch[1].trim();
    const summary = summaryMatch[1].trim();
    const article = articleMatch[1].trim();
    
    // Validate content
    if (title.length > config.maxTitleLength) {
        throw new Error(`Title exceeds maximum length of ${config.maxTitleLength} characters.`);
    }
    
    const wordCount = summary.split(/\s+/).length;
    if (wordCount > config.maxSummaryWords) {
        throw new Error(`Summary exceeds maximum length of ${config.maxSummaryWords} words.`);
    }
    
    const articleWordCount = article.split(/\s+/).length;
    if (articleWordCount < 500 || articleWordCount > 2000) {
        throw new Error('Article must be between 500 and 2000 words in length.');
    }
    
    // Generate a URL-friendly slug from the title
    const slug = generateSlug(title);
    
    // Get current date formatted properly
    const date = new Date();
    const formattedDate = formatDate(date);
    
    // Process markdown in article
    const processedArticle = processMarkdown(article);
    
    return {
        title,
        summary,
        article: processedArticle,
        rawArticle: article,
        slug,
        date: formattedDate,
        rawDate: date
    };
}

/**
 * Process markdown syntax in the article text
 * @param {string} text - The article text with markdown
 * @returns {string} HTML-formatted article text
 */
function processMarkdown(text) {
    let html = text;
    
    // Process paragraphs (must be done first)
    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs.map(para => {
        // Skip if it's already a heading, list, or blockquote
        if (/^#{1,6}\s|^[*\-+]\s|^>\s|^\d+\.\s/.test(para.trim())) {
            return para;
        }
        return `<p>${para.trim()}</p>`;
    }).join('\n\n');
    
    // Process headings
    html = html.replace(/## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/#### (.*?)$/gm, '<h4>$1</h4>');
    
    // Process emphasis
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Process ordered lists
    let listMatch = html.match(/(<p>)?(\d+\.\s.*?(\n|$))+(<\/p>)?/g);
    if (listMatch) {
        listMatch.forEach(list => {
            const items = list.replace(/<\/?p>/g, '').trim().split(/\n/).map(item => {
                return `<li>${item.replace(/^\d+\.\s/, '')}</li>`;
            }).join('\n');
            
            html = html.replace(list, `<ol>\n${items}\n</ol>`);
        });
    }
    
    // Process unordered lists
    listMatch = html.match(/(<p>)?([-*+]\s.*?(\n|$))+(<\/p>)?/g);
    if (listMatch) {
        listMatch.forEach(list => {
            const items = list.replace(/<\/?p>/g, '').trim().split(/\n/).map(item => {
                return `<li>${item.replace(/^[-*+]\s/, '')}</li>`;
            }).join('\n');
            
            html = html.replace(list, `<ul>\n${items}\n</ul>`);
        });
    }
    
    // Process blockquotes
    const blockQuoteRegex = /(<p>)?(>\s.*?(\n|$))+(<\/p>)?/g;
    const blockQuotes = html.match(blockQuoteRegex);
    if (blockQuotes) {
        blockQuotes.forEach(quote => {
            const content = quote.replace(/<\/?p>/g, '')
                               .replace(/^>\s/gm, '')
                               .trim();
            
            html = html.replace(quote, `<blockquote><p>${content}</p></blockquote>`);
        });
    }
    
    return html;
}

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} The URL-friendly slug
 */
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .substring(0, 50);        // Limit length
}

/**
 * Format a date in the site's standard format (e.g., "26th February 2025")
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const suffix = getDaySuffix(day);
    
    return `${day}${suffix} ${month} ${year}`;
}

/**
 * Get the ordinal suffix for a day number (e.g., "st", "nd", "rd", "th")
 * @param {number} day - The day of the month
 * @returns {string} The ordinal suffix
 */
function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th';
    
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/**
 * Update the home page with the new article
 * @param {Object} article - The processed article data
 * @returns {Promise<void>}
 */
async function updateHomePage(article) {
    try {
        // Read the index.html file
        const fs = require('fs').promises;
        let indexContent = await fs.readFile('index.html', 'utf8');
        
        // Find the news section and update it
        const newsSection = /<section class="news">[\s\S]*?<\/section>/;
        const updatedNewsSection = `<section class="news">
            <div class="container">
                <h2>News</h2>
                <div class="news-item">
                    <h3>${article.title}</h3>
                    <p class="news-content">${article.summary}</p>
                    <span class="news-date">${article.date}</span>
                    <a href="news.html#${article.slug}" class="btn">See the Full Article</a>
                </div>
                <a href="news.html" class="news-archive-link">See all our News →</a>
            </div>
        </section>`;
        
        // Replace the news section
        const updatedContent = indexContent.replace(newsSection, updatedNewsSection);
        
        // Write the updated content back to the file
        await fs.writeFile('index.html', updatedContent, 'utf8');
        console.log('Home page updated successfully');
    } catch (error) {
        console.error('Error updating home page:', error);
        throw error;
    }
}

/**
 * Update the news page with the new article
 * @param {Object} article - The processed article data
 * @returns {Promise<void>}
 */
async function updateNewsPage(article) {
    try {
        // Read the news.html file
        const fs = require('fs').promises;
        let newsContent = await fs.readFile('news.html', 'utf8');
        
        // Find the location to insert the new article (after the year divider)
        const currentYear = new Date().getFullYear();
        const yearDivider = new RegExp(`<div class="year-divider">\\s*<h2>${currentYear}</h2>\\s*</div>`);
        
        // Check if the current year divider exists
        if (!yearDivider.test(newsContent)) {
            // If not, find the news-grid section and add the year divider
            const newsGridStart = newsContent.indexOf('<div class="container">') + '<div class="container">'.length;
            const yearDividerHtml = `
                <div class="year-divider">
                    <h2>${currentYear}</h2>
                </div>
            `;
            newsContent = newsContent.slice(0, newsGridStart) + yearDividerHtml + newsContent.slice(newsGridStart);
        }
        
        // Create the new article HTML
        const newArticleHtml = `
                <div class="news-item" id="${article.slug}">
                    <h3>${article.title}</h3>
                    <p class="news-content">${article.summary}</p>
                    <span class="news-date">${article.date}</span>
                    <a href="news/${article.slug}.html" class="btn">See the Full Article</a>
                </div>
        `;
        
        // Insert the new article after the current year divider
        const match = newsContent.match(yearDivider);
        if (match) {
            const insertPosition = match.index + match[0].length;
            newsContent = newsContent.slice(0, insertPosition) + newArticleHtml + newsContent.slice(insertPosition);
        } else {
            throw new Error('Could not find insertion point in news.html');
        }
        
        // Write the updated content back to the file
        await fs.writeFile('news.html', newsContent, 'utf8');
        console.log('News page updated successfully');
    } catch (error) {
        console.error('Error updating news page:', error);
        throw error;
    }
}

/**
 * Create a new HTML page for the full article
 * @param {Object} article - The processed article data
 * @returns {Promise<void>}
 */
async function createArticlePage(article) {
    try {
        // Ensure the news directory exists
        const fs = require('fs').promises;
        const path = require('path');
        
        try {
            await fs.mkdir('news');
        } catch (err) {
            // Directory already exists or another error
            if (err.code !== 'EEXIST') throw err;
        }
        
        // Create the new article HTML page
        const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | husian</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.summary}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://husian.com/news/${article.slug}.html">
</head>
<body>
    <header>
        <div class="container header-container">
            <a href="../index.html" class="logo">
                <img src="../images/logo.svg" alt="husian logo" class="logo-image" width="170" height="38">
            </a>
            <button class="mobile-menu-toggle" aria-expanded="false" aria-label="Toggle navigation menu">☰</button>
            <nav>
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../services.html">Services</a></li>
                    <li><a href="../resources.html">Resources</a></li>
                    <li><a href="../news.html" class="active">News</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="article-header">
            <div class="container">
                <span class="news-date">${article.date}</span>
                <h1>${article.title}</h1>
                <p class="lead">${article.summary}</p>
            </div>
        </section>

        <section class="article-content">
            <div class="container">
                <article>
                    ${article.article}
                </article>

                <div class="article-nav">
                    <a href="../news.html" class="btn secondary">&larr; Back to News</a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-tagline">
                <span class="tagline-brand">husian</span> — Specialized in AI-enabled procurement and commercial management for public sector organizations.
            </div>
            <div class="footer-content">
                <div class="footer-col">
                    <h4 class="footer-heading">Services</h4>
                    <ul class="footer-links">
                        <li><a href="../services.html#supply-chain">Supply Chain Risk Assessment</a></li>
                        <li><a href="../services.html#ai-procurement">AI in Procurement</a></li>
                        <li><a href="../services.html#process-optimization">Commercial Process Optimization</a></li>
                        <li><a href="../services.html#dynamic-markets">Dynamic Markets Strategy</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">Resources</h4>
                    <ul class="footer-links">
                        <li><a href="../resources.html#articles">Articles</a></li>
                        <li><a href="../resources.html#guides">Guides</a></li>
                        <li><a href="../resources.html#procurement-act">Procurement Act</a></li>
                        <li><a href="../resources.html#webinars">Webinars</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">News</h4>
                    <ul class="footer-links">
                        <li><a href="../news.html#latest">Latest Updates</a></li>
                        <li><a href="../news.html#press">Press Releases</a></li>
                        <li><a href="../news.html#insights">Industry Insights</a></li>
                        <li><a href="../news.html#events">Events</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">About</h4>
                    <ul class="footer-links">
                        <li><a href="../about.html#company">Our Company</a></li>
                        <li><a href="../about.html#team">Our Team</a></li>
                        <li><a href="../about.html#values">Our Values</a></li>
                        <li><a href="../about.html#careers">Careers</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">Contact</h4>
                    <ul class="footer-links">
                        <li><a href="../contact.html">Contact Form</a></li>
                        <li><a href="mailto:info@husian.com">info@husian.com</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 husian. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
            document.querySelector('nav').classList.toggle('active');
        });
    </script>
</body>
</html>`;
        
        // Write the new article page
        await fs.writeFile(`news/${article.slug}.html`, articleHtml, 'utf8');
        console.log(`Article page created: news/${article.slug}.html`);
    } catch (error) {
        console.error('Error creating article page:', error);
        throw error;
    }
}

/**
 * Main function to process an article file and update the website
 * @param {string} filePath - Path to the article document file
 * @returns {Promise<void>}
 */
async function processArticle(filePath) {
    try {
        const fs = require('fs').promises;
        
        // Read the article file
        const documentContent = await fs.readFile(filePath, 'utf8');
        
        // Process the document
        const article = processArticleDocument(documentContent);
        
        // Update the home page
        await updateHomePage(article);
        
        // Update the news page
        await updateNewsPage(article);
        
        // Create the full article page
        await createArticlePage(article);
        
        console.log('Article processing completed successfully');
        return {
            success: true,
            article
        };
    } catch (error) {
        console.error('Error processing article:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { processArticle, processArticleDocument }; 