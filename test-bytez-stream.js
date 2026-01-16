
const apiKey = "4d457b6b2ed467c2a04e81dcebd01e86 ";
async function test() {
    const response = await fetch("https://api.bytez.com/models/v2/Qwen/Qwen3-4B", {
        method: "POST",
        headers: {
            "Authorization": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: "hi"
                }
            ],
            stream: true,
            params: {
                max_length: 100
            }
        }),
    });
    console.log("Status:", response.status);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log("Chunk:", decoder.decode(value));
    }
}
test();
