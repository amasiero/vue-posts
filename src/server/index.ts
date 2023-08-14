import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';

import { Post, thisMonth, thisWeek, today } from '../posts';
import { NewUser, User } from '../users';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

const allPosts = [today, thisWeek, thisMonth];
const allUsers: User[] = [];

app.get('/posts', (_, res) => res.json(allPosts));

app.post<{}, {}, Post>('/posts', (req, res) => {
  const newPost = { ...req.body, id: (Math.random() * 100000).toFixed() };
  allPosts.push(newPost);
  res.json(newPost);
});

app.put<{}, {}, Post>('/posts', (req, res) => {
  const post = { ...req.body };
  const index = allPosts.findIndex((x) => x.id === post.id);

  if (index === -1) {
    throw Error(`Post ${post.id} not found`);
  }
  const exitingPost = allPosts[index];
  allPosts[index] = { ...exitingPost, ...post };
  res.json(allPosts[index]);
});

const SECRET = 'my-secret';
const TOKEN = 'vuejs-jwt';

const authenticate = (id: string, _req: Request, res: Response) => {
  const token = jsonwebtoken.sign({ id }, SECRET, {
    issuer: 'vue-course',
    expiresIn: '30d',
  });
  res.cookie(TOKEN, token, { httpOnly: true });
};

app.get('/current-user', (req, res) => {
  try {
    const token = req.cookies[TOKEN];
    const result = jsonwebtoken.verify(token, SECRET) as { id: string };
    res.json({ id: result.id });
  } catch (e) {
    res.status(404).end();
  }
});

app.post<{}, {}, NewUser>('/login', (req, res) => {
  const targetUser = allUsers.find((x) => x.username === req.body.username);
  if (!targetUser || targetUser.password !== req.body.password) {
    res.status(401).end();
  } else {
    authenticate(targetUser.id, req, res);
    res.status(200).end();
  }
});

app.post<{}, {}, NewUser>('/users', (req, res) => {
  const user = { ...req.body, id: (Math.random() * 100000).toFixed() };
  allUsers.push(user);
  authenticate(user.id, req, res);
  // it excludes the password from the response and put the rest in newUser
  const { password, ...newUser } = user;
  res.json(newUser);
});

app.post('/logout', (_req, res) => {
  res.cookie(TOKEN, '', { httpOnly: true });
  res.status(200).end();
});

app.listen(8000, () => console.log('Server ready'));
