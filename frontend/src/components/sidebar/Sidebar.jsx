import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { SavedPromptsModal } from "./SavedPromptsModal";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPreviousPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const toggleSidebar = () => setExtended((prev) => !prev);
  const handleNewChat = () => newChat();
  const toggleSavedPrompts = () => setShowSavedPrompts((prev) => !prev);
  
  return (
    <div className="sidebar">
      <div className="top">
        <img
          src={assets.menu_icon}
          className="menu"
          alt="menu-icon"
          onClick={toggleSidebar}
        />    
        <div className="new-chat">
          <img 
            src={assets.plus_icon} 
            alt="new chat" 
            onClick={handleNewChat}
          />
          {extended && <p>New Chat</p>}
        </div>
        
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => (
              <div 
                key={index}
                className="recent-entry"
                onClick={() => loadPreviousPrompt(item)}
              >
                <img src={assets.message_icon} alt="message" />
                <p>{item.length > 18 ? `${item.slice(0, 18)}...` : item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img
            src={assets.bookmark_icon}
            alt="bookmark-icon"
            onClick={toggleSavedPrompts}
          />
          {extended && <p>Bookmarks</p>}
        </div>
        
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;