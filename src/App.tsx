import { useState } from "react";

import BirthdayIntro from "./components/BirthdayIntro";
import BirthdayBackground from "./components/BirthdayBackground";
import Navbar from "./components/Navbar";
import WishCards from "./components/WishCards";
import MusicPlayer from "./components/MusicPlayer";

function App() {
  const [introFinished, setIntroFinished] =
    useState(false);

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[#0c0708]
      "
    >
      {/* =========================================
          FRIEND PHOTO BACKGROUND
      ========================================= */}

      <BirthdayBackground
        visible={introFinished}
      />

      {/* =========================================
          MAIN WEBSITE
      ========================================= */}

      {introFinished && (
        <div
          className="
            relative
            z-10
            min-h-screen
          "
        >
          {/* NAVBAR */}

          <Navbar />

          {/* WISH CARDS */}

          <WishCards />

          {/* MUSIC PLAYER */}

          <MusicPlayer />
        </div>
      )}

      {/* =========================================
          BIRTHDAY INTRO
      ========================================= */}

      {!introFinished && (
        <BirthdayIntro
          onComplete={() => {
            setIntroFinished(true);
          }}
        />
      )}
    </main>
  );
}

export default App;