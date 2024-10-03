export type User = {
  id: string;
  email: string;
  image: string | null;
  username: string | null;
};

export type LoaderData = {
  session: any;
  user: User;
};
