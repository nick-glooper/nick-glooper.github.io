#!/usr/bin/env node

/**
 * Command-line interface for husian news article upload automation
 */

const { processArticle } = require('./news-upload');
const fs = require('fs');
const path = require('path');

// Parse command-line arguments
const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath) {
    console.error('Error: No file specified');
    printUsage();
    process.exit(1);
}

// Check if file exists
if (!fs.existsSync(filePath)) {
    console.error(`Error: File '${filePath}' does not exist`);
    process.exit(1);
}

// Process the article
console.log(`Processing news article from file: ${filePath}`);

processArticle(filePath)
    .then(result => {
        if (result.success) {
            console.log('\nArticle processed successfully!');
            console.log('-----------------------------------');
            console.log(`Title: ${result.article.title}`);
            console.log(`Date: ${result.article.date}`);
            console.log(`Slug: ${result.article.slug}`);
            console.log(`Article page: news/${result.article.slug}.html`);
            console.log('\nThe following pages have been updated:');
            console.log('- index.html (Home page)');
            console.log('- news.html (News listing page)');
            console.log(`- news/${result.article.slug}.html (New article page)`);
        } else {
            console.error(`\nError: ${result.error}`);
            process.exit(1);
        }
    })
    .catch(error => {
        console.error(`\nUnexpected error: ${error.message}`);
        process.exit(1);
    });

function printUsage() {
    console.log('\nUsage:');
    console.log('  node news-cli.js <file-path>');
    console.log('\nExample:');
    console.log('  node news-cli.js article.txt');
    console.log('\nFile format should be:');
    console.log('Title: Your article title here (max 280 characters)');
    console.log('Summary: Brief summary of the article (max 100 words)');
    console.log('Article: The full content of your article (500-2000 words)');
} 