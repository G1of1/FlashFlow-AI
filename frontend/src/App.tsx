//import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/common/LandingPage'
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/common/HomePage';
import UserNav from './components/common/UserNav';
import UploadPage from './pages/upload/UploadPage';
import UploadNotes from './pages/upload/UploadNotes';
import UploadFlashcards from './pages/upload/UploadFlashcards';
import Library from './pages/user/common/Library';
import SearchPage from './pages/common/SearchPage';
import FlashcardDeck from './pages/user/flashcards/FlashcardDeck';
import NotesSummaryPage from './pages/user/notes/NotesSummaryPage';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/skeleton/LoadingSpinner';
import SideNav from './components/common/SideNav';
import { Toaster } from './components/ui/toaster';
import NotFound from './pages/common/NotFound';
import SettingsPage from './pages/user/common/SettingsPage';
import Saved from './pages/user/common/Saved';
import ProfilePage from './pages/user/common/ProfilePage';
import StudyPractice from './pages/user/common/StudyPractice';
import PrivacyNotice from './components/legal/PrivacyNotice';
import TermsOfUse from './components/legal/TermsOfUse';
import Verify2FA from './pages/auth/Verify2FA';
import ExampleContentPage from './pages/upload/ExampleContent';
import FlashcardExample from './pages/example/FlashcardExample';
import NotesExample from './pages/example/NotesExample';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user');
      const data = await res.json();
      if(!res.ok || data.error) {
        return null;
      }
      return data.data;
    },
    retry: false,
    
  })

  if(isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
    <LoadingSpinner />
    </div>
    )
  }
  return (
  <div className="flex flex-col min-h-screen">
    {authUser?.twoFactorEnabled ? <UserNav /> : <Header />}
    <div className="flex flex-1">
      {authUser?.twoFactorEnabled && <SideNav />}
      <main className="flex-1 bg9 overflow-y-auto">
        <Routes>
          <Route path="/" element={ authUser ? (authUser.twoFactorEnabled ? <HomePage /> : <Navigate to="/setup-2fa" />) : <LandingPage /> } />
          <Route path="/setup-2fa" element={authUser ? <Verify2FA /> : <Navigate to="/login" />} />
          <Route path="/register" element={!authUser?.twoFactorEnabled ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser?.twoFactorEnabled ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/upload/" element={authUser?.twoFactorEnabled ? <UploadPage /> : <Navigate to='/login' />} />
          <Route path="/upload/notes" element={authUser?.twoFactorEnabled ? <UploadNotes /> : <Navigate to='/login' />} />
          <Route path="/upload/flashcards" element={authUser?.twoFactorEnabled ? <UploadFlashcards /> : <Navigate to='/login' />} />
          <Route path="/upload/examples" element={authUser?.twoFactorEnabled ? <ExampleContentPage /> : <Navigate to="/login"/>} />
          <Route path="/flashcard-example" element={authUser?.twoFactorEnabled ? <FlashcardExample /> : <Navigate to="/login" />} />
          <Route path="/notes-example" element={authUser?.twoFactorEnabled ? <NotesExample /> : <Navigate to="/login" />} />
          <Route path="/library" element={authUser?.twoFactorEnabled ? <Library /> : <Navigate to="/login" />} />
          <Route path="/search" element={authUser?.twoFactorEnabled ? <SearchPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={authUser?.twoFactorEnabled ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser?.twoFactorEnabled ? <SettingsPage /> : <Navigate to="/login" /> } />
          <Route path="/library/flashcards/:id" element={authUser?.twoFactorEnabled ? <FlashcardDeck /> : <Navigate to="/login" />} />
          <Route path="/library/notes/:id" element={authUser?.twoFactorEnabled ? <NotesSummaryPage /> : <Navigate to="/login" />} />
          <Route path="/saved" element={authUser?.twoFactorEnabled ? <Saved /> : <Navigate to="/login" /> } />
          <Route path="/practice" element={authUser?.twoFactorEnabled ? <StudyPractice /> : <Navigate to="/login" />} /> 
          <Route path="*" element={<NotFound />} />
          <Route path="/privacy" element={<PrivacyNotice />} />
          <Route path="/terms" element={<TermsOfUse />} />
          
        </Routes>
        <Toaster />
      </main>
    </div>
    <Footer />
  </div>
);
}

export default App
