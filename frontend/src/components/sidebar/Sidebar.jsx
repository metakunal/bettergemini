import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { SavedPromptsModal } from "./SavedPromptsModal";

const Sidebar = () => {
	const [extended, setExtended] = useState(false);
	const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);
	const [showSavedPrompts, setShowSavedPrompts] = useState(false);

	const loadPreviousPrompt = async (prompt) => {
		setRecentPrompt(prompt);
		await onSent(prompt);
	};
	return (
		<div className="sidebar">
			<div className="top">
				<img
					src={assets.menu_icon}
					className="menu"
					alt="menu-icon"
					onClick={() => {
						setExtended((prev) => !prev);
					}}
				/>
				{/* {showSavedPrompts && (
	<SavedPromptsModal onClose={() => setShowSavedPrompts(false)} />
)} */}
				<div className="new-chat">
					<img src={assets.plus_icon} alt="" onClick={() => {
						newChat()
					}} />
					{extended ? <p>New Chat</p> : null}
				</div>
				{extended ? (
					<div className="recent">
						<p className="recent-title">Recent</p>
						{prevPrompts.map((item, index) => {
							return (
								<div onClick={() => {
									loadPreviousPrompt(item)
								}} className="recent-entry">
									<img src={assets.message_icon} alt="" />
									<p>{item.slice(0, 18)}...</p>
								</div>
							);
						})}
					</div>
				) : null}
			</div>
			<div className="bottom">
				<div className="bottom-item recent-entry">
        {showSavedPrompts && (
	<SavedPromptsModal onClose={() => setShowSavedPrompts(false)} />
)}
				<img
					src={assets.bookmark_icon}
					alt="bookmark-icon"
					onClick={() => setShowSavedPrompts(true)}
				/>
				{extended ? <p>Bookmarks</p> : null}
				</div>
				<div className="bottom-item recent-entry">
					<img src={assets.setting_icon} alt="" />
					{extended ? <p>Settings</p> : null}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;