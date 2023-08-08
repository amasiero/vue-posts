import { DateTime } from 'luxon';

export interface Post {
  id: string;
  title: string;
  authorId: string;
  createdAt: string;
  markdown: string;
  html: string;
}

export interface TimelinePost extends Omit<Post, 'createdAt'> {
  createdAt: DateTime;
}

export const today: Post = {
  id: '1',
  authorId: '-1',
  title: 'Today',
  createdAt: DateTime.now().toISO(),
  markdown: '',
  html: '',
};

export const thisWeek: Post = {
  id: '2',
  authorId: '-1',
  title: 'This Week',
  createdAt: DateTime.now().minus({ days: 5 }).toISO(),
  markdown: '',
  html: '',
};

export const thisMonth: Post = {
  id: '3',
  authorId: '-1',
  title: 'This Month',
  createdAt: DateTime.now().minus({ weeks: 3 }).toISO(),
  markdown: '',
  html: '',
};
