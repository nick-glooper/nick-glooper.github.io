/**
 * News Article Processing Server
 * 
 * This script creates a simple web server that handles article uploads
 * from the news-uploader.html interface and processes them using the
 * news-upload.js script.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processArticle } = require('./news-upload');

// Create Express app
const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'News_Articles/');
    },
    filename: function(req, file, cb) {
        // Keep the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        // Accept only .txt files
        if (path.extname(file.originalname) !== '.txt') {
            return cb(new Error('Only .txt files are allowed'));
        }
        cb(null, true);
    }
});

// Serve static files
app.use(express.static('.'));

// API endpoint for article list
app.get('/api/articles', (req, res) => {
    fs.readdir('News_Articles', (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to read articles directory' });
        }
        
        // Filter for .txt files only
        const articles = files.filter(file => path.extname(file) === '.txt')
            .map(file => {
                const stats = fs.statSync(path.join('News_Articles', file));
                return {
                    name: file,
                    date: stats.mtime.toLocaleDateString()
                };
            });
        
        res.json({ articles });
    });
});

// API endpoint for article upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const filePath = path.join('News_Articles', req.file.filename);
        console.log(`Processing article: ${filePath}`);
        
        // Process the article
        const result = await processArticle(filePath);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'Article processed successfully',
                article: {
                    title: result.article.title,
                    slug: result.article.slug,
                    date: result.article.date
                }
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Error processing article:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to process article' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`News Article Server running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/news-uploader.html to upload articles`);
}); 