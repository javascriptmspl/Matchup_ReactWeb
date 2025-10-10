import React, { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import "../../assets/css/MessageList.css";
import HeaderFour from "../layout/HeaderFour";
import FooterFour from "../layout/footerFour";
import AvatarUserA from "../../assets/avatar/1.png";
import AvatarUserB from "../../assets/avatar/6.png";
import AvatarUserC from "../../assets/avatar/4.png";
import AvatarUserD from "../../assets/avatar/5.jpeg";
import AvatarUserE from "../../assets/avatar/2.png";
import AvatarUserF from "../../assets/avatar/7.jpeg";
import phoneIcon from "../../assets/chat/telephone.png";
import MessengerHeader from "./MessengerHeader";
const MessengerPage = () => {
  const dummyContent = {
    "User A": ["Hello!", "How are you?", "Nice to meet you! "],
    "User B": ["Hi there!", "I'm doing well.", "What's up?"],
    "User C": ["Hello!", "How are you?", "Nice to meet you!"],
    "User D": ["Hi there!", "I'm doing well.", "What's up?"],
    "User E": ["Hello!", "How are you?", "Nice to meet you!"],
    "User F": ["Hi there!", "I'm doing well.", "What's up? "],
  };

  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [activeUserName, setActiveUserName] = useState();

  const [defaultActiveUser, setDefaultActiveUser] = useState("User A");
  const [showProfileList, setShowProfileList] = useState(true);

  useEffect(() => {
    const initialMessages = Object.keys(dummyContent).flatMap((user) =>
      dummyContent[user].map((text) => ({ user, text }))
    );
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    setActiveUser(defaultActiveUser);
  }, [defaultActiveUser]);

  const handleSendMessage = (text) => {
    if (activeUser) {
      setMessages([...messages, { text, user: activeUser }]);
    }
  };

  const handleUserClick = (userdata) => {
    setActiveUser(userdata.name);
    setActiveUserName(userdata);
    setShowProfileList(false);
  };

  const handleBackClick = () => {
    setShowProfileList(true);
  };
  return (
    <div className="container-fluid message-page">
      <HeaderFour />

      <div className="messenger-container">
        <div className={`sidebar ${showProfileList ? "visible" : "hidden"}`}>
          <div className="sidebar custom-cls">
            <form action="#" className="message-chat-cls">
              <input
                type="text"
                name="search"
                placeholder="search"
                className="message-chat"
              />
              <button type="submit" className="btnn-submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
            <h3 className="mt-2">Chats</h3>
            <ul>
              <li
                onClick={() =>
                  handleUserClick({
                    name: "User A",
                    userName: "Amiliaa",
                    img: AvatarUserA,
                  })
                }
              >
                <img src={AvatarUserA} alt="User A" className="avatar" />
                Amilia
              </li>
              <li
                onClick={() =>
                  handleUserClick({
                    name: "User B",
                    userName: "Harry",
                    img: AvatarUserB,
                  })
                }
              >
                <img src={AvatarUserB} alt="User B" className="avatar" />
                Harry
              </li>
              <li
                onClick={() =>
                  handleUserClick({
                    name: "User C",
                    userName: "Amayra",
                    img: AvatarUserC,
                  })
                }
              >
                <img src={AvatarUserC} alt="User C" className="avatar" />
                Amayra
              </li>
              <li
                onClick={() =>
                  handleUserClick({
                    name: "User C",
                    userName: "Jonhy",
                    img: AvatarUserC,
                  })
                }
              >
                <img src={AvatarUserD} alt="User B" className="avatar" />
                Jonhy
              </li>
              <li
                onClick={() =>
                  handleUserClick({
                    name: "User C",
                    userName: "oliva",
                    img: AvatarUserE,
                  })
                }
              >
                <img src={AvatarUserE} alt="User A" className="avatar" />
                oliva
              </li>
              <li
                onClick={() =>
                  handleUserClick({
                    name: "User C",
                    userName: "john deo",
                    img: AvatarUserF,
                  })
                }
              >
                <img src={AvatarUserF} alt="User B" className="avatar" />
                john deo
              </li>
            </ul>
          </div>
        </div>

        <div className="chat-container">
          {!showProfileList && (
            <div>
              <button className="custm-back" onClick={handleBackClick}>
                Back to Chats
              </button>
            </div>
          )}

          <MessengerHeader user={activeUser} userName={activeUserName} />
          <MessageList
            messages={messages}
            activeUser={activeUser}
            onUserClick={handleUserClick}
            showProfileList={showProfileList}
          />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      <FooterFour />
    </div>
  );
};

export default MessengerPage;
