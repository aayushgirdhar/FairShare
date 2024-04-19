import "next-auth";

declare module "next-auth" {
  interface User {
    id: integer;
    name: string;
    email: string;
    image: string;
  }
  interface Session {
    user: {
      id: integer;
      name: string;
      email: string;
      image: string;
    };
  }
}
