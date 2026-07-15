import { icons } from "./icons";

export const tabs = [
  { title: "Home", name: "index", icon: icons.home },
  { title: "Lectures", name: "lectures", icon: icons.activity },
  { title: "Activity", name: "activity", icon: icons.activity },
  { title: "Settings", name: "settings", icon: icons.settings },
];

export const flows = {
  "30 min": [ // 30 min
    "Focus", "Review"
  ],
  "60 min": [ // 60 min
    "Focus", "Break", "Focus", "Review"
  ],
  "90 min": [ // 90 min
    "Pre Study Reset","Focus", "Break", "Focus", "Break", "Focus", "Review"
  ],
  "120 min": [ // 120 min
    "Pre Study Reset", "Focus", "Break", "Focus", "Review"
  ],
  "150 min": [ // 150 min
    "Pre Study Reset", "Focus", "Break", "Focus", "Break", "Focus", "Review"
  ],
  "180 min": [ // 180 min
    "Pre Study Reset", "Focus", "Break", "Focus", "Break", "Focus",  "Review"
  ]
}
export const times = {
  "30 min": [ // 30 min
    25, 5
  ],
  "60 min": [ // 60 min
    25, 5, 25, 5
  ],
  "90 min": [ // 90 min
    1, 25, 5, 25, 5, 24, 5
  ],
  "120 min": [ // 120 min
    1, 50, 10, 49, 10
  ],
  "150 min": [ // 150 min
    1, 50, 10, 50, 10, 24, 5
  ],
  "180 min": [ // 180 min
    1, 50, 10, 50, 10, 49, 10
  ]
}

export const profileSettings = [
  {text: "Change Email", route: "ChangeEmail", icon:"mail"},
  {text: "Change Password", route: "ChangePassword", icon:"lock-closed"},
  {text: "Change Name", route: "ChangeName", icon:"at-sharp"},
  // {text: "Delete Account", route: "DeleteAccount", icon:"trash"},
]

export const subscriptionSettings = [
  {text: "View Subscriptions", route: "ViewSubscription", icon:"bag"},
  {text: "Cancel Subscription", route: "CancelSubscription", icon:"ban-outline"},
]

export const emailSettings = [
  {text: "Allow Newsletter", route: "AllowNewsletter", icon:"newspaper"},

]