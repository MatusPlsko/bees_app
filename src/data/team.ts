export type TeamMember = {
  name: string;
  role: string;
  email: string;
  image: string; // path k obrázku v /public
  linkedin?: string; // zatiaľ nepoužijeme
};

export const teamMembers: TeamMember[] = [
  {
    name: "Adam Grík",
    role: "Student (Software developer)",
    email: "adam4grik@gmail.com",
    image: "/team/grik.jpg",
  },
  {
    name: "Ing. Tomáš Kováčik, Phd.",
    role: "Teacher (Supervisor)",
    email: "tokosk16@gmail.com",
    image: "/team/kovacik.jpg",
  },
  {
    name: "Marek Vatrt",
    role: "Student (Software developer)",
    email: "vatrt@mail",
    image: "/team/user_pic.jpg",
  },
  {
    name: "Matúš Plško",
    role: "Student (Software developer)",
    email: "matusplsko10@gmail.com",
    image: "/team/plsko.jpg",
  },
  {
    name: "Michal Kačinec",
    role: "Student (Hardware developer)",
    email: "miso42850@gmail.com",
    image: "/team/user_pic.jpg",
  },
];
