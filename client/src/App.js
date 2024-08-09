import './App.css';
import React, {useState, useEffect} from "react";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "http://localhost:5000/";

function App() {
  // Before logIn
  const [loggedIn, setLoggedIn] = useState(false);
  const [group, setGroup] = useState("");
  const [userName, setUserName] = useState("");

  // after logIn
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
    // eslint-disable-next-line
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      setMsgList([...msgList, data]);
    });
  });

  const connectToGroup = () => {
    setLoggedIn(true);
    socket.emit("join_room", group);
  };

  const sendMsg = async () => {
    let msgContent = {
      group: group,
      content: {
        author: userName,
        msg: msg,
      },
    };

    await socket.emit("send_msg", msgContent);
    setMsgList([...msgList, msgContent.content]);
    setMsg("");
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input type="text"
            placeholder = "Your Anonymous username.."
            onChange = {(e) => {
              setUserName(e.target.value);
            }} />
            <input type="text"
            placeholder = "Group.."
            onChange = {(e) => {
              setGroup(e.target.value);
            }} />
          </div>
          <button onClick = {connectToGroup}>Enter Group</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="msg">
            {msgList.map((val, key) => {
              return (
                <div className="msgContainer" id = {val.author === userName ? "You" : "Other"}>
                  <div className="msgIndividual">
                    {val.author} : {val.msg}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="msgInputs">
          <input type="text"
            placeholder = "Msg.."
            onChange = {(e) => {
              setMsg(e.target.value);
            }} />
            <button onClick = {sendMsg}>Send</button>
          </div>
        </div>
      )
      }
    </div>
  );
}

export default App;
