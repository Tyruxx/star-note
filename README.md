# ⭐ StarNote Converter
**Web Personal Project**

🔗 **Live Website:** https://starnote.alan-sebastian-bun.com/  
🎥 **Demo Video:** https://drive.google.com/file/d/12leh4pzcmpWeSGR08Tbzm3qToxQq9exA/view?usp=sharing


## Overview

StarNote Converter is a full-stack currency exchange web application that provides real-time exchange rates alongside AI-powered currency market analysis and prediction. The application addresses a key user problem: the lack of visibility into future currency movements, which makes it difficult for users to plan or make informed exchange decisions.

By combining live exchange rate data with predictive insights, StarNote helps users move from reactive currency exchanges to more confident, forward-looking financial decisions.

## Problem Statement

Most currency exchange tools focus solely on displaying current rates. While accurate, this approach leaves users uncertain about *when* to exchange and *how* rates may change in the near future. This lack of foresight often results in rushed or suboptimal decisions.

StarNote bridges this gap by pairing real-time exchange rates with AI-based analysis and prediction, giving users clearer context and greater confidence when planning currency exchanges.

## Key Features

- Real-time currency exchange rate tracking  
- AI-powered currency trend analysis and prediction  
- Historical exchange rate visualization  
- Secure authentication via Google OAuth  
- Usage-based rate limiting for AI predictions  
- Clean, responsive UI optimized for usability  
- Full-stack architecture with integrated server APIs  

## Design & Development Process

StarNote was developed independently during my winter break, with full ownership over the project from concept to implementation.

The concept was grounded in the complete **design thinking framework**, which included:
- User research and empathy work with **three defined user personas**
- Iterative design through **low-fidelity and high-fidelity prototypes**
- **Peer-conducted Nielsen heuristic evaluations** to identify and refine usability issues before development

This process ensured that both technical and design decisions were consistently informed by real user needs.

## Tech Stack

### Framework & Language
- **Nuxt** (full-stack web framework built on Vue)
- **TypeScript**

### Frontend
- HTML  
- CSS  
- Tailwind CSS  

### UI & Component Libraries
- shadcn/ui  
- Vue Bits  

### Backend (Server Layer)
- Nuxt Nitro (`server/api`)

### Database & Authentication
- Supabase  
- Google OAuth  

Authentication and user management are handled via Google OAuth and Supabase. These services are used to track registered users and enforce application-level usage limits, restricting AI-powered currency rate prediction and analysis requests to **50 requests per user per day**.

### AI & Intelligence
- Gemini AI  

### External REST APIs
- **FlagCDN API** – country and currency flag assets  
- **@fawazahmed0/currency-api jsDelivr API** – retrieval of real-time and historical currency exchange rate data via CDN-hosted datasets  

