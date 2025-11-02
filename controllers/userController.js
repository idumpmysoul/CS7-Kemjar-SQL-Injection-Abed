const User = require("../models/userModels");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.createUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }
  if (!username || !username.trim()) {
    errors.push({ field: 'username', message: 'Username is required.' });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email format.' });
    }
  }

  if (!password || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long.' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const newUser = await User.create({ name: name.trim(), username: username.trim(), email, password });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Kode error PostgreSQL untuk unique violation
        return res.status(409).json({ error: "Username or email already exists." });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, email, password } = req.body;
  try {
    const updatedUser = await User.update(id, { name, username, email, password });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.remove(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const errors = [];

    if (!username || !username.trim()) {
        errors.push({ field: 'username', message: 'Username is required.' });
    }
    if (!password) {
        errors.push({ field: 'password', message: 'Password is required.' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const user = await User.findByCredentials(username, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user: { id: user.id, name: user.name, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

exports.getPasswordByCredentials = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await User.findPasswordByCredentials(username, password);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json({ response: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch password" });
  }
};
