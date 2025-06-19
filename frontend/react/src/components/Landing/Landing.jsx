import "./Landing.css";
import gamesImage from "../../assets/games-library.png";
import transactionsImage from "../../assets/my-purchases.png";
import trendsImage from "../../assets/trends.png";
import gameCollageBG from "../../assets/game-collage.webp";
import { useNavigate } from "react-router";
const Landing = () => {
  const navigate = useNavigate();
  const handleGetStartedButton = () => {
    navigate("/login");
  };
  return (
    <div className="landing">
      <div className="fade-background-wrapper">
        <img
          src={gameCollageBG}
          alt="Fading Background"
          className="background-fade-img"
        />
        <div className="image-tint" />
        <div className="fade-overlay" />
      </div>
      {/* Hero Section */}

      <section className="landing-body">
        <section className="hero">
          <h1>Track Your Gaming Microtransactions</h1>
          <p>
            Log your games, track your playtime, subscriptions, and
            microtransactions. Analyze your gaming habits with ease.
          </p>
          <button
            className="blue-button get-started-button"
            onClick={handleGetStartedButton}
          >
            Get Started Free
          </button>
        </section>
        {/* Features */}
        <section className="features">
          <div className="site-description">
            <h3>What is Mtx Tracker?</h3>
            <p>
              MTX Tracker is a free website that helps you monitor your gaming
              spending habits by letting you log games, add purchases, and track
              active subscriptions.
            </p>
          </div>
          <div className="feature-card">
            <img src={gamesImage} alt="games library img" />
            <div>
              <h3>Track Expenses & Subscriptions</h3>
              <p>
                Add games to your library and start tracking your spending. Each
                game acts as a hub for your expenses and subscriptions.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <img src={transactionsImage} alt="user transactions img" />
            <div>
              <h3>View Your Transactions</h3>
              <p>
                Browse all of your microtransactions in one place. Search,
                filter, and sort your expenses by game or type.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <img src={trendsImage} alt="user spending graphs img" />
            <div>
              <h3>Visualize Your Spending</h3>
              <p>
                Explore your trends with monthly breakdowns. Find out where your
                money’s going and which games take the most.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Landing;
