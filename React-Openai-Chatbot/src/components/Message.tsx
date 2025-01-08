// src/components/Message.tsx
import React, { Fragment, useEffect ,useState} from "react";
import { MessageDto } from "../models/MessageDto";
import he from 'he'; 
import './message.css';

interface MessageProps {
  message: MessageDto;
}





const Message: React.FC<MessageProps> = ({ message } ) => {
  const [cleanHtmlString,setCleanHtmlstring] = useState('')
  const [stylestring,setcleanstylestring] = useState('')
  message = {
    content: message.content,
    isUser: message.isUser
  }
  useEffect(() =>{

    const decodedHtmlString = he.decode(message.content);

    setCleanHtmlstring(decodedHtmlString)
  },[])
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left" }}>
      <div
        style={{
          color: message.isUser ? "black" : "#000000",
          // backgroundColor: message.isUser ? "rgba(244,244,244,0.8)" : "",
          padding: "15px",
          paddingLeft:0,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          flexDirection: message.isUser ? 'row-reverse': 'row',
          borderRadius:  message.isUser ? 20: "8px",
        }}
      >
        <div  dangerouslySetInnerHTML={{ __html: cleanHtmlString }}/>
      </div>
    </div>
  );
};

export default Message;