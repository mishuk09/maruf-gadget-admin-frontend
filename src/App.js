import { Route, Routes } from 'react-router';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Layout from './pages/Home/Layout';
import ProtectedRoute from './components/utills/ProtectedRoute';
import Dashboard from './components/Auth/Dashboard';
import Offfer from './components/Offer/Offfer';
import AddOffer from './components/Offer/AddOffer';
import SelectEdit from './components/Offer/SelectEdit';
import EditOffer from './components/Offer/EditOffer';
import SelectDelete from './components/Offer/SelectDelete';
import DeleteOffer from './components/Offer/DeleteOffer';
import NewArrival from './components/NewArrival/NewArrival';
import NewAddPost from './components/NewArrival/NewAddPost';
import NewUpdatePost from './components/NewArrival/NewUpdatePost';
import NewDeletePost from './components/NewArrival/NewDeletePost';
import NewEdit from './components/NewArrival/NewEdit';
import NewDelete from './components/NewArrival/NewDelete';
import Home from './components/Home/Home';
import AdminQuestionForm from './components/QuestionPool/AdminQuestionForm';
import AdminProtestManager from './components/Decision/AdminProtestManager';
import MainDashboard from './components/MainDashboard';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
