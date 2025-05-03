import { useEffect, useState } from "react";
import "./savedPromptsModal.css";

export const SavedPromptsModal = ({ onClose }) => {
	const [prompts, setPrompts] = useState([]);
	const [categories, setCategories] = useState(["General"]);
	const [filter, setFilter] = useState("");
	const [search, setSearch] = useState("");
	const [newPromptModal, setNewPromptModal] = useState(false);

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
		<div className="saved-prompts-modal">
			<div className="modal-header">
				<input
					type="text"
					placeholder="Search prompts..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<select value={filter} onChange={(e) => setFilter(e.target.value)}>
					<option value="">All Categories</option>
					{categories.map((cat, i) => (
						<option key={i} value={cat}>{cat}</option>
					))}
				</select>
				<button onClick={() => setNewPromptModal(true)}>＋</button>
				<button onClick={onClose}>✕</button>
			</div>

			<div className="prompt-list">
				{filteredPrompts.map((p, i) => (
					<div key={i} className="prompt-item">
						<div>
							<strong>{p.category}</strong>: {p.text}
						</div>
						<div className="prompt-actions">
							<button onClick={() => copyToClipboard(p.text)}>📋</button>
							<button onClick={() => deletePrompt(prompts.indexOf(p))}>🗑</button>
						</div>
					</div>
				))}
			</div>

			{newPromptModal && (
				<NewPromptModal
					categories={categories}
					onAdd={addPrompt}
					onClose={() => setNewPromptModal(false)}
				/>
			)}
		</div>
	);
};

const NewPromptModal = ({ onClose, onAdd, categories }) => {
	const [text, setText] = useState("");
	const [category, setCategory] = useState("");
	const [newCategory, setNewCategory] = useState("");

	const handleAdd = () => {
		const finalCategory = newCategory || category || "General";
		if (text.trim()) {
			onAdd(text, finalCategory);
			onClose();
		}
	};

	return (
		<div className="new-prompt-modal">
			<textarea
				placeholder="Enter your prompt..."
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<select value={category} onChange={(e) => setCategory(e.target.value)}>
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
			/>
			<div className="modal-actions">
				<button onClick={handleAdd}>Save</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	);
};
