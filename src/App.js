// src/App.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import React, { useEffect, useState } from "react";
import Auth from "./components/Auth";
import AntibodyInventory from "./components/AntibodyInventory";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [approved, setApproved] = useState(false);
  const [approvalChecked, setApprovalChecked] = useState(false);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (currUser) => {
    setUser(currUser);
    setApprovalChecked(false);
    setApproved(false);

    if (currUser) {
      (async () => {
        const userRef = doc(db, "users", currUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().approved) {
          setApproved(true);
        } else {
          setApproved(false);
        }
        setApprovalChecked(true);
      })();
    }
  });
  return () => unsub();
  }, []);

 return (
  <div style={{maxWidth:900,margin:"auto",padding:20}}>
    <h1>Antibody Inventory System</h1>
    <Auth user={user} setUser={setUser} />
    {user && approvalChecked && approved && <AntibodyInventory />}
    {user && approvalChecked && !approved && (
      <div style={{marginTop:"2em", color:"orange"}}>
        Awaiting admin approval. Please contact the admin for access.
      </div>
    )}
    {!user && <div style={{marginTop:"2em",color:"gray"}}>Please sign in to use the inventory.</div>}
  </div>
  );

}
export default App;
