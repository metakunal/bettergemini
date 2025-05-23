import { createContext, useState } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
	const [input, setInput] = useState("");
	const [recentPrompt, setRecentPrompt] = useState("");
	const [prevPrompts, setPrevPrompts] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [loading, setLoading] = useState(false);
	const [resultData, setResultData] = useState("");

	const delayPara = (index, nextWord) => {
		setTimeout(function () {
			setResultData((prev) => prev + nextWord);
		}, 10 * index);
	};
    const newChat = () =>{
        setLoading(false);
        setShowResults(false)
    }

	const onSent = async (prompt) => {
		setResultData("");
		setLoading(true);
		setShowResults(true);
	  
		let responseText = "";
		try {
		  let response;
	  
		  if (prompt !== undefined) {
			response = await runChat(prompt);
			setRecentPrompt(prompt);
		  } else {
			setPrevPrompts(prev => [...prev, input]);
			setRecentPrompt(input);
			response = await runChat(input);
		  }
	  
		  // Format the response
		  let responseArray = response.split("**");
		  let newResponse = "";
		  for (let i = 0; i < responseArray.length; i++) {
			if (i === 0 || i % 2 !== 1) {
			  newResponse += responseArray[i];
			} else {
			  newResponse += "<b>" + responseArray[i] + "</b>";
			}
		  }
	  
		  let newResponse2 = newResponse.split("*").join("<br/>");
		  responseText = newResponse2;
	  
		  // Animate output for current session
		  let newResponseArray = responseText.split("");
		  for (let i = 0; i < newResponseArray.length; i++) {
			const nextWord = newResponseArray[i];
			delayPara(i, nextWord);
		  }
	  
		} catch (error) {
		  console.error("Error while running chat:", error);
		  responseText = "An error occurred.";
		} finally {
		  setLoading(false);
		  setInput("");
		}
	  
		return responseText; 
	  };
	  

	const contextValue = {
		prevPrompts,
		setPrevPrompts,
		onSent,
		setRecentPrompt,
		recentPrompt,
		input,
		setInput,
		showResults,
		loading,
		newChat,
		setShowResults,
		resultData,
		setResultData,
	};

	return (
		<Context.Provider value={contextValue}>{props.children}</Context.Provider>
	);
};

export default ContextProvider;
