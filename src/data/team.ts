// Team shown on the About page.
// To add a photo: put the image in /public/team/ using the file name below
// (e.g. public/team/riya.jpg). Until the file exists, initials are shown instead.
// Change `photo` here if your file has a different name or extension.
export interface TeamMember {
  name: string;
  photo: string;
  detail: string;
  // Which part of the photo stays visible when it is cropped to the frame
  // (CSS object-position). Default keeps the top (the head). If a head is still
  // cut, try a smaller second value, e.g. 'center 0%'; if too much empty space
  // above, try 'center 25%'.
  position?: string;
}

export const team: TeamMember[] = [
  { name: 'Riya Singh', photo: '/team/riya.jpg', detail: 'B.Tech CSE (Core)' },
  { name: 'Aman', photo: '/team/aman.jpg', detail: 'B.Tech CSE (Core)' },
  { name: 'Vaseem', photo: '/team/vaseem.jpg', detail: 'B.Tech CSE (Core)' },
];

export const aboutUs =
  "We're three B.Tech Computer Science (Core) students who got tired of solving problem after problem and forgetting them a week later. CodeLoop is what we wanted for ourselves: a place where every solved problem is saved, revised on time, and pushed to GitHub, so practice turns into real learning.";
