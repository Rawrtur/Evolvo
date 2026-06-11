import { icons } from "./icons";

export const tabs = [
  { title: "Home", name: "index", icon: icons.home },
  { title: "Activity", name: "activity", icon: icons.activity },
  { title: "Lectures", name: "lectures", icon: icons.activity },
  { title: "Settings", name: "settings", icon: icons.settings },
];

export const recommendedLectures: Lecture[] = [
  {
    title: "Mathematics",
    icon: icons.activity,
    _id: "1234",
    lastLecture: new Date(),
    color: "#c6a465",
  },
  {
    title: "Theoretical Informatics",
    icon: icons.activity,
    _id: "5678",
    lastLecture: new Date(),
    color: "#5ec9d1",
  },
  {
    title: "English",
    icon: icons.activity,
    _id: "9101",
    lastLecture: new Date(),
    color: "#afba63",
  },
];

export const lectures: Lecture[] = [
  {
    title: "Mathematics",
    icon: icons.activity,
    _id: "1234",
    lastLecture: new Date(),
    color: "#c6a465",
  },
  {
    title: "Theoretical Informatics",
    icon: icons.activity,
    _id: "5678",
    lastLecture: new Date(),
    color: "#5ec9d1",
  },
  {
    title: "English",
    icon: icons.activity,
    _id: "9101",
    lastLecture: new Date(),
    color: "#afba63",
  },
];
