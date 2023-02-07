import React from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useSelector, useDispatch } from 'react-redux';
import { setMessage, setParams, setUsers, setState } from "../store/chatSlice";

import Messages from "./Messages";

import icon from "../images/emoji.svg";
import styles from "../styles/Chat.module.css";


const socket = io.connect("http://localhost:7120");

const storage = {
	get: (key) =>
		window.localStorage.getItem(key)
			? JSON.parse(window.localStorage.getItem(key))
			: null,
	set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value))
}

const Chat = () => {
	const { search } = useLocation();
	const navigate = useNavigate();
	// const [params, setParams] = useState({ room: "", user: "" });
	// const [state, setState] = useState([]);
	// const [message, setMessage] = useState("");
	const [isOpen, setOpen] = useState(false);
	// const [users, setUsers] = useState(0);

	const dispatch = useDispatch();

	const params = useSelector(state => state.chat.params);
	const users = useSelector(state => state.chat.users);
	const message = useSelector(state => state.chat.message);
	const state = useSelector(state => state.chat.state);

	useEffect(() => {
		const searchParams = Object.fromEntries(new URLSearchParams(search));
		// setParams(searchParams);
		dispatch(setParams(searchParams))
		socket.emit("join", searchParams);
	}, [search]);

	useEffect(() => {
		socket.on("message", ({ data }) => {
			// setState((_state) => [..._state, data]);
			dispatch(setState(data))
		});
	}, []);

	useEffect(() => {
		socket.on("room", ({ data: { users } }) => {
			// setUsers(users.length);
			dispatch(setUsers(users.length))
		});
	}, []);

	const leftRoom = () => {
		socket.emit("leftRoom", { params });
		navigate("/");
	};

	const handleChange = ({ target: { value } }) => dispatch(setMessage(value));

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!message) return;
		socket.emit("sendMessage", { message, params });

		// setMessage("");
		dispatch(setMessage(""));
	};

	const onEmojiClick = ({ emoji }) => dispatch(setMessage(`${message} ${emoji}`));

	return (
		<div className={styles.wrap}>
			<div className={styles.header}>
				<div className={styles.title}>{params.room}</div>
				<div className={styles.users}> {users} users in this room</div>
				<button className={styles.left} onClick={leftRoom}>
					Left the room
				</button>
			</div>

			<div className={styles.messages}>
				<Messages messages={state} name={params.name} />
			</div>

			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.input}>
					<input
						type="text"
						name="message"
						placeholder="What do you want to say?"
						value={message}
						onChange={handleChange}
						autoComplete="off"
						required
					/>
				</div>
				<div className={styles.emoji}>
					<img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

					{isOpen && (
						<div className={styles.emojies}>
							<EmojiPicker onEmojiClick={onEmojiClick} />
						</div>
					)}
				</div>

				<div className={styles.button}>
					<input type="submit" onSubmit={handleSubmit} value="Send a message" />
				</div>
			</form>
		</div>
	);
};

export default Chat;
