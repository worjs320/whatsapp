import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  MoreVert,
  SearchOutlined,
  HighlightOff,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import "./Chat.css";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";

function Chat() {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(function (snapshot) {
          setMessages(
            snapshot.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
          );
          scrollDown();
        });
    }
    scrollDown();
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You typed >>>", input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
    scrollDown();
  };

  const deleteMessage = (e) => {
    try {
      db.collection("rooms").doc(roomId).collection("messages").doc(e).delete();
    } catch {
      alert("delete Error");
    }
  };

  const scrollDown = () => {
    const objDiv = document.getElementById("chat__body");
    setTimeout(() => (objDiv.scrollTop = objDiv.scrollHeight), 500);
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.data?.timestamp?.toDate()
            ).toLocaleString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div id="chat__body" className="chat__body">
        {messages.map((message) => (
          <>
            <div
              className={`chat__message ${
                message.data.name == user.displayName && "chat__reciever"
              }`}
            >
              <span className="chat__name">{message.data.name}</span>
              {message.data.message}
              <span className="chat__subarea">
                <span className="chat__timestamp">
                  <br />
                  {new Date(message.data.timestamp?.toDate()).toLocaleString()}
                </span>
                <span className="chat__deleteButton">
                  <IconButton onClick={() => deleteMessage(message.id)}>
                    <HighlightOff
                      onClick={() => deleteMessage(message.id)}
                      style={{ fontSize: 20, color: "#D11A2A" }}
                    />
                  </IconButton>
                </span>
              </span>
            </div>
          </>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
