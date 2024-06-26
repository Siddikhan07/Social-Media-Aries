import React, { useEffect, useRef, useState } from "react";
import { getUser } from "../../api/UserRequest.js";
import { addMessage, getMessages } from "../../api/MessageRequest.js";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'

const ChatBox = ({ chat, currentUser,setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scroll = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const fetchUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null){
        fetchUserData();
    } 
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        // console.log(data);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null){
        fetchMessages();
    }  
  }, [chat]);

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  const handleSend =async(e)=>{
    e.preventDefault()
    const message = {
      senderId : currentUser,
      text: newMessage,
      chatId: chat._id,
    }

    // send message to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    // send message to socket server
    const receiverId = chat.members.find((id)=>id!==currentUser);
    setSendMessage({...message, receiverId})

      
  }

  useEffect(()=> {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  
  },[receivedMessage])

  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])

  return (
    <>
      <div className="ChatBox-container">
        {chat?(
            <>
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={
                      userData?.profilePicture
                        ? process.env.REACT_APP_PUBLIC_FOLDER +
                          userData.profilePicture
                        : process.env.REACT_APP_PUBLIC_FOLDER +
                          "defaultProfile.png"
                    }
                    className="followerImage"
                    style={{ width: "50px", height: "50px",borderRadius:'50%' }}
                    alt=""
                  />
                  <div className="name" style={{ fontSize: "0.8rem" }}>
                    <span>
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
            </div>
  
            {/* chatBox messsages */}
            <div className="chat-body">
              {messages.map((message)=>(
                  <>
                  <div ref={scroll}
                   className={message.senderId === currentUser? "message own": "message"}>
                      <span>{message.text}</span>
                      <span>{format(message.createdAt)}</span>
                  </div>
                  </>
              ))}
            </div>
  
            {/* chat sender */}
            <div className="chat-sender">
              <div>+</div>
              <InputEmoji value={newMessage} onChange={handleChange}/>
              <div className="send-button button" onClick={handleSend}>Send</div>
            </div>
          </>
        ):(
            <span className="chatbox-empty-message">
                Tap on a chat to start conversation...
            </span>
        )}
        
      </div>
    </>
  );
};

export default ChatBox;
