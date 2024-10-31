import { useState, useRef } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { ArrowRightIcon } from "@100mslive/react-icons";

function Join() {
  const hmsActions = useHMSActions();
  const roomCodeRef = useRef(null);
  const userNameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle joining an existing room
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomCode = roomCodeRef.current?.value;

    try {
      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
      await hmsActions.join({
        userName: userNameRef.current?.value,
        authToken,
      });
    } catch (error) {
      console.error("Error joining room:", error);
      setErrorMessage("Failed to join room. Please check the room code.");
    }
  };

  // Function to create a new room and join as the host
  const createRoom = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Call the backend API to create the room
      const response = await fetch("http://localhost:5000/api/create-room", { // Adjust URL if needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create room: " + response.statusText);
      }

      const { roomCode } = await response.json();
      console.log("Generated Room Code:", roomCode);

      // Step 3: Get auth token and join as host
      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
      await hmsActions.join({
        userName: userNameRef.current?.value,
        authToken,
      });
    } catch (error) {
      console.error("Error creating or joining room:", error);
      setErrorMessage("Error creating or joining room: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      
      <h2 style={{ marginTop: "2rem" }}>Create or Join Room</h2>
      <p>Enter your room code and name before joining</p>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={roomCodeRef}
            id="room-code"
            type="text"
            name="roomCode"
            placeholder="Your Room Code"
            required
          />
        </div>
        <div className="input-container">
          <input
            required
            ref={userNameRef}
            id="name"
            type="text"
            name="name"
            placeholder="Your Name"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Join Now
          <ArrowRightIcon
            height={16}
            width={16}
            style={{ marginLeft: "0.25rem" }}
          />
        </button>
      </form>
      <button
        onClick={createRoom}
        className="btn btn-primary"
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Creating Room..." : "Create Room"}
      </button>
    </div>
  );
}

export default Join;
