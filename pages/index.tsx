import type { NextPage } from 'next'
import Messenger from '../components/Chat';
import { FormEvent, useState } from 'react';
import io, { Socket } from "socket.io-client";
import { BASE_URL } from '../utils/exportedConstonants';

const socket: Socket<any> = io();

const Home: NextPage = () => {
  const [ roomID, setRoomID ] = useState<string>("");
  const [ isChat, setIsChat ] = useState<boolean>(false);
  const [ username, setUsername ] = useState<string>("");
  
  const roomHandler = (e: React.ChangeEvent<HTMLInputElement>) => setRoomID(e.target.value);
  const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

  const joinRoom = (e: FormEvent) => {
      e.preventDefault();
      
      if(username !== "" && roomID !== ""){
          socket.emit("join_room", roomID);
          setIsChat(true);
      }
  }

  return(
      <section>
          <div className="flex flex-col justify-center min- py-12 sm:px-6 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                  <h2 className="mt-6 text-3xl font-extrabold text-center text-neutral-600">Join a Room</h2>
              </div>

              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div className="px-4 py-8 sm:px-10">
                      <form className="space-y-6" action="#" method="POST">
                          <div>
                              <label className="block text-sm font-medium text-gray-700"> Username </label>
                              <div className="mt-1">
                                  <input id="username" onChange={usernameHandler} name="username" type="text" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-gray-700"> Room ID </label>
                              <div className="mt-1">
                                  <input id="roomID" name="room-id" type="text" onChange={roomHandler} className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"/ >
                              </div>
                          </div>

                          <div>
                              <button type="submit" onClick={joinRoom} className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                  Join Room
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>


          {
              isChat ? <Messenger socket={socket} username={username} roomID={roomID} /> : null
          }
          
      </section>
    );
}

export default Home
