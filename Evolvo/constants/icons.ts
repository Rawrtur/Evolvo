import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import back from "@/assets/icons/back.png";
import home from "@/assets/icons/home.png";
import menu from "@/assets/icons/menu.png";
import settings from "@/assets/icons/setting.png";
import lecture from "@/assets/icons/lecture.png"
import feynman from "@/assets/icons/feynman.png"

export const icons = {
    home,
    menu,
    settings,
    back,
    add,
    activity,
    lecture,
    feynman
} as const;

export type IconKey = keyof typeof icons;
