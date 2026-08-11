import { useState } from "react";
import Navbar from "./components/Navbar";
import BirthdayIntro from "./components/BirthdayIntro";
import BirthdayBackground from "./components/BirthdayBackground";
import Hero from "./components/Hero";
import MusicPlayer from "./components/MusicPlayer";

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="min-h-screen text-white">
      {!introDone && (
        <BirthdayIntro
          name="Azeen"
          onComplete={function () {
            setIntroDone(true);
          }}
        />
      )}

      {introDone && (
        <>
          <BirthdayBackground />
          <Navbar instagramUrl="https://instagram.com/azeen_username" />
          <Hero />
          <MusicPlayer />
        </>
      )}
    </div>
  );
}

export default App;