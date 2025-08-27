// src/App.js
import React, { useEffect, useState } from "react";
import Auth from "./components/Auth";
import AntibodyInventory from "./components/AntibodyInventory";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return (
    <div style={{maxWidth:900,margin:"auto",padding:20}}>
      <h1>Antibody Inventory System</h1>
      <Auth user={user} setUser={setUser} />
      {user && <AntibodyInventory />}
      {!user && <div style={{marginTop:"2em",color:"gray"}}>Please sign in to use the inventory.</div>}
    </div>
  );
}
export default App;
