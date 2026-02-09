import { useEffect, useState } from "react";

function App() {
  // Product states
  const [info, setInfo] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [editId, setEditId] = useState(null);

  // User states
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);

  // Base API URLs
  const BASE_URL = "http://localhost:3000/api";
  const PRODUCTS_URL = `${BASE_URL}/products`;
  const AUTH_URL = `${BASE_URL}/auth`;

  // Fetch all products
  const getData = () => {
    fetch(PRODUCTS_URL)
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
  }, []);

  // Register user
  const register = (e) => {
    e.preventDefault();

    fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);

        if (data.user) {
          setRegisteredUser(data.user);
          setUserName("");
          setEmail("");
          setPassword("");
        }
      })
      .catch((err) => console.error(err));
  };

  // Add or update product
  const addProduct = (e) => {
    e.preventDefault();
    if (!registeredUser) return alert("Avval ro'yxatdan o'ting!");

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${PRODUCTS_URL}/${editId}` : PRODUCTS_URL;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        sport,
        userName: registeredUser.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        getData();
        setTitle("");
        setDescription("");
        setSport("");
        setEditId(null);
      })
      .catch((err) => console.error(err));
  };

  // Delete product
  const deleteProduct = (id) => {
    fetch(`${PRODUCTS_URL}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        getData();
      })
      .catch((err) => console.error(err));
  };

  // Edit product
  const editProduct = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setSport(item.sport);
    setEditId(item.id);
  };

  return (
    <div className="container">
      {/* Register */}
      <h2>Ro'yxatdan o'tish</h2>
      <form onSubmit={register} className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Username..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-dark">Register</button>
      </form>

      {/* Add / Edit Product */}
      <h1 className="mt-3">Add Todo</h1>
      <form onSubmit={addProduct}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Sport..."
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Todo List */}
      <h1 className="mt-4">
        {registeredUser && `${registeredUser.name} | `} Todo list
      </h1>
      <ul>
        {info.length > 0 &&
          info.map((item) => (
            <li
              key={item.id}
              className="d-flex align-items-center justify-content-between gap-3 bg-body-secondary p-3 rounded-1"
            >
              <div className="d-flex gap-5 align-items-center">
                <h5>Title: {item.title}</h5>
                <h5>Description: {item.description}</h5>
                <h5>Sport: {item.sport}</h5>
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-warning"
                  onClick={() => editProduct(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteProduct(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
