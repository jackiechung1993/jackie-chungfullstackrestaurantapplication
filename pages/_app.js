import { useState, useEffect } from "react";
import Head from "next/head";
import AppContext from "../components/context";
import Layout from "../components/layout";
import Cookie from "js-cookie";
import { logout } from "../components/auth";

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user cookie
    const token = Cookie.get("token");
    if (token) {
      // If token exists, set user from cookie
      fetch("http://localhost:1337/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          setUser(user);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, []);

  const addItem = (item) => {
    let { items } = cart;
    let foundItem = items.find((i) => i.id === item.id);

    if (foundItem) {
      foundItem.quantity += 1;
      setCart({
        items: items.map((i) => (i.id === foundItem.id ? foundItem : i)),
        total: cart.total + item.price,
      });
    } else {
      let newItem = { ...item, quantity: 1 }; // Create a new object and set quantity
      setCart({
        items: [...items, newItem],
        total: cart.total + item.price,
      });
    }
  };

  const removeItem = (item) => {
    let { items } = cart;
    let foundItem = items.find((i) => i.id === item.id);

    if (foundItem.quantity > 1) {
      foundItem.quantity -= 1;
      setCart({
        items: items.map((i) => (i.id === foundItem.id ? foundItem : i)),
        total: cart.total - item.price,
      });
    } else {
      setCart({
        items: items.filter((i) => i.id !== item.id),
        total: cart.total - item.price,
      });
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ cart, addItem, removeItem, user, setUser, logoutUser }}>
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;

