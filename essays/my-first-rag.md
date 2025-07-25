---
layout: essay
type: essay
title: "My first RAG ChatBot"
date: 2025-07-21
last_updated: 
published: true
labels:
  - LangChain
  - LangSmith
  - Google Cloud Compute
  - Ollama
  - Retrieval Augmented Generation (RAG)
---

As I got my first job (*aye*), I fell into the same rabbit hole as I did for any other bioinformatics related experience I had: Getting to know a new scientific library that coding agents does not have a lot of experience on. (If my boss is reading this I love SLEAP it's my favorite piece of software EVER!) So I decided to make my own chatbot to skip the painful experience of reading the documentation. This piece of writing is here to document how I started with LangChain, LangSmith, Ollama, and Google Cloud Compute (Thanks to their $300 free credit) to make my own RAG (Retrieval Augmented Generation) chatbot for SLEAP and SLEAP-IO.

## Getting Started with LangChain

The learning curve for building a RAG chatbot is much easier than I expected. LangChain provides a great framework for building it with [a helpful tutorial](https://github.com/langchain-ai/rag-from-scratch). I followed the tutorial with some modifications to use Google's Vertex AI for the LLM. I was able to get a basic `RunnableSequence` working that takes a user query, retrieves relevant documents from a vector store, and generates a response using the LLM. Albeit at this point, the chatbot is still very much a "toy" chatbot, I has to `rag.invoke()` whenever I want to ask a question, and it does not have any memory of previous interactions.

<img src="/img/my-first-rag/prototype-notebook.png" alt="A screenshot of jupyter notebook" class="img-fluid mb-3" />

The LangSmith interface is honestly a better UI/UX to read output than my notebook. It is also nice how it allows you to see the inputs and outputs of each step in the `RunnableSequence`. I can also use it to debug my chatbot, which is very useful when I am trying to figure out why it is not working as expected.

<img src="/img/my-first-rag/prototype-langsmith.png" alt="A screenshot of LangSmith" class="img-fluid mb-3" />

## It works... Sort of? 

<img src="/img/my-first-rag/prototype-2.0flashlite.png" alt="A screenshot of the chatbot powered by gemini-2.0-flash-lite" class="img-fluid mb-3" />
*It works, but it is not very useful yet.*

If you consider outputting text as the sole goal, I finished the project here already. But I actually want to make a chatbot that helps me with SLEAP to skip the web searching. There's also a lot of things I want to do with it: 

- AI-less RAG searching. This itself could be very useful. I want to be able to search the vector store without using the LLM. 
- To make this an actually useful chatbot, I need to improve the RAG part, either step back, multiquery, or HyDE. 
- Actual conversation memory. I want the chatbot to remember previous interactions and context.
- An MCP!

Stay tuned, I will update this essay as I make progress on this project.
