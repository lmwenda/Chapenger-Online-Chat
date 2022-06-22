import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

interface IMessenger {
    socket: Socket,
    username: String,
    roomID: String
}

interface T{
    room: String,
    author: string,
    message: string,
    time: string
}

const Messenger = ({ socket, username, roomID }: IMessenger) => {
    const [ message, setMessage ] = useState<string>("");
    const [ messages, setMessages ] = useState<T[]>([]);
    
    const messageHandler = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

    const sendMessage = async() => {
        const messageData = {
            room: roomID,
            author: username,
            message: message,
            time: new Date(Date.now()).getHours() +
            ":" +  new Date(Date.now()).getMinutes(),
        }

        await socket.emit("send_message", messageData);
        setMessages((list: any) => [...list, messageData]);
    }

    useEffect(() => {
        socket.on("receive_message", (data: any) => {
            setMessages((list: any) => [...list, data]);
        });
    }, [socket])
    
    return(
        <div className="overflow-y-auto w-full" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min- px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:" aria-hidden="true">​</span>
                <div className="inline-block p-5 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-2xl lg:p-16 sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                    <div>
                        <h1 className="text-center justify-center text-2xl">Chapenger Online Chat</h1>
                        <h2 className="text-center justify-center text-1xl">Welcome to Room: {roomID}</h2>
                    </div>

                    <div className="w-full mx-auto mt-5 border rounded border-black h-64 overflow-y overflow-x-hidden">
                        <ScrollToBottom className="h-full w-full overflow-y-scoll overflow-x-hidden">
                            {
                                messages.map((_message: any) => (
                                        <div key={_message.key} className={`flex my-3 mx-3 ${_message.author === username ? "justify-left" : "justify-end"}`}>
                                            <div>
                                                <div className="h-10 w-64 text-left pl-5 items-center pt-1 text-white text-2xl border border-blue-500 bg-blue-500 rounded-full">{_message.message}</div>
                                                <div className="text-left pl-3 text-gray-500 flex flex-row space-x-3">
                                                    <p>{_message.time}</p>
                                                    <p>{ _message.author === username ? "You" : _message.author}</p>
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                        </ScrollToBottom>
                    </div>

                    <div className="justify-between w-full mx-auto mt-4 overflow-hidden rounded-lg wt-10 sm:flex">
                        <div className="flex flex-col space-y-10 w-full">
                            <div className="flex flex-col justify-center items-center space-y-3 w-full">
                                <input onKeyPress={(event) => {event.key === "Enter" && sendMessage()}} onChange={messageHandler} className="block w-full px-5 py-3 mt-2 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 apearance-none autoexpand" id="description" name="description" placeholder="Message" />
                                <button onClick={sendMessage} type="submit" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                  Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default Messenger;