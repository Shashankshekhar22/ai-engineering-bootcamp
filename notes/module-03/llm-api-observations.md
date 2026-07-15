1. Why can latency differ for the same request?

In my opinion latency can differ for smae request because it might has something related to context, or may be it depends on the data centers/servers from which it is fetching the response may be

Also consider provider load, network latency, queueing, output length, and model computation.

2. Why might output differ between repeated calls?

Since we know AI Models are probability based model so might be there is a case where next prediction differs from the previous one.

3. Why should we not allow unlimited user input?

Unlimited input: more input → more tokens → higher cost + greater latency + context-window pressure.

4. If 10,000 users make requests, what becomes important?

Load Balancing, rate limiting, concurrency, autoscaling, retries, caching, observability, cost control, and provider limits.

5. Why is a TypeScript interface alone not enough to validate data returned by an LLM or external API?

TS interface only works at the compiletime and during runtime it completely disappers which can cause issues 


