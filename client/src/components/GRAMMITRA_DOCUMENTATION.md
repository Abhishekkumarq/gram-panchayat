# Gram Mitra - Chatbot Widget Documentation

## Overview
**Gram Mitra** (या **Saarthi**) is a floating chatbot widget designed for the Gram Panchayat E-Governance Portal. It provides rule-based Q&A support for citizens, appearing as a fixed button in the bottom-right corner of the screen.

## Features

✅ **Floating Widget** - Fixed button in bottom-right corner
✅ **Rule-Based Chatbot** - Keyword-matching for predefined responses
✅ **Quick Reply Chips** - 4 suggestion buttons for common queries
✅ **Typing Indicator** - 3-dot animation (1 second delay) before bot replies
✅ **Chat History** - Keeps last 10 messages for context
✅ **Minimize/Close** - Users can minimize or close the chat panel
✅ **Color Scheme** - Teal (#2dd4bf) and Dark Blue (#1a3c5e) gradient
✅ **Mobile Responsive** - Optimized for all screen sizes
✅ **Smooth Animations** - Professional transitions and interactions

---

## Files

### 1. **GramMitra.js** (Component)
- Main chatbot component
- Handles state management (messages, typing, input)
- Implements knowledge base with Q&A pairs
- Manages chat history (keeps last 10 messages)

### 2. **GramMitra.css** (Styling)
- Complete styling with Tailwind-like approach
- Responsive design for mobile and desktop
- CSS variables for easy color customization
- Smooth animations and transitions

### 3. **integration in App.js**
- Imported and added to the main App component
- Appears on all pages

---

## Predefined Q&A Pairs

The chatbot recognizes the following keywords and provides helpful responses:

### 1. **Certificates**
- **Keywords**: `certificate`, `apply certificate`, `birth certificate`, `income certificate`, `caste certificate`, `residence certificate`
- **Response**: Guides users to the Certificates section

### 2. **Tax Payment**
- **Keywords**: `tax`, `property tax`, `water tax`, `pay tax`
- **Response**: Explains how to pay property and water taxes online

### 3. **Grievances / Complaints**
- **Keywords**: `grievance`, `complaint`, `file complaint`, `report issue`
- **Response**: Guides users to file and track complaints

### 4. **Government Schemes**
- **Keywords**: `scheme`, `schemes`, `government scheme`, `scheme recommendation`, `eligible schemes`
- **Response**: Directs users to personalized scheme recommendations

### 5. **Fund Transparency**
- **Keywords**: `fund`, `budget`, `transparency`, `expenditure`, `fund transparency`
- **Response**: Explains budget allocation and expenditure information

### 6. **Login / Registration**
- **Keywords**: `login`, `register`, `account`, `sign up`, `create account`
- **Response**: Explains registration process

### 7. **Contact / Support**
- **Keywords**: `contact`, `help`, `support`, `phone`, `email`
- **Response**: Provides contact information and support hours

### 8. **Greetings**
- **Keywords**: `hello`, `hi`, `namaste`, `hey`, `greetings`
- **Response**: Friendly greeting with chatbot introduction

### 9. **Default Fallback**
- Any unmatched query receives a helpful fallback message

---

## Quick Reply Chips

Four default quick-reply buttons appear at the bottom of the chat:

1. **📜 Apply Certificate** - For certificate-related queries
2. **💰 Pay Tax** - For tax payment questions
3. **📝 File Complaint** - For grievance/complaint issues
4. **☎️ Contact Us** - For support contact information

---

## How to Customize

### **1. Add New Q&A Pairs**

Edit the `knowledgeBase` array in `GramMitra.js`:

```javascript
const knowledgeBase = [
  {
    keywords: ['new_keyword_1', 'new_keyword_2'],
    response: 'Your response message here.'
  },
  // ... existing pairs
];
```

### **2. Change Colors**

Edit CSS variables in `GramMitra.css`:

```css
:root {
  --gram-mitra-primary: #1a3c5e;      /* Dark Blue */
  --gram-mitra-accent: #2dd4bf;       /* Teal */
  --gram-mitra-light: #f0f9ff;        /* Light Blue */
  --gram-mitra-border: #e0f2fe;       /* Border Color */
}
```

### **3. Modify Quick Reply Chips**

Edit the `quickReplies` array in `GramMitra.js`:

```javascript
const quickReplies = [
  { text: 'New Chip 1', emoji: '🔔' },
  { text: 'New Chip 2', emoji: '📱' },
  // ... up to 4 chips
];
```

### **4. Change Typing Delay**

In `GramMitra.js`, find the `setTimeout` in `handleSendMessage`:

```javascript
setTimeout(() => {
  // Bot response logic
}, 1000);  // Change 1000 to your desired delay (milliseconds)
```

### **5. Modify Chat History Limit**

Change the number in chat history slicing (currently keeps last 10 messages):

```javascript
return updated.slice(Math.max(0, updated.length - 10));
// Change 10 to your desired limit
```

---

## Component Props & State

### State Variables
- `isOpen` - Chat panel visibility
- `isMinimized` - Whether chat is minimized
- `messages` - Array of chat messages
- `inputValue` - Current input text
- `isTyping` - Shows typing indicator
- `showSuggestions` - Controls visibility of quick reply chips

### Key Functions
- `handleSendMessage(text)` - Sends user message and triggers bot response
- `findResponse(userInput)` - Matches user input to knowledge base
- `handleQuickReply(replyText)` - Handles quick chip clicks
- `toggleChat()` - Open/close or minimize chat
- `handleKeyPress(e)` - Enter key to send messages

---

## Behavior

### User Interactions
1. **Click floating button** → Opens chat panel
2. **Type message & press Enter** → Sends message
3. **Click quick chip** → Sends predefined message
4. **Click minimize** → Collapses chat (shows header only)
5. **Click close** → Hides chat panel entirely

### Bot Behavior
1. Bot displays typing indicator (3 dots, 1 second)
2. Response appears with animation
3. Quick reply chips reappear after bot response
4. Chat history limited to last 10 messages
5. Smooth animations for all interactions

---

## Mobile Responsiveness

The component is fully responsive:

- **Desktop**: 380px wide floating panel
- **Tablet**: Adjusts to 90% width with smaller padding
- **Mobile (< 480px)**: 100vw width (full screen), 70vh max height
- **Small Mobile (< 360px)**: Further optimized layout

---

## Styling Details

### Colors Used
- **Primary**: #1a3c5e (Dark Blue)
- **Accent**: #2dd4bf (Teal)
- **Background**: #f0f9ff (Light Blue)
- **Border**: #e0f2fe (Light Border)
- **Messages**: Gradient backgrounds for user/bot distinction

### Typography
- Font Family: Roboto, Open Sans, system fonts
- Responsive font sizes (14px desktop, 13px mobile)
- Proper line-height for readability

### Animations
- `slideUp` - Panel entrance animation
- `fadeIn` - Message fade-in
- `typing` - Typing indicator dots

---

## Performance Considerations

✅ Lightweight component with minimal dependencies
✅ Uses `react-icons` for SVG icons (already in project)
✅ No API calls required (rule-based)
✅ Message history limited to 10 to manage memory
✅ Efficient re-renders with proper state management

---

## Browser Compatibility

- Chrome, Firefox, Safari, Edge (all modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

---

## Usage Example

The component is already integrated in `App.js`. It will appear on all pages:

```jsx
<GramMitra />
```

No additional setup required! The chatbot works as a global component.

---

## Future Enhancements

Possible improvements:

1. **API Integration** - Connect to backend for dynamic responses
2. **Multi-Language Support** - Use existing LanguageContext for translations
3. **Conversation Analytics** - Track common queries
4. **Sentiment Analysis** - Detect user satisfaction
5. **Admin Panel** - Manage Q&A pairs without code changes
6. **Notification Integration** - Alert users about scheme deadlines
7. **User Preferences** - Remember user preferences across sessions

---

## Troubleshooting

### Chatbot not appearing?
- Check that `GramMitra` is imported in `App.js`
- Verify CSS file is loaded
- Check browser console for errors

### Quick chips not working?
- Verify `quickReplies` array has correct structure
- Check `handleQuickReply` function

### Messages not sending?
- Ensure input field is not empty
- Check for JavaScript errors in console
- Verify `handleSendMessage` function

### Styling issues?
- Clear browser cache
- Check CSS variable values
- Verify media queries apply correctly

---

## Support & Contact

For issues or enhancements:
- Review the code comments in `GramMitra.js`
- Check browser DevTools console
- Refer to the customization guide above

---

**Last Updated**: April 2, 2026
**Component Version**: 1.0
**Compatibility**: React 19+, Node.js 16+
