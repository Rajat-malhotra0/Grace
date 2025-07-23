const express = require('express');
const router = express.Router();
const chatBotService = require('../services/chatBotService');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await chatBotService.getChatbotResponse(message);
    console.log('Service result:', result);
    
    const responseData = { 
      response: result.answer, 
      sources: result.sources, 
      relevantDocs: result.foundDocs,
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: error.message });
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