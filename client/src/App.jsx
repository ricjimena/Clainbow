import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import {ClainbowProvider} from "./Context/ClainbowProvider";

function App() {
  return (

    <BrowserRouter>
      <ClainbowProvider>
        <AppRoutes />
      </ClainbowProvider>
    </BrowserRouter>
  );

}

export default App;
