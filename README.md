# Examify

> AI-powered study platform that turns your study materials into personalized practice exams.

[🚀 Live Demo](http://examify.us-east-2.elasticbeanstalk.com/)
## 📖 Overview

Examify helps students turn their study materials into personalized practice exams. Users can upload multiple documents, customize exam settings, and receive AI-generated grading and feedback. 

Based on performance insights, students can regenerate exams focused on their weak topics for targeted practice.

## ✨ Features

* 📚 Upload multiple study materials, including large documents such as textbooks
* ⚙️ Customize difficulty, question types, number of questions, and time limits
* 🤖 AI-powered grading, feedback, and performance insights
* 🎯 Generate targeted exams based on identified weak topics
* 📄 Download blank exams and answer sheets as PDFs
* 📈 View past exam results

## 🔑 Technical Highlights

* **RAG Pipeline:** Chunks uploaded documents, generates embeddings with Gemini, and stores them in Pinecone for topic-based retrieval. Relevant content is retrieved based on identified weak topics to generate targeted practice exams.
* **Large File Uploads:** Uses S3 presigned URLs for direct-to-S3 uploads, allowing users to upload large documents without routing files through the backend.
* **Duplicate Detection:** Uses SHA-256 content hashing to prevent the same document from being indexed and embedded multiple times.
* **Asynchronous Indexing:** Processes document indexing in the background with rate-limit-aware batching.

## 🛠️ Tech Stack

* **Frontend:** React
* **Backend:** Node.js
* **AI:** Gemini AI, Gemini Embeddings
* **Vector Database:** Pinecone
* **Cloud:** AWS S3, DynamoDB, Elastic Beanstalk

## 🚀 Getting Started

### Prerequisites

- Node.js
- AWS account
- Gemini API key
- Pinecone account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amishi-arora/Examify.git
cd Examify
```
2. Install dependencies:
```bash 
cd client
npm install
```
```bash
cd ../server
npm install
```

3. Configure environment variables based on the `.env.example` files

4. Start the backend:

```bash
cd server
npm start
```

5. Start the frontend:
```bash
cd client
npm run dev
```


## 📌 Future Improvements

* Improve RAG chunking and retrieval strategies
* Expand exam customization and question types
* Add a performance dashboard
* Add a RAG-powered chatbot for uploaded study materials


