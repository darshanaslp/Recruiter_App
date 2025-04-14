exports.generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substring(2, 10);
    return `${process.env.VIDEO_API_BASE_URL || 'https://meet.jit.si'}/${meetingId}`;
  };
  