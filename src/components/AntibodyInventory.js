// src/components/AntibodyInventory.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

function generateUniqueCode(existingCodes) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = "";
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (existingCodes.has(code));
  return code;
}

export default function AntibodyInventory() {
  const [antibodies, setAntibodies] = useState([]);
  const [allCodes, setAllCodes] = useState(new Set());
  const [form, setForm] = useState({
    name: "",
    company: "",
    companyLink: "",
    datePurchased: "",
    dilution: "",
    tags: "",
    application: "",
    productPage: ""
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAntibodies();
    //eslint-disable-next-line
  }, []);

  async function fetchAntibodies() {
    const querySnapshot = await getDocs(collection(db, "antibodies"));
    const abs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setAntibodies(abs);
    setAllCodes(new Set(abs.map(ab => ab.uniqueCode)));
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.datePurchased) return;
    const tagsArr = [...form.tags.split(",").map(t=>t.trim()).filter(Boolean), ...form.application.split(",").map(t=>t.trim()).filter(Boolean)];
    const uniqueCode = generateUniqueCode(allCodes);
    await addDoc(collection(db, "antibodies"), {
      name: form.name,
      company: form.company,
      companyLink: form.companyLink,
      datePurchased: form.datePurchased,
      dilution: form.dilution,
      tags: tagsArr,
      productPage: form.productPage,
      uniqueCode
    });
    setForm({ name: "", company: "", companyLink: "", datePurchased: "", dilution: "", tags: "", application: "", productPage: "" });
    fetchAntibodies();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "antibodies", id));
    fetchAntibodies();
  };

  function matches(ab, query) {
    const q = query.toLowerCase();
    return (
      ab.name.toLowerCase().includes(q) ||
      ab.company.toLowerCase().includes(q) ||
      ab.dilution.toLowerCase().includes(q) ||
      ab.uniqueCode.toLowerCase().includes(q) ||
      ab.tags.join(",").toLowerCase().includes(q) ||
      ab.productPage?.toLowerCase().includes(q) ||
      ab.companyLink?.toLowerCase().includes(q)
    );
  }

  return (
    <div>
      <h2>Add/Update Antibody</h2>
      <form onSubmit={handleAdd}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        <input name="companyLink" placeholder="Company Link" value={form.companyLink} onChange={handleChange} />
        <input name="productPage" placeholder="Product Page Link" value={form.productPage} onChange={handleChange} />
        <input name="datePurchased" type="date" placeholder="Date Purchased" value={form.datePurchased} onChange={handleChange} required />
        <input name="dilution" placeholder="Working Dilution" value={form.dilution} onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
        <input name="application" placeholder="Applications (comma separated)" value={form.application} onChange={handleChange} />
        <button type="submit">Add Antibody</button>
      </form>
      <h3>Search</h3>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ANY property" />
      <table border="1" cellPadding="6" style={{marginTop:"1em"}}>
        <thead>
          <tr>
            <th>Name</th><th>Company</th><th>Date Purchased</th><th>Dilution</th><th>Tags</th><th>Product Page</th><th>Unique Code</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {antibodies.filter(ab => !search || matches(ab, search)).map(ab => (
            <tr key={ab.id}>
              <td>{ab.name}</td>
              <td>{ab.company}</td>
              <td>{ab.datePurchased}</td>
              <td>{ab.dilution}</td>
              <td>{ab.tags.join(", ")}</td>
              <td><a href={ab.productPage || ab.companyLink} target="_blank" rel="noopener noreferrer">Link</a></td>
              <td>{ab.uniqueCode}</td>
              <td><button onClick={()=>handleDelete(ab.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
