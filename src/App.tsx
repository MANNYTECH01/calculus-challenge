import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { MathJaxContext } from "better-react-mathjax";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DashboardPage from "./pages/DashboardPage";
import MessagesPage from "./pages/MessagesPage";
import QuizReviewPage from "./pages/QuizReviewPage";
import CreateUsersPage from "./pages/CreateUsersPage";
import AdminPage from "./pages/AdminPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import NotFound from "./pages/NotFound";
import QuestionPreviewPage from "./pages/QuestionPreviewPage";

const queryClient = new QueryClient();

// No config object is needed here anymore, as it's now handled globally in index.html.

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <MathJaxContext>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/quiz-review" element={<QuizReviewPage />} />
              <Route path="/create-users" element={<CreateUsersPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/question-preview" element={<QuestionPreviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MathJaxContext>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
