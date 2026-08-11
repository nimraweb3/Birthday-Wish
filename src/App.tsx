import { useState } from "react";
import Navbar from "./components/Navbar";
import BirthdayIntro from "./components/BirthdayIntro";
import BirthdayBackground from "./components/BirthdayBackground";
import Hero from "./components/Hero";
import MemoryTicker from "./components/MemoryTicker";
import ScrollAudio from "./components/ScrollAudio";

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
          <MemoryTicker />
          <ScrollAudio />
        </>
      )}
    </div>
  );
}

export default App;