import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../CSS/User_Css/ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(apiKey);

  // Comprehensive prompt library for different scenarios
  const promptLibrary = {
    general: `You are WalkezAssist, a helpful AI assistant for the Walkez app, which focuses on pedestrian safety and sidewalk accessibility reporting. Your purpose is to help users navigate the app, report issues, understand pedestrian safety, and learn about sidewalk maintenance.

Key features of the Walkez app you should be familiar with:
1. Issue reporting: Users can take photos of damaged sidewalks, obstacles, or accessibility issues
2. Location tracking: The app pinpoints exact locations of reported issues using GPS
3. Community updates: Users can see issues reported by others in their area
4. Status tracking: Users can follow the resolution status of reported issues
5. Safety information: The app provides information about pedestrian rights and safety

Respond in a friendly, concise manner and stay focused on topics related to:
- Pedestrian safety and rights
- Sidewalk and walkway conditions
- Accessibility for people with disabilities
- How to use the Walkez app features
- Urban planning and pedestrian infrastructure

If asked about unrelated topics, politely redirect the conversation back to Walkez-related subjects. Your tone should be helpful and encouraging, as you're trying to promote safer walkways for everyone.`,

    newUser: `You are WalkezAssist, helping a new user get started with the Walkez app. Explain the app's purpose (reporting sidewalk issues for safer pedestrian experiences), guide them through the main features, and explain how to report their first sidewalk issue. Be welcoming, concise, and focus on getting them comfortable with basic functionality. Encourage them to explore the map feature to see nearby reported issues. If they ask questions not related to onboarding, provide brief answers but gently guide them back to the setup process.`,

    issueReporting: `You are WalkezAssist, specifically helping users with the issue reporting process in the Walkez app. Your goal is to explain how to properly document sidewalk problems (take clear photos, provide accurate descriptions, confirm location data is correct). Offer tips for effective reporting that helps maintenance crews understand the problem. Address common reporting challenges like poor lighting, location accuracy issues, or categorizing complex problems. Provide guidance on what information is most useful to include in reports.`,

    accessibility: `You are WalkezAssist, specializing in accessibility issues related to pedestrian pathways. Help users understand how to identify and report barriers that affect people with disabilities (curb cut problems, obstacles blocking paths, missing tactile paving, etc). Explain accessibility standards for public walkways and why they matter. Your responses should be informative but sensitive, emphasizing the importance of accessible infrastructure for all community members. Provide specific guidance on how Walkez helps address these accessibility concerns.`,

    communityEngagement: `You are WalkezAssist, focusing on the community aspects of the Walkez app. Explain how users can view issues reported by others, follow the status of reports, and understand the collective impact of community reporting. Offer suggestions for encouraging neighbors to participate, explain how widespread reporting leads to better municipal attention, and discuss how the data collected helps advocate for infrastructure improvements. Your tone should be community-minded and empowering.`,

    technicalSupport: `You are WalkezAssist providing technical support for the Walkez app. You can help with common issues like location services not working properly, photos not uploading, account management problems, or app navigation confusion. Provide clear, step-by-step troubleshooting instructions that non-technical users can follow. If you can't resolve a specific technical issue, explain how users can contact human support through the app's help section. Focus on being patient and thorough in your explanations.`
  };

  // Determine which prompt to use based on the user's message
  const getPrompt = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if ((lowerMessage.includes("new") && (lowerMessage.includes("user") || lowerMessage.includes("start"))) ||
        lowerMessage.includes("get started") ||
        lowerMessage.includes("begin") ||
        lowerMessage.includes("first time")) {
      return promptLibrary.newUser;
    }
    
    if (lowerMessage.includes("report") || 
        lowerMessage.includes("issue") || 
        lowerMessage.includes("problem") ||
        lowerMessage.includes("submit") ||
        lowerMessage.includes("photo") ||
        lowerMessage.includes("picture") ||
        lowerMessage.includes("document")) {
      return promptLibrary.issueReporting;
    }
    
    if (lowerMessage.includes("wheelchair") || 
        lowerMessage.includes("disability") || 
        lowerMessage.includes("accessible") ||
        lowerMessage.includes("mobility") ||
        lowerMessage.includes("ada") ||
        lowerMessage.includes("blind") ||
        lowerMessage.includes("curb cut")) {
      return promptLibrary.accessibility;
    }
    
    if (lowerMessage.includes("community") || 
        lowerMessage.includes("neighbor") || 
        lowerMessage.includes("together") ||
        lowerMessage.includes("others") ||
        lowerMessage.includes("everyone") ||
        lowerMessage.includes("participate") ||
        lowerMessage.includes("join")) {
      return promptLibrary.communityEngagement;
    }
    
    if (lowerMessage.includes("bug") || 
        lowerMessage.includes("error") || 
        lowerMessage.includes("not working") ||
        lowerMessage.includes("problem with") ||
        lowerMessage.includes("help me") ||
        lowerMessage.includes("fix") ||
        lowerMessage.includes("crash")) {
      return promptLibrary.technicalSupport;
    }
    
    return promptLibrary.general;
  };
  
  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update chat history when messages change
  useEffect(() => {
    setChatHistory(messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { 
      text: inputMessage, 
      sender: "user" 
    };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get response from Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      // OPTION 1: Select appropriate prompt based on message content
      const selectedPrompt = getPrompt(inputMessage);
      
      // Build conversation history for context
      // OPTION 2: Use recent conversation history (up to 5 messages)
      const recentHistory = chatHistory.slice(-10);
      const conversationContext = recentHistory.map(msg => 
        `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
      ).join("\n");

      // Combine prompt and history for better context
      const fullPrompt = `${selectedPrompt}

Previous conversation for context:
${conversationContext}

User query: ${inputMessage}

Remember to be helpful, concise, and stay focused on Walkez-related topics. If the user asks about something unrelated, gently bring the conversation back to pedestrian safety and the Walkez app.`;

      // Generate response with context awareness
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const botMessage = { 
        text: response.text(), 
        sender: "bot" 
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error with Gemini API:", error);
      const errorMessage = { 
        text: "Sorry, I encountered an error. Please try again later.", 
        sender: "bot" 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button 
        className="chat-toggle-button"
        onClick={toggleChat}
      >
        <img 
          src="/logos/chat-icon.svg" 
          alt="Chat" 
          className="chat-icon" 
        />
      </button>

      {/* Chat interface */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Walkez Assistant</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Hello! I'm WalkezAssist. How can I help you with pedestrian safety or using the Walkez app today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
                >
                  {message.text}
                </div>
              ))
            )}
            {isLoading && (
              <div className="bot-message loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;