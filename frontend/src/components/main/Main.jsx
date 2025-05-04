import { useEffect, useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";
import UsageDashboard from "../UsageDashboard";
import io from "socket.io-client";

const Main = ({name}) => {
	const {
		onSent,
		recentPrompt,
		setRecentPrompt,
		showResults,
		setShowResults,
		loading,
		resultData,
		setResultData,
		setInput,
		input,
	} = useContext(Context);


	const [showDashboard, setShowDashboard] = useState(false);
	const [sessionId, setSessionId] = useState(null);
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const sessionFromUrl = urlParams.get("sessionId");

		if (sessionFromUrl) {
			setSessionId(sessionFromUrl);
			socket.emit("joinSession", { name: "User", sessionId: sessionFromUrl });
		} else {
			fetch("http://localhost:5000/generateSession")
				.then((res) => res.json())
				.then((data) => {
					setSessionId(data.sessionId);
					window.history.replaceState(null, "", `?sessionId=${data.sessionId}`);
					socket.emit("joinSession", { name: "User", sessionId: data.sessionId });
				});
		}
	}, []);


	const socket = io("http://localhost:5000", {
		transports: ["websocket", "polling"]
	});

	useEffect(() => {
		socket.on("receivePrompt", ({ prompt, result }) => {
			setShowResults(true);
			setRecentPrompt(prompt);
			setResultData(result);
		});

		return () => {
			socket.off("receivePrompt");
		};
	}, []);

	const handleCardClick = (promptText) => {
		setInput(promptText);
	};

	const handleSendPrompt = async () => {
		if (!input.trim() || !sessionId) return;

		setInput("");
		setShowResults(true);
		setRecentPrompt(input);

		const promptToSend = input;

		const result = await onSent(promptToSend);

		setResultData(result);

		// Emit to everyone else
		socket.emit("promptSubmitted", {
			sessionId,
			prompt: promptToSend,
			result,
		});
	};





	return (
		<div className="main">
			{showDashboard && <UsageDashboard onClose={() => setShowDashboard(false)} />}
			<div className="nav">
				<p>Gemini</p>
				<img
					src={assets.user_icon}
					alt=""
					onClick={() => setShowDashboard(true)}
					style={{ cursor: "pointer" }}
				/>
			</div>
			<div className="main-container">
				{!showResults ? (
					<>
						<div className="greet">
							<p>
								<span>Hello , {name} </span>
							</p>
							<p>How Can i Help You Today?</p>
						</div>
						<div className="cards">
							<div
								className="card"
								onClick={() =>
									handleCardClick("Help me plan a [Number] day trip to [Destination]. I'm interested in [Interests, e.g., historical sites, beaches, food]. My budget is approximately [Budget] and I'll be traveling with [Travel companions, e.g., family, friends, solo]. Please include suggestions for [Specific requests, e.g., accommodation, transportation, specific activities].")
								}
							>
								<p>Plan an Itinerary.</p>
								<img src={assets.compass_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() =>
									handleCardClick(
										"Write a cover letter for a [Job title] position at [Company name]. My key skills and experiences include [List 2-3 key skills/experiences relevant to the job]. The job description mentions [Mention 1-2 specific requirements or keywords from the job description]. I am particularly interested in [Mention something specific that excites you about the company or role]."
									)
								}
							>
								<p>Write a Cover Letter for Me </p>
								<img src={assets.message_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() =>
									handleCardClick("I want to [Your goal, e.g., learn a new language, exercise regularly, write a book]. I have approximately [Time availability] per day/week to dedicate to this goal. My current habits are [Mention any relevant current habits]. Please create a daily/weekly routine that includes [Specific elements you want in the routine, e.g., specific times, types of activities, tracking methods] to help me achieve this goal.")
								}
							>
								<p>Create a Routine for a Goal.</p>
								<img src={assets.bulb_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() => {
									handleCardClick(
										"I want to learn how to code in [Programming language]. I'm a [Your current experience level, e.g., complete beginner, some experience with another language]. My goal is to [Your goal, e.g., build a website, analyze data, create mobile apps]. Can you provide a [Specific requests, e.g., step-by-step learning plan, resources for beginners, example projects]?"
									);
								}}
							>
								<p>Learn to Code.</p>
								<img src={assets.code_icon} alt="" />
							</div>
						</div>
					</>
				) : (
					<div className="result">
						<div className="result-title">
							<img src={assets.user} alt="" />
							<p>{recentPrompt}</p>
						</div>
						<div className="result-data">
							<img src={assets.gemini_icon} alt="" />
							{loading ? (
								<div className="loader">
									<hr />
									<hr />
									<hr />
								</div>
							) : (
								<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
							)}
						</div>
					</div>
				)}

				<div className="main-bottom">
				<div className="search-box">
    <div className="search-box-input-container">
        <textarea
		 ref={(el) => {
			if (el) {
				// Auto-resize whenever content changes
				el.style.height = 'auto';
				el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
			}
		}}
            onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize the textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
			onPaste={(e) => {
                // Handle paste and resize
                setTimeout(() => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                }, 0);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                }
            }}
            value={input}
            placeholder="Enter the Prompt Here"
            rows="1"
            style={{ height: '24px' }}
        />
    </div>
    <div className="search-box-icons">
        <img src={assets.gallery_icon} alt="Attach" />
        <img src={assets.mic_icon} alt="Voice input" />
        <img 
            src={assets.send_icon} 
            alt="Send" 
            onClick={handleSendPrompt}
            style={{ opacity: input.trim() ? 1 : 0.5 }}
        />
    </div>
</div>
					<div className="bottom-info">
						<p>
						Gemini can make mistakes, so double-check it
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;
