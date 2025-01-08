
const fetch = require('node-fetch');

async function checkSentenceSimilarity(sentence1, sentence2) {
  const apiKey = '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'
  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // Updated model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `Are the following two sentences semantically similar? \n1. ${sentence1}\n2. ${sentence2}`,
        },
      ],
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim(); // Access response from model
}




export {checkSentenceSimilarity}

