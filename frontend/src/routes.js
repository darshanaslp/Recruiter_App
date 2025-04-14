import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JobPosting from "./pages/JobPosting";
import JobList from "./pages/JobList";
import CandidateList from "./pages/CandidateList";
import CandidateProfile from "./pages/CandidateProfile";
import InterviewSchedule from "./pages/InterviewSchedule";
import InterviewList from "./components/interview/InterviewList";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

// Layout component to include Header and Footer
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public routes without Header and Footer */}
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* Protected routes with Header and Footer */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-posting"
        element={
          <ProtectedRoute>
            <Layout>
              <JobPosting />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Layout>
              <JobList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <Layout>
              <CandidateList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <Layout>
              <InterviewSchedule />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews-list"
        element={
          <ProtectedRoute>
            <Layout>
              <InterviewList />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate-profile"
        element={
          <ProtectedRoute>
            <Layout>
              <CandidateProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={<Navigate to={token ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
