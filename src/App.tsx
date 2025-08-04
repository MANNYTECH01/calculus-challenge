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

// Enhanced MathJax configuration for production compatibility
const mathJaxConfig = {
  loader: { 
    load: ['[tex]/html', '[tex]/mathtools', '[tex]/amsmath', '[tex]/amsfonts', '[tex]/amssymb'] 
  },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    packages: {'[+]': ['html', 'mathtools', 'amsmath', 'amsfonts', 'amssymb']},
    processEscapes: true,
    processEnvironments: true,
    macros: {
      RR: "\\mathbb{R}",
      ZZ: "\\mathbb{Z}",
      NN: "\\mathbb{N}",
      QQ: "\\mathbb{Q}",
      CC: "\\mathbb{C}",
      dd: ["\\frac{d#1}{d#2}", 2],
      pp: ["\\frac{\\partial#1}{\\partial#2}", 2],
      int: "\\int",
      frac: ["\\frac{#1}{#2}", 2],
      sqrt: ["\\sqrt{#1}", 1],
      sum: "\\sum",
      prod: "\\prod",
      lim: "\\lim",
      sin: "\\sin",
      cos: "\\cos",
      tan: "\\tan",
      log: "\\log",
      ln: "\\ln",
      exp: "\\exp"
    }
  },
  svg: {
    fontCache: 'global'
  },
  startup: {
    ready: () => {
      console.log('MathJax is loaded, but not yet initialized');
    },
    typeset: false
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <MathJaxContext config={mathJaxConfig}>
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
