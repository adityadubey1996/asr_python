import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import Login from "../presentation/login/Login";
import Home from "../presentation/home/Home";
import { useEffect } from "react";
import { fetchQuestions, getUserMetrics } from "reducers/metric.reducer";
import QuizComponent from '../presentation/questionnaire/quiz2'
import NotFoundComponent  from '../presentation/routeNotFoundPage';
import ErrorBoundary from '../ErrorBoundary'
import {TranscriptionDashboard} from '../presentation/transcription-dashboard'
import EmailVerification from '../presentation/emailVerification';

const Routing = () => {
  const user = useSelector((state) => state?.user?.userData);
  const metrics = useSelector((state) => state.metrics)
  const dispatch = useDispatch()
 

  const isUserLoggedIn = () => {
    return !!user?.access_token;
  };

  useEffect(() => {
    if(user?.access_token){
    dispatch(getUserMetrics());
    }
    else{

    }
   
  }, [dispatch, user?.access_token])

  useEffect(() => {

  }, [metrics])

  return (
    <ErrorBoundary>
    <Router>
      <Routes>
          <Route path="/" element={<Navigate to={isUserLoggedIn() ? "/main" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={isUserLoggedIn() ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/questions" element={isUserLoggedIn() ? <QuizComponent /> : <Navigate to="/login" replace />} />
        <Route path="/recordings" element={isUserLoggedIn() ? <Home defaultItem="recordings" /> : <Navigate to="/login" replace />} />
        <Route path="/transcriptions" element={isUserLoggedIn() ? <Home defaultItem="transcriptions" /> : <Navigate to="/login" replace />} />
        <Route path="/workflow" element={isUserLoggedIn() ? <Home defaultItem="workflow" /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isUserLoggedIn() ? <Home defaultItem="settings" /> : <Navigate to="/login" replace />} />
        <Route path="/transcription-dashboard/:fileId" element={isUserLoggedIn() ? <TranscriptionDashboard /> : <Navigate to="/login" replace />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
};

export default Routing;
