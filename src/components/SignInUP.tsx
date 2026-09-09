import IntroductionBg from "./IntroductionBg";

export default function SignInUP() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", display: "flex" }}>
      <IntroductionBg isPlaying={true} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "20px", borderRadius: "10px" }}>
          <h1>Sign In / Sign Up</h1>
          {/* Add your sign-in/sign-up form here */}
        </div>
      </div>
    </div>
  );
}