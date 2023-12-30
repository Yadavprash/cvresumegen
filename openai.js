const axios = require('axios');
const fs = require('fs');
const apiUrl = 'https://api.pawan.krd/v1/chat/completions';
const apiKey = 'pk-TqmezKfIPPQAtCxAZbRltkUOXAdAgvoFTRgLHdhlTIBOyTPB';

const requestData = {
    model: 'pai-001-light-beta',
    max_tokens: 1000,
    messages: [
       {
            role:'user',
            content: 'When will I get married and tell me what is the distance of new YOrk from lucknow'
       }
    ],
};

axios.post(apiUrl, requestData, {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    },
})
    .then(response => {
        console.log(response.data);
        const texData  = response.data.choices[0].message.content;
        fs.writeFileSync('response.txt', texData);

        console.log('TeX data saved to response.txt');
    })
    .catch(error => {
        console.error('Error:', error.message);
    });

