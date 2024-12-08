import { useState } from "react";
import "./App.css";
import { Calculatrice } from "./component/Calculatrice";

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="h-96 w-96 flex">
        <Calculatrice />
      </div>
    </div>
  );
}

export default App;
