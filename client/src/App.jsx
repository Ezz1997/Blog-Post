import { lazy, useContext } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./styles.css";
import SignIn from "./components/sign-in/SignIn";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Test from "./components/Test";
import TestPostDisplay from "./components/TestPostDisplay.jsx";
import { AppContext } from "./context/AppContext";
import { CircularProgress } from "@mui/material";

// Lazy loaded components
const BlogPost = lazy(() => import("./components/BlogPost.jsx"));
const PostEditor = lazy(() => import("./components/PostEditor.jsx"));
const SignUp = lazy(() => import("./components/sign-in/SignUp.jsx"));
const ForgotPassword = lazy(
  () => import("./components/sign-in/ForgotPassword.jsx")
);
const Error = lazy(() => import("./components/Error.jsx"));

function MainLayout() {
  const { isLoading, isLoggedin } = useContext(AppContext);

  return (
    <>
      {isLoggedin && <Header />}
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
        <main className="flex-container">
          <Routes>
            {/* Protected Routes - User needs to be logged in*/}
            <Route element={<ProtectedRoute />}>
              <Route index element={<Homepage />} />
              <Route path="/blog-post" element={<BlogPost />} />
              <Route path="/post-editor" element={<PostEditor />} />
              <Route path="/test" element={<Test />} />
              <Route path="/test2" element={<TestPostDisplay />} />
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
      )}

      {isLoggedin && <Footer />}
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
