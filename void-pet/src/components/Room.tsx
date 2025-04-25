import React from "react";
import Pet from "./Pet";
//import '../styles/Room.css';

interface RoomProps {
  children?: React.ReactNode;
}

const Room: React.FC<RoomProps> = ({ children }) => {
  return (
    <div className="room">
      <div className="room-background">
        <div className="stars"></div>
        <div className="room-floor"></div>
      </div>
      {children}
    </div>
  );
};

export default Room;
