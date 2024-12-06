import { useState } from "react";
import "./App.css";
import { Calculatrice } from "./component/calculatrice";

function App() {
  const [count, setCount] = useState(0);

  return <Calculatrice />;
}

export default App;
