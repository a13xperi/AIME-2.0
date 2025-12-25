/**
 * Agent Alex + AIME Golf AI - Main App Component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import ProjectsList from './components/ProjectsList/ProjectsList';
import SessionsList from './components/SessionsList/SessionsList';
import SessionDetail from './components/SessionDetail/SessionDetail';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';
import TeamCollaboration from './components/TeamCollaboration/TeamCollaboration';
import AIRealtime from './components/airealtime/AIRealtime';
import SplashScreen from './components/SplashScreen/SplashScreen';
import LandingPage from './components/LandingPage/LandingPage';
import MyBag from './components/MyBag/MyBag';
import HoleStart from './components/HoleStart/HoleStart';
import ShotGuidance from './components/ShotGuidance/ShotGuidance';
import GreenTransition from './components/GreenTransition/GreenTransition';
import PuttingGuidance from './components/PuttingGuidance/PuttingGuidance';
import HoleComplete from './components/HoleComplete/HoleComplete';
import RoundComplete from './components/RoundComplete/RoundComplete';
import CourseSelection from './components/CourseSelection/CourseSelection';
import RoundSettings from './components/RoundSettings/RoundSettings';
import NextHole from './components/NextHole/NextHole';
import ShotHistory from './components/ShotHistory/ShotHistory';
import Settings from './components/Settings/Settings';
import Welcome from './components/Welcome/Welcome';
import RoundHistory from './components/RoundHistory/RoundHistory';
import Scorecard from './components/Scorecard/Scorecard';
import DetailedStats from './components/DetailedStats/DetailedStats';
import Help from './components/Help/Help';
import ClubRecommendations from './components/ClubRecommendations/ClubRecommendations';
import Weather from './components/Weather/Weather';
import RoundDetail from './components/RoundDetail/RoundDetail';
import Profile from './components/Profile/Profile';
import CourseSearch from './components/CourseSearch/CourseSearch';
import MultiPlayerScorecard from './components/MultiPlayerScorecard/MultiPlayerScorecard';
import PracticeMode from './components/PracticeMode/PracticeMode';
import Achievements from './components/Achievements/Achievements';
import RoundComparison from './components/RoundComparison/RoundComparison';
import ClubAnalysis from './components/ClubAnalysis/ClubAnalysis';
import Sharing from './components/Sharing/Sharing';
import Tutorial from './components/Tutorial/Tutorial';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/sessions" element={<SessionsList />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/team" element={<TeamCollaboration projects={[]} sessions={[]} currentUserId="current-user" />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/session/:id" element={<SessionDetail />} />
            {/* AIME Golf AI Route */}
            <Route path="/golf" element={<AIRealtime />} />
            <Route path="/aime" element={<AIRealtime />} />
            {/* AIME App Flow */}
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/course-selection" element={<CourseSelection />} />
            <Route path="/round-settings" element={<RoundSettings />} />
            <Route path="/my-bag" element={<MyBag />} />
            <Route path="/hole-start" element={<HoleStart />} />
            <Route path="/shot-guidance" element={<ShotGuidance />} />
            <Route path="/green-transition" element={<GreenTransition />} />
            <Route path="/putting" element={<PuttingGuidance />} />
            <Route path="/hole-complete" element={<HoleComplete />} />
            <Route path="/shot-history" element={<ShotHistory />} />
            <Route path="/next-hole" element={<NextHole />} />
            <Route path="/round-complete" element={<RoundComplete />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/round-history" element={<RoundHistory />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/detailed-stats" element={<DetailedStats />} />
            <Route path="/help" element={<Help />} />
            <Route path="/club-recommendations" element={<ClubRecommendations />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/round-detail/:id" element={<RoundDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/course-search" element={<CourseSearch />} />
            <Route path="/multiplayer-scorecard" element={<MultiPlayerScorecard />} />
            <Route path="/practice" element={<PracticeMode />} />
            <Route path="/practice/:type" element={<PracticeMode />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/round-comparison" element={<RoundComparison />} />
            <Route path="/club-analysis" element={<ClubAnalysis />} />
            <Route path="/sharing" element={<Sharing />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
