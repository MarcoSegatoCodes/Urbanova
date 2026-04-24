import { Button } from "@mui/material";
import { AccountBoxSharp } from "@mui/icons-material";
import ServiceTests from "./components/ServiceTests";

function App() {
  return (
    <>
      <Button variant="contained">
        <AccountBoxSharp />
        Hello
      </Button>

      <ServiceTests />
    </>
  );
}

export default App;
