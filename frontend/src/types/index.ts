export type User = {
  id: string;
  email: string;
  image: string | null;
  username: string | null;
};

export type GodInfo = Record<string, Record<string, string>>;

export type God = {
  name: string;
  knownAs: string;
  description: string;
  information: GodInfo;
  image: string;
};

export type LoaderData = {
  session: any;
  user: User;
};

export type Result<D> = {
  data: D;
};
