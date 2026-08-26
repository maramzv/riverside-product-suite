This is intended to be the AI chatbot to be utilized to provide customer querying for the fictional Riverside Books.

## Gemini configuration

The Gemini key is intentionally kept off the client and out of source control. In the Vercel project, add an environment variable named `GEMINI_API_KEY` with the key value, then redeploy. The app sends Gemini requests through `/api/gemini`, so visitors never receive the key in their browser.
1. Problem Statement Staff get pulled away from the register repeatedly to answer the same questions — store hours, return policy, upcoming events, and whether a specific title is in stock — instead of helping the customer in front of them.

2. Target User A customer who's browsing online or calling ahead with a quick question, before deciding whether to make the trip in.

3. Solution Description (Non-Technical) This chatbot answers common customer questions instantly using the store's real, current information — not a generic script. If someone asks "do you have [book] in stock," it can actually check and answer "yes, 3 copies" instead of just telling them to call the store.

4. Core User Flow (a starting point — most flows land around 3–6 steps)
Step 1: Customer opens the chatbot and types a question.
Step 2: Chatbot figures out what kind of question it is (stock, hours, policy, event).
Step 3: Chatbot looks up the relevant live data (e.g. inventory for a stock question).
Step 4: Chatbot replies with a specific, current answer.
Step 5: If it can't answer confidently, it suggests calling or visiting the store.
5. Data Connection
<img width="639" height="344" alt="aichatbotfeatures" src="https://github.com/user-attachments/assets/e03717f1-1ca5-4fc2-93ae-496c203abfd1" />



6. How This Connects to the Other 3 Products This chatbot pulls live stock numbers from Product B's inventory (Mosiah), the shared book catalog everyone uses, and event info that Product D (Mara) also reads from when generating promotional content.
