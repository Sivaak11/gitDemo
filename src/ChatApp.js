import React, { useState, useEffect } from 'react';
import './ChatApp.css'; // Optional: Add your CSS for styling the chat

const ChatApp = () => {
    const [messages, setMessages] = useState([]); // Store messages from the server
    const [inputMessage, setInputMessage] = useState(''); // Store message input by user
    const [socket, setSocket] = useState(null); // Store WebSocket instance
    const [userName, setUserName] = useState(''); // Store user name
    const [isNameSet, setIsNameSet] = useState(false); // Flag to check if the name is set

    useEffect(() => {
        if (!isNameSet) return;

        // Create a WebSocket connection to your server when the component mounts
        const ws = new WebSocket('ws://localhost:8080/ChatApplication/chat'); // Replace with your WebSocket URL

        // Event listener for when the WebSocket connection is open
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };
        

        // Event listener for when a message is received from the server
        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: event.data, type: 'received' }, // Mark it as received message
            ]); // Update messages state
        };

        // Event listener for errors
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Event listener for when the connection closes
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Save WebSocket instance to state
        setSocket(ws);

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            ws.close();
        };
    }, [isNameSet]); // This effect runs when the name is set

    // Function to send a message to the WebSocket server
    const sendMessage = () => {
        if (inputMessage && socket) {
            const messageToSend = `${userName}: ${inputMessage}`; // Format message with user name
            socket.send(messageToSend); // Send the message to the WebSocket server
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: messageToSend, type: 'sent' }, // Mark it as sent message
            ]); // Update messages state
            setInputMessage(''); // Clear the input field
        }
    };

    // Function to set the user name
    const setUserNameAndStartChat = () => {
        if (userName.trim() === '') {
            alert('Please enter a valid name');
        } else {
            setIsNameSet(true); // Set the flag to true after the name is entered
        }
    };

    return (
        <div className="chat-container">
            {!isNameSet ? (
                <div className="name-setup">
                    <h1>Enter Your Name</h1>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} // Update userName state
                        placeholder="Enter your name"
                    />
                    <button onClick={setUserNameAndStartChat}>Start Chat</button>
                </div>
            ) : (
                <>
                    <h1>Welcome,{userName}</h1>
                    <div className="messages">
                        {/* Display messages from the WebSocket server */}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.type}`} // Add class for sent or received message
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        {/* Message input field */}
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)} // Update inputMessage state
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatApp;
