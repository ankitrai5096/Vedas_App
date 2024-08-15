export const getRoomId = (userId1, userId2) => {
    if (!userId1 || !userId2) {
      console.error("Invalid userId(s) in getRoomId:", userId1, userId2);
      return null;
    }
    const sortedIds = [userId1, userId2].sort();
    const roomId = sortedIds.join('-');
    return roomId;
  };
  