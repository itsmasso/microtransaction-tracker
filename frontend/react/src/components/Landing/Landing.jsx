import "./Landing.css";

import { useNavigate } from "react-router";
const Landing = () => {
  const navigate = useNavigate();
  const handleGetStartedButton = () => {
    navigate("/login");
  };
  return (
    <div className="landing">
      {/* Hero Section */}

      <section className="landing-body">
        <section className="hero">
          <h1>Track Your Gaming Microtransactions</h1>
          <p>
            Log your games, track your playtime, subscriptions, and
            microtransactions. Analyze your gaming habits with ease.
          </p>
          <button className="blue-button get-started-button" onClick={handleGetStartedButton}>
            Get Started Free
          </button>
        </section>
        {/* Features */}
        <section className="features">
          <div className="site-description">
            <h3>What is Mtx Tracker?</h3>
            <p>
              Log your games, track your playtime, subscriptions, and
              microtransactions.
            </p>
          </div>
          <div className="feature-card">
            <img src="" alt="img" />
            <div>
              <h3>Favorite Your Games</h3>
              <p>
                Mark your top games and build your personal gaming collection.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div>
              <h3>Favorite Your Games</h3>
              <p>
                Mark your top games and build your personal gaming collection.
              </p>
            </div>
            <img src="" alt="img" />
          </div>

          <div className="feature-card">
            <img src="" alt="img" />
            <div>
              <h3>Favorite Your Games</h3>
              <p>
                Mark your top games and build your personal gaming collection.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Landing;
