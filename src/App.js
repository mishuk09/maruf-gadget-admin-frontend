import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Layout from './pages/Home/Layout';
import ProtectedRoute from './components/utills/ProtectedRoute';
import Overview from './components/Overview';

const MainDashboard = lazy(() => import('./components/MainDashboard'));
const Home = lazy(() => import('./components/Home/Home'));
const Dashboard = lazy(() => import('./components/Auth/Dashboard'));
 

function App() {
  return (
    <div className="App">
      <Suspense fallback={null}>
        <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/sign-up-register" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Home & Dashboard */}
            <Route path="/" element={<MainDashboard />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Route>
        </Route>
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
