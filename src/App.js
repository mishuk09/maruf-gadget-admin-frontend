import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Layout from './pages/Home/Layout';
import ProtectedRoute from './components/utills/ProtectedRoute';

const MainDashboard = lazy(() => import('./components/MainDashboard'));
const Home = lazy(() => import('./components/Home/Home'));
const Dashboard = lazy(() => import('./components/Auth/Dashboard'));
const AdminQuestionForm = lazy(() => import('./components/QuestionPool/AdminQuestionForm'));
const AdminProtestManager = lazy(() => import('./components/Decision/AdminProtestManager'));
const Offfer = lazy(() => import('./components/Offer/Offfer'));
const AddOffer = lazy(() => import('./components/Offer/AddOffer'));
const SelectEdit = lazy(() => import('./components/Offer/SelectEdit'));
const EditOffer = lazy(() => import('./components/Offer/EditOffer'));
const SelectDelete = lazy(() => import('./components/Offer/SelectDelete'));
const DeleteOffer = lazy(() => import('./components/Offer/DeleteOffer'));
const NewArrival = lazy(() => import('./components/NewArrival/NewArrival'));
const NewAddPost = lazy(() => import('./components/NewArrival/NewAddPost'));
const NewUpdatePost = lazy(() => import('./components/NewArrival/NewUpdatePost'));
const NewDeletePost = lazy(() => import('./components/NewArrival/NewDeletePost'));
const NewEdit = lazy(() => import('./components/NewArrival/NewEdit'));
const NewDelete = lazy(() => import('./components/NewArrival/NewDelete'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/sign-up-register" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Home & Dashboard */}
              <Route path="/" element={<MainDashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Pool */}
              <Route path="/pool" element={<AdminQuestionForm />} />

              {/* Decision */}
              <Route path="/decision" element={<AdminProtestManager />} />

              {/* Offer section routes */}
              <Route path="/offer" element={<Offfer />} />
              <Route path="/addoffer" element={<AddOffer />} />
              <Route path="/editoffer" element={<SelectEdit />} />
              <Route path="/offupdate/:id" element={<EditOffer />} />
              <Route path="/deleteoffer" element={<SelectDelete />} />
              <Route path="/offdelete/:id" element={<DeleteOffer />} />

              {/* New Arrival Section */}
              <Route path="/new" element={<NewArrival />} />
              <Route path="/newadd" element={<NewAddPost />} />
              <Route path="/newupdate/:id" element={<NewUpdatePost />} />
              <Route path="/newdelete/:id" element={<NewDeletePost />} />
              <Route path="/newedit" element={<NewEdit />} />
              <Route path="/newdelete" element={<NewDelete />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
