import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import API from '../services/api';
import 'react-toastify/dist/ReactToastify.css';

const CandidateProfile = () => {
  const [profile, setProfile] = useState({ resume: false, resumeName: '' });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/candidate/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDownloadResume = async () => {
    try {
      const res = await API.get('/candidate/resume', {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], {
        type: res.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile.resumeName || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading resume:', err);
      toast.error('Error downloading resume');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warn('Please select a file before submitting.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', file);

      setIsUploading(true);
      setUploadProgress(0);

      const res = await API.put('/candidate/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      setProfile(res.data.candidate);
      setFile(null);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Candidate Profile
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />

          {profile.resume && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Current CV: {profile.resumeName}
              </Typography>
              <Button onClick={handleDownloadResume} variant="outlined" sx={{ mt: 1 }}>
                Download Resume
              </Button>
            </Box>
          )}
        </Box>

        {isUploading && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body2">Uploading: {uploadProgress}%</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <Button variant="contained" type="submit" disabled={isUploading}>
          Save Profile
        </Button>
      </form>
    </Container>
  );
};

export default CandidateProfile;
