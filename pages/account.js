import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <p>Please login</p>;

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div style={{ padding: 16 }}>
      <h2>My Account</h2>

      <p><strong>Email:</strong> {user.email}</p>

      <ul>
        <li>My Orders</li>
        <li>Saved Address</li>
      </ul>

      {isAdmin && (
        <>
          <hr />
          <h3>Admin Panel</h3>

          <ul>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/products">Manage Products</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/customers">Customers</Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
        }
