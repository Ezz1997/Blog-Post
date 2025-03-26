import Header from "./components/Header";
import BlogPost from "./components/BlogPost";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import Error from "./components/Error";
import NewPost from "./components/NewPost";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import "./styles.css";
import SignIn from "./components/sign-in/SignIn";
import ForgotPassword from "./components/sign-in/ForgotPassword";
import SignUp from "./components/sign-in/SignUp";

function MainLayout() {
  const location = useLocation();

  // Check if current route is new-post
  const isNewPostPage = location.pathname === "/new-post";

  return (
    <>
      <Header />

      {/* Render <main> for all pages except new-post */}
      {!isNewPostPage && (
        <main className="flex-container">
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="/blog-post" element={<BlogPost />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
      )}

      {/* This component works with lexical and it can't be 
      nested in a flex-container */}
      {isNewPostPage && (
        <main className="grid-container">
          <Routes>
            <Route path="/new-post" element={<NewPost />} />
          </Routes>
        </main>
      )}

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
