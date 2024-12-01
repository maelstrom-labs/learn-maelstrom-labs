// app/page.tsx
import { handleSubmit, getUsers } from './actions/userActions';

export default async function Home() {
  const users = await getUsers(); // Fetch all users from the database

  return (
    <div>
      <h1>Next.js 14 + SQLite Example</h1>

      {/* Form to Add User */}
      <form action={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Add User</button>
      </form>

      {/* Display Users in a Table */}
      <h2>Users List</h2>
      {users.length > 0 ? (
        <table border={1} style={{ marginTop: '20px', width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found. Add some!</p>
      )}
    </div>
  );
}
