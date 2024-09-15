import { useState } from "react";

import "./App.css";
import APPRouter from "./APPRouter";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <APPRouter />
    </>
  );
}

export default App;
