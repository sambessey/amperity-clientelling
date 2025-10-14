# ChatGPT Integration Setup Guide

This guide will help you integrate ChatGPT into your CRM application.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install openai --legacy-peer-deps
# or
yarn add openai
# or
pnpm add openai
```

### 2. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-...`)

### 3. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Test the Integration

1. Open your browser to `http://localhost:3000`
2. Navigate to the dashboard
3. Try sending a message in the AI Assistant chat box

## 🔧 Features

- **Real-time chat** with ChatGPT
- **Message history** with timestamps
- **Loading states** and error handling
- **Responsive design** that works on mobile
- **Auto-scroll** to latest messages
- **Professional UI** integrated with your CRM design

## 🎨 Customization

### Changing the AI Model

Edit `/app/api/chat/route.ts` and change the model:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4', // Change from 'gpt-3.5-turbo' to 'gpt-4'
  // ... rest of config
})
```

### Customizing the System Prompt

Edit the system message in `/app/api/chat/route.ts`:

```typescript
{
  role: 'system',
  content: 'Your custom system prompt here...'
}
```

### Styling the Chat Interface

The chat components use Tailwind CSS and can be customized in:
- `/components/chat-agent.tsx` - Main chat container
- `/components/chat-message.tsx` - Individual message styling
- `/components/chat-input.tsx` - Input box styling
- `/components/chat-history.tsx` - Message history container

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- The API key is used only on the server-side (in the API route)
- Consider implementing rate limiting for production use
- Monitor your OpenAI API usage and costs

## 📱 Mobile Responsive

The chat interface is fully responsive and works great on:
- Desktop browsers
- Tablets
- Mobile phones

## 🐛 Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Make sure your `.env.local` file has the correct API key
   - Restart your development server after adding the API key

2. **"Failed to generate response"**
   - Check your internet connection
   - Verify your OpenAI API key is valid and has credits
   - Check the browser console for detailed error messages

3. **Package conflicts during installation**
   - Use `--legacy-peer-deps` flag with npm
   - Or use `yarn` or `pnpm` which handle peer dependencies better

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your OpenAI API key is working
3. Ensure all dependencies are installed correctly

## 💰 Cost Considerations

- GPT-3.5-turbo is cost-effective for most use cases
- GPT-4 provides better responses but costs more
- Monitor your usage on the OpenAI dashboard
- Consider implementing conversation limits for production

Enjoy your new ChatGPT-powered customer service assistant! 🎉