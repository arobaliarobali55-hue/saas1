
const apiKey = "4d457b6b2ed467c2a04e81dcebd01e86";
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
            stream: false
        }),
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
}
test();
