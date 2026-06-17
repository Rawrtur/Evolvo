import { icons } from "./icons";

export const tabs = [
  { title: "Home", name: "index", icon: icons.home },
  { title: "Lectures", name: "lectures", icon: icons.activity },
  { title: "Activity", name: "activity", icon: icons.activity },
  { title: "Settings", name: "settings", icon: icons.settings },
];

export const recommendedLectures: Lecture[] = [
  {
    title: "Mathematics",
    icon: "calculator",
    _id: "1234",
    lastLecture: new Date(),
    color: "#c6a465",
    type: "Calculate"
  },
  {
    title: "Theoretical Informatics",
    icon: "calculator",
    _id: "5678",
    lastLecture: new Date(),
    color: "#5ec9d1",
    type: "Theory"
  },
  {
    title: "English",
    icon: "book",
    _id: "9101",
    lastLecture: new Date(),
    color: "#afba63",
    type: "Practise"
  },
];

export const lectures: Lecture[] = [
  {
    title: "Mathematics",
    icon: "calculator",
    _id: "1234",
    lastLecture: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    color: "#f5c542",
    type: "Calculate"
  },
  {
    title: "Theoretical Informatics",
    icon: "calculator",
    _id: "5678",
    lastLecture: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    color: "#e8def8",
    type: "Theory"
  },
  {
    title: "English",
    icon: "book",
    _id: "9101",
    lastLecture: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    color: "#b8d4e3",
    type: "Practise"
  },
];
