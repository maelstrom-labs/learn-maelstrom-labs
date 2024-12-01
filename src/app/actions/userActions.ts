// app/actions/userActions.ts
'use server';

import db from '../db/database';

interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all() as User[];
}

export async function handleSubmit(formData: FormData): Promise<void> {
  const name = formData.get('name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';

  if (!name || !email) {
    throw new Error('Name and Email are required.');
  }

  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  stmt.run(name, email);
}
