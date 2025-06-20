import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to ping the backend until it responds (handles Render cold start)
    const pingBackend = async () => {
      try {
        const res = await fetch("/ping");
        if (res.ok) {
          setLoading(false);
        } else {
          setTimeout(pingBackend, 1500);
        }
      } catch {
        setTimeout(pingBackend, 1500);
      }
    };
    pingBackend();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        Loading backend, please wait 10-30 seconds for the hosting site to wake up...
      </div>
    );
  }
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
