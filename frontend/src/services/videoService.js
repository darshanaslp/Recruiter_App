export const generateMeetingLink = () => {
    // For Jitsi, you might simply open a URL with a unique meeting ID
    const meetingId = Math.random().toString(36).substring(2, 10);
    return `https://meet.jit.si/${meetingId}`;
  };
  