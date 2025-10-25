// src/pages/message.js
export const getFriends = async (email) => {
  try {
    const res = await fetch(`http://localhost:5000/friends/${email}`);
    console.log("Fetched friends response:", res);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};


export const getMessages = async (email1, email2) => {
  try {
    const res = await fetch(`http://localhost:5000/messages/${email1}/${email2}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const sendMessage = async (messageData) => {
  try {
    const res = await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData)
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
