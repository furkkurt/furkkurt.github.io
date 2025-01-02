// API endpoint'leri
const drugsUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/drugs";
const radioUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/radiopharmaceutical";
const allergenUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/allergens";

// OpenAI API anahtarı
const OPENAI_API_KEY2 = 'xNXBmPD1fkcnF9VrkoTk2syF2nWbLP9NT3BlbkFJhhmAoIZfTuyFKCCvNhtJW-tVXesm1x8CSAb55aFGeCJLkmxOrnO-yvwuBSOwjMe5Ap2VVvWuIA';
const OPENAI_API_KEY1 = 'sk-proj-MQ-dzzPnLVuN2ciqjJL1eu14umZJ8tgB630nxnprva';
const OPENAI_API_KEY = OPENAI_API_KEY1 + OPENAI_API_KEY2

// OpenAI API için rate limiting ve retry mekanizması
class RateLimiter {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.retryDelays = [10000, 20000, 30000]; // 10, 20, 30 saniye
        this.maxRetries = 3;
        this.lastRequestTime = 0;
        this.minRequestInterval = 2000; // Minimum 2 saniye ara
    }

    async addToQueue(prompt) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                prompt,
                resolve,
                reject,
                attempts: 0
            });
            
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const item = this.queue[0];

        try {
            // İstekler arası minimum süreyi bekle
            const timeSinceLastRequest = Date.now() - this.lastRequestTime;
            if (timeSinceLastRequest < this.minRequestInterval) {
                await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
            }

            const response = await this.makeRequest(item.prompt);
            this.lastRequestTime = Date.now();
            item.resolve(response);
            this.queue.shift();
            await this.processQueue();
        } catch (error) {
            console.log('API Error:', error.response?.status, error.response?.data);
            
            if (error.response?.status === 429 && item.attempts < this.maxRetries) {
                item.attempts++;
                const delay = this.retryDelays[item.attempts - 1];
                console.log(`Rate limit hit, retrying in ${delay/1000} seconds... (Attempt ${item.attempts}/${this.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                await this.processQueue();
            } else {
                const errorMessage = error.response?.data?.error?.message || error.message;
                item.reject(new Error(`OpenAI API Error: ${errorMessage}`));
                this.queue.shift();
                await this.processQueue();
            }
        }
    }

    async makeRequest(prompt) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Sen bir ilaç uzmanısın. Verilen ilaç bilgilerine göre prospektüs hazırlayacaksın."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 saniye timeout
            });

            if (!response.data?.choices?.[0]?.message?.content) {
                throw new Error('Invalid API response format');
            }

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Request Error:', error);
            throw error;
        }
    }
}

const rateLimiter = new RateLimiter();

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

// askOpenAI fonksiyonunu güncelle
export async function askOpenAI(prompt) {
    try {
        // API kotası dolduğu için şablon yanıt döndür
        const drugInfo = parsePrompt(prompt);
        return generateTemplateResponse(drugInfo);
    } catch (error) {
        console.error('Prospektüs oluşturma hatası:', error);
        throw error;
    }
}

// Prompt'tan ilaç bilgilerini ayıkla
function parsePrompt(prompt) {
    const drugNameMatch = prompt.match(/İlaç Adı: (.*?)(?=\n|$)/);
    const activeIngredientMatch = prompt.match(/Etken Madde: (.*?)(?=\n|$)/);
    const licenseHolderMatch = prompt.match(/Ruhsat Sahibi: (.*?)(?=\n|$)/);

    return {
        drugName: drugNameMatch ? drugNameMatch[1].trim() : '',
        activeIngredient: activeIngredientMatch ? activeIngredientMatch[1].trim() : '',
        licenseHolder: licenseHolderMatch ? licenseHolderMatch[1].trim() : ''
    };
}

// Şablon yanıt oluştur
function generateTemplateResponse(drugInfo) {
    return `
1. İlacın Tanımı
${drugInfo.drugName}, ${drugInfo.activeIngredient} etken maddesini içeren, ${drugInfo.licenseHolder} firması tarafından üretilen bir ilaçtır.

2. Kullanım Alanları
- Doktorunuzun belirttiği hastalıkların tedavisinde kullanılır
- Kesin kullanım alanları için doktorunuza danışınız

3. Kullanım Şekli ve Dozu
- İlacı mutlaka doktorunuzun önerdiği şekilde kullanınız
- Önerilen dozu aşmayınız
- Tedavi süresince doktorunuzun kontrolünde kullanınız
- İlacı düzenli olarak kullanınız

4. Olası Yan Etkiler
- Her ilaçta olduğu gibi bu ilacın da yan etkileri olabilir
- Herhangi bir yan etki görmeniz durumunda doktorunuza başvurunuz
- Alerjik reaksiyon belirtileri görürseniz ilacı kullanmayı bırakıp hemen doktorunuza danışınız

5. Saklama Koşulları
- İlacı 25°C'nin altındaki oda sıcaklığında saklayınız
- Çocukların göremeyeceği ve erişemeyeceği yerlerde saklayınız
- Son kullanma tarihi geçmiş ilaçları kullanmayınız
- Orijinal ambalajında saklayınız

ÖNEMLİ NOT:
Bu bilgiler genel bilgilendirme amaçlıdır. Her hasta için özel durumlar olabileceğinden, 
ilacın kullanımı konusunda mutlaka doktorunuzun önerilerine uyunuz.`;
}

// Tüm API fonksiyonlarını dışa aktar
export default {
    fetchDrugs,
    fetchRadiopharmaceuticals,
    fetchAllergens,
    askOpenAI
}; 
