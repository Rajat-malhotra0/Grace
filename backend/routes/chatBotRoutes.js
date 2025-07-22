const express = require('express');
const router = express.Router();
const chatBotService = require('../services/chatBotService');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Valid message is required' });
    }
    
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long. Please keep it under 500 characters.' });
    }

    const result = await chatBotService.getChatbotResponse(message.trim());
    
    const responseData = { 
      response: result.answer, 
      sources: result.sources || ['AI Assistant'], 
      relevantDocs: result.foundDocs,
      timestamp: new Date().toISOString()
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/init', async (req, res) => {
  try {
    await chatBotService.setupKnowledgeBase();
    res.json({ 
      success: true, 
      message: 'Knowledge base initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add-document', async (req, res) => {
  try {
    const { content, metadata } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    await chatBotService.addArticles([{ content, metadata: metadata || {} }]);
    res.json({ 
      success: true, 
      message: 'Document added successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/health', async (req, res) => {
  try {
    res.json({ 
      status: 'healthy',
      service: 'chatbot',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;