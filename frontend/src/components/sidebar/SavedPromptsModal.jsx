import { useEffect, useState } from "react";

export const SavedPromptsModal = ({ onClose }) => {
	const [prompts, setPrompts] = useState([]);
	const [categories, setCategories] = useState(["General"]);
	const [filter, setFilter] = useState("");
	const [search, setSearch] = useState("");
	const [newPromptModal, setNewPromptModal] = useState(false);

	// Modal container styles
	const modalContainerStyle = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		zIndex: 1000
	};

	// Modal content styles
	const modalContentStyle = {
		backgroundColor: '#ffffff',
		borderRadius: '8px',
		boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
		width: '400px',
		maxWidth: '95%',
		marginTop: '40px',
		overflow: 'hidden',
		position: 'relative',
		paddingBottom: '60px' // Add space for the + button at bottom
	};

	// Header styles
	const headerStyle = {
		padding: '16px',
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		borderBottom: '1px solid #f1f3f4',
		position: 'relative'
	};

	// Close button style
	const closeButtonStyle = {
		position: 'absolute',
		top: '8px',
		right: '8px',
		background: 'none',
		border: 'none',
		fontSize: '18px',
		cursor: 'pointer',
		color: '#5f6368',
		padding: '4px'
	};

	// Search input styles
	const searchInputStyle = {
		width: '100%',
		padding: '8px 12px',
		border: '1px solid #dadce0',
		borderRadius: '4px',
		fontSize: '14px',
		marginBottom: '8px'
	};

	// Dropdown styles
	const dropdownStyle = {
		width: '100%',
		padding: '8px 12px',
		border: '1px solid #dadce0',
		borderRadius: '4px',
		fontSize: '14px',
		backgroundColor: '#ffffff',
		appearance: 'menulist'
	};

	// Add button styles - positioned at bottom center
	const addButtonStyle = {
		width: '36px',
		height: '36px',
		borderRadius: '50%',
		backgroundColor: '#1a73e8',
		color: '#ffffff',
		border: 'none',
		fontSize: '20px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		position: 'absolute',
		bottom: '12px',
		left: '50%',
		transform: 'translateX(-50%)',
		boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
	};

	// Prompt list styles
	const promptListStyle = {
		maxHeight: '60vh',
		overflowY: 'auto',
		padding: '16px'
	};

	// Empty prompts message
	const emptyMessageStyle = {
		textAlign: 'center',
		color: '#5f6368',
		padding: '20px'
	};

	useEffect(() => {
		const saved = JSON.parse(localStorage.getItem("savedPrompts")) || [];
		setPrompts(saved);
		const cats = [...new Set(saved.map(p => p.category))];
		setCategories(["General", ...cats.filter(cat => cat !== "General")]);
	}, []);

	useEffect(() => {
		localStorage.setItem("savedPrompts", JSON.stringify(prompts));
		updateCategories(prompts);
	}, [prompts]);

	const updateCategories = (promptList) => {
		const usedCats = [...new Set(promptList.map(p => p.category))];
		setCategories(["General", ...usedCats.filter(cat => cat !== "General")]);
	};

	const filteredPrompts = prompts.filter(p =>
		(search === "" || p.text.toLowerCase().includes(search.toLowerCase())) &&
		(filter === "" || p.category === filter)
	);

	const addPrompt = (text, category) => {
		const newPrompts = [...prompts, { text, category }];
		setPrompts(newPrompts);
	};

	const deletePrompt = (indexToDelete) => {
		const updatedPrompts = prompts.filter((_, i) => i !== indexToDelete);
		setPrompts(updatedPrompts);
	};

	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			alert("Prompt copied!");
		} catch (err) {
			alert("Failed to copy.");
		}
	};

	return (
		<div style={modalContainerStyle}>
			<div style={modalContentStyle}>
				<div style={headerStyle}>
					<button onClick={onClose} style={closeButtonStyle} aria-label="Close">
						✕
					</button>
					<input
						type="text"
						placeholder="Search prompts..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={searchInputStyle}
					/>
					<select 
						value={filter} 
						onChange={(e) => setFilter(e.target.value)}
						style={dropdownStyle}
					>
						<option value="">All Categories</option>
						{categories.map((cat, i) => (
							<option key={i} value={cat}>{cat}</option>
						))}
					</select>
				</div>

				<div style={promptListStyle}>
					{filteredPrompts.length === 0 ? (
						<div style={emptyMessageStyle}>No prompts found</div>
					) : (
						filteredPrompts.map((p, i) => (
							<PromptItem 
								key={i} 
								prompt={p} 
								onDelete={() => deletePrompt(prompts.indexOf(p))} 
								onCopy={() => copyToClipboard(p.text)} 
							/>
						))
					)}
				</div>

				{/* Add button at the bottom center */}
				<button 
					onClick={() => setNewPromptModal(true)} 
					style={addButtonStyle}
					aria-label="Add new prompt"
				>
					+
				</button>

				{newPromptModal && (
					<NewPromptModal
						categories={categories}
						onAdd={addPrompt}
						onClose={() => setNewPromptModal(false)}
					/>
				)}
			</div>
		</div>
	);
};

// ... rest of the code remains the same ...
const PromptItem = ({ prompt, onDelete, onCopy }) => {
	// Prompt item styles
	const promptItemStyle = {
		padding: '12px 16px',
		marginBottom: '8px',
		backgroundColor: '#f8f9fa',
		borderRadius: '8px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		border: '1px solid #f1f3f4'
	};

	// Prompt text style
	const promptTextStyle = {
		fontSize: '14px',
		color: '#202124',
		flex: 1,
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	};

	// Category badge style
	const categoryStyle = {
		color: '#1a73e8',
		fontSize: '12px',
		fontWeight: 500,
		marginRight: '8px'
	};

	// Actions container
	const actionsStyle = {
		display: 'flex',
		gap: '8px'
	};

	// Button style
	const buttonStyle = {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		padding: '4px',
		color: '#5f6368',
		fontSize: '16px'
	};

	return (
		<div style={promptItemStyle}>
			<div style={promptTextStyle}>
				<span style={categoryStyle}>{prompt.category}</span>: {prompt.text}
			</div>
			<div style={actionsStyle}>
				<button onClick={onCopy} style={buttonStyle} title="Copy to clipboard">📋</button>
				<button onClick={onDelete} style={{...buttonStyle, color: '#ea4335'}} title="Delete">🗑</button>
			</div>
		</div>
	);
};

const NewPromptModal = ({ onClose, onAdd, categories }) => {
	const [text, setText] = useState("");
	const [category, setCategory] = useState("");
	const [newCategory, setNewCategory] = useState("");

	// Modal overlay styles
	const overlayStyle = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1100
	};

	// Modal styles
	const modalStyle = {
		backgroundColor: '#ffffff',
		borderRadius: '8px',
		boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
		padding: '20px',
		width: '400px',
		maxWidth: '95%'
	};

	// Header style
	const headerStyle = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '16px'
	};

	// Close button style
	const closeButtonStyle = {
		background: 'none',
		border: 'none',
		fontSize: '18px',
		cursor: 'pointer',
		color: '#5f6368'
	};

	// Textarea styles
	const textareaStyle = {
		width: '100%',
		padding: '8px 12px',
		border: '1px solid #dadce0',
		borderRadius: '4px',
		fontSize: '14px',
		resize: 'vertical',
		minHeight: '100px',
		marginBottom: '16px',
		fontFamily: 'inherit'
	};

	// Input styles
	const inputStyle = {
		width: '100%',
		padding: '8px 12px',
		border: '1px solid #dadce0',
		borderRadius: '4px',
		fontSize: '14px',
		marginBottom: '16px'
	};

	// Button container styles
	const buttonContainerStyle = {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '8px',
		marginTop: '16px'
	};

	// Cancel button styles
	const cancelButtonStyle = {
		padding: '8px 16px',
		border: '1px solid #dadce0',
		borderRadius: '4px',
		backgroundColor: '#ffffff',
		color: '#5f6368',
		fontSize: '14px',
		cursor: 'pointer'
	};

	// Save button styles
	const saveButtonStyle = {
		padding: '8px 16px',
		border: 'none',
		borderRadius: '4px',
		backgroundColor: '#1a73e8',
		color: '#ffffff',
		fontSize: '14px',
		cursor: 'pointer'
	};

	const handleAdd = () => {
		const finalCategory = newCategory || category || "General";
		if (text.trim()) {
			onAdd(text, finalCategory);
			onClose();
		}
	};

	return (
		<div style={overlayStyle}>
			<div style={modalStyle}>
				<div style={headerStyle}>
					<h3 style={{margin: 0, fontSize: '16px'}}>Add New Prompt</h3>
					<button onClick={onClose} style={closeButtonStyle}>✕</button>
				</div>
				
				<textarea
					placeholder="Enter your prompt..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					style={textareaStyle}
				/>
				<select 
					value={category} 
					onChange={(e) => setCategory(e.target.value)}
					style={inputStyle}
				>
					<option value="">Select Category</option>
					{categories.map((cat, i) => (
						<option key={i} value={cat}>{cat}</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Or create new category"
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value)}
					style={inputStyle}
				/>
				<div style={buttonContainerStyle}>
					<button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
					<button onClick={handleAdd} style={saveButtonStyle}>Save</button>
				</div>
			</div>
		</div>
	);
};