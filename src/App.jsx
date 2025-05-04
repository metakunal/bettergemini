import { useEffect, useState } from "react";
import Main from "./components/main/Main";
import Sidebar from "./components/sidebar/Sidebar";
import ChatSidebar from "./components/chat/ChatSidebar";

const App = () => {
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const username = prompt("Enter your name:");
    setName(username);
  
    const urlParams = new URLSearchParams(window.location.search);
    const sessionFromUrl = urlParams.get("sessionId");
  
    if (sessionFromUrl) {
      setSessionId(sessionFromUrl);
    } else {
      fetch("http://localhost:5000/generateSession")
        .then((res) => res.json())
        .then((data) => setSessionId(data.sessionId));
    }

    if (!sessionFromUrl) {
      fetch("http://localhost:5000/generateSession")
        .then((res) => res.json())
        .then((data) => {
          setSessionId(data.sessionId);
          window.history.replaceState(null, "", `?sessionId=${data.sessionId}`);
        });
    }
  }, []);
  

  return (
    <>
      <ChatSidebar name={name} sessionId={sessionId} />
      <Sidebar />
      <Main />
    </>
  );
};

export default App;
