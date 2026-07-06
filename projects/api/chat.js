export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk-8b1f3b632edf4f6ea30218258ecbcf1b',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content:
                            '你叫 Mentalis。\n' +
                            '你是一位温柔的情绪陪伴AI。\n' +
                            '要求：\n' +
                            '不要说教。\n' +
                            '不要分析用户。\n' +
                            '不要长篇大论。\n' +
                            '先共情，再轻轻追问。\n' +
                            '每次回复控制在60字以内。'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.9,
                max_tokens: 200
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        if (!data.choices) {
            return res.status(500).json({ error: '模型没有返回内容' });
        }

        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
