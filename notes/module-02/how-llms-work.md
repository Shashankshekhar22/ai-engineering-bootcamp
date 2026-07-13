How does LLM Works?

Your text
   ↓
1. Tokenization
   ↓
2. Token IDs
   ↓
3. Embeddings / internal representations
   ↓
4. Transformer processes the context
   ↓
5. Model predicts probabilities for the next token
   ↓
6. One token is selected
   ↓
7. Repeat until the response is complete


<!-- What is a token?

Why does an LLM need numerical representations?

What is the role of a transformer?

What does “next-token prediction” mean?

What is the difference between training and inference?

What is a context window?

Why can an LLM hallucinate?

Why is hallucination especially dangerous in production applications?

How could RAG help?

Why might an AI engineer care about token usage? -->

1) What is a token?

Token is basicaly breaking of the Question asked/ user prompt into smaller units, these smaller units are token.

So, If user asks "What is AI"

LLM breaks it into: ["What", "is", "AI"];

This is basically tokenisation

2) Why does an LLM need numerical representations?

LLM needs a numerical representaition because The model converts token into numerical vector representation that can be processed mathematically.

["What", "is", "AI"] --> ["0.123", "0.345", "0.345"] (This is sample represntation)


3) What is the role of a transformer?
 
It is the core Architecture, It basically pays the "Attention" to the context. Paying Attention helps the model determine which parts of the context are relevant when processing other parts.

for example: “The developer deployed the application because it was ready.”

What does "it" represnts here, it represents "The Application".

The model processes relationships between tokens across the available context.

4) What does “next-token prediction” mean?

Next token predection means, what is the maximum probabilty of the word appearing after that.

Input
  ↓
Predict next token
  ↓
Add selected token
  ↓
Predict next token
  ↓
Repeat

5) What is the difference between training and inference?

Training is training from huge data set, Traing a model from the data which is not avaialble.

inference is, Model is already trined and getting information from that

6) What is a context window?

Context window is the the combination of Questions which were asked, any relevant information which is already avaiable to the model, System instructions, Retrived Rag documents and Tool Results

7) Why can an LLM hallucinate?

Since LLM does the predictions from the set of information which it has some times it tries to predict the information or response to the information which it does not have in that case it hallucinate

8) Why is hallucination especially dangerous in production applications?

In Production it can be dangerous because it might try to anwer or response to the things for which it does not have the context

9) How could RAG help?

RAG reduces certain hallocination

10) Why might an AI engineer care about token usage?

More token means more data consumtion.