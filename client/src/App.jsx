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
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Test from "./components/Test";
import { AppContext } from "./context/AppContext";
import { useContext } from "react";
import { CircularProgress } from "@mui/material";

function MainLayout() {
  const location = useLocation();

  // Check if current route is new-post
  const isNewPostPage = location.pathname === "/new-post";

  const { isLoading } = useContext(AppContext);
  return (
    <>
      <Header />
      {/* Render <main> for all pages except new-post */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        !isNewPostPage && (
          <main className="flex-container">
            <Routes>
              {/* Protected Routes - User needs to be logged in*/}
              <Route element={<ProtectedRoute />}>
                <Route index element={<Homepage />} />
                <Route path="/blog-post" element={<BlogPost />} />
                <Route path="/test" element={<Test />} />
              </Route>

              {/* Public Routes - User not logged in only*/}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<SignIn />} />
              </Route>

              {/* Global Routes - Accessable regardless of if the user is logged in or not*/}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </main>
        )
      )}

      {/* This component works with lexical and it can't be 
      nested in a flex-container */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        isNewPostPage && (
          <main className="grid-container">
            <Routes>
              {/* Public Routes - User not logged in only*/}
              <Route element={<ProtectedRoute />}>
                <Route path="/new-post" element={<NewPost />} />
              </Route>
            </Routes>
          </main>
        )
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
