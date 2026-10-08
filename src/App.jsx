import { Routes, Route, Navigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Members from "./pages/Members";
import Requests from "./pages/Requests";

const DEFAULT_USERS = [{ name: "Admin", membershipId: "901020581", password: "NTLAMA", role: "admin" }];
const DEFAULT_BOOKS = [
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", isbn: "9780061120084", qty: 4 },
  { title: "1984", author: "George Orwell", genre: "Dystopian", isbn: "9780451524935", qty: 1 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", isbn: "9780743273565", qty: 3 },
];

export default function App() {
  // Same localStorage keys as the original app
  const [users, setUsers] = useLocalStorage("users", DEFAULT_USERS);
  const [books, setBooks] = useLocalStorage("books", DEFAULT_BOOKS);
  const [pending, setPending] = useLocalStorage("pendingRequests", []);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [current, setCurrent] = useLocalStorage("currentUser", null);

  if (!current) {
    return (
      <div className="screen-border">
        <Login users={users} pending={pending} setPending={setPending} onLogin={setCurrent} />
      </div>
    );
  }

  const admin = current.role === "admin";

  return (
    <div className="screen-border">
      <Layout user={current} pendingCount={pending.length} onLogout={() => setCurrent(null)}>
        <Routes>
          <Route path="/" element={<Dashboard books={books} user={current} />} />
          <Route path="/books" element={<Books books={books} setBooks={setBooks} user={current} />} />
          <Route path="/transactions" element={
            <Transactions books={books} setBooks={setBooks} transactions={transactions} setTransactions={setTransactions} user={current} />} />
          {admin && <Route path="/members" element={<Members users={users} setUsers={setUsers} current={current} setCurrent={setCurrent} />} />}
          {admin && <Route path="/requests" element={<Requests pending={pending} setPending={setPending} users={users} setUsers={setUsers} />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}
