// API endpoint'leri
const drugsUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/drugs";
const radioUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/radiopharmaceutical";
const allergenUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/allergens";

// OpenAI API yapılandırması
const openaiConfig = {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo"
};

// API fonksiyonları
export const fetchDrugs = async (drugsId = 'all') => {
    const response = await axios.get(`${drugsUrl}?drugsId=${drugsId}`);
    return response.data;
};

export const fetchRadiopharmaceuticals = async () => {
    const response = await axios.get(`${radioUrl}?radiopharmaId=all`);
    return response.data;
};

export const fetchAllergens = async () => {
    const response = await axios.get(`${allergenUrl}?allergensId=all`);
    return response.data;
};

// OpenAI API çağrısı
export const askOpenAI = async (prompt) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: openaiConfig.model,
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${openaiConfig.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API hatası:', error);
        throw error;
    }
}; 