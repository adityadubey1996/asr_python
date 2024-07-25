import {
    faFile,
    faMoneyBill,
    faPerson,
    faTasks,
  } from "@fortawesome/free-solid-svg-icons";

export const constants = {
    // STATUS_PENDING:"pending",
    // STATUS_CANCELLED:"cancelled",
    // STATUS_APPROVE:"approve",
    // SIDEBAR_FILES:"My Files",
    SIDEBAR_RECORDINGS:'Recordings',
    // SIDEBAR_DASHBOARD:"Dashboard",
    // SIDEBAR_TASK_MANAGER:"Task Manager",
    SIDEBAR_SETTINGS:"Settings",
    // SIDEBAR_REFER_AND_EARN:"Refer & Earn",
    SIDEBAR_TRANSCRIPTIONS:'Transcriptions',
    SIDEBAR_WORKFLOW: 'Workflow'
}

export const sidebarItems = [
    {
        title: 'Recordings',
        route: '/recordings',
        icon: faFile,
    },
    {
        title: 'Transcriptions',
        route: '/transcriptions',
        icon: faMoneyBill,
    },
    {
        title: 'Workflow',
        route: '/workflow',
        icon: faTasks,
    },
    {
        title: 'Settings',
        route: '/settings',
        icon: faPerson,
    }
];

export const questions = [
    {
      id: 1,
      text: "What is the primary purpose of this recording?",
      options: ["Training/Educational", "Meeting/Conversation", "Presentation", "Compliance Review", "Other"],
      type: "single-choice",
      optionsRequiringFollowUp: ["Other"], // Specify options that need follow-up
      followUpQuestion: "Please specify:",
      followUpType: "text"
    },
    {
      id: 2,
      text: "Is this recording related to a specific industry or domain?",
      type: "boolean",
      options: ["Yes", "No"],
      followUp: true,
      optionsRequiringFollowUp: ["Yes"],
      followUpQuestion: "If yes, please specify the industry:",
      followUpType: "text"
    },
    {
      id: 3,
      text: "Approximately how many speakers are involved in this recording?",
      type: "text",
      placeholder: "Enter a number"
    },
    {
      id: 4,
      text: "Would you like us to analyze the content for any specific compliance requirements?",
      type: "boolean",
      options: ["Yes", "No"],
      followUp: true,
      followUpCondition: ["Yes"],
      optionsRequiringFollowUp: ["Yes"],
      followUpQuestion: "If yes, please specify the compliance requirements:",
      followUpType: "text"
    },
    {
        id: 5,
        text: "Select the types of analysis you would like us to perform on the recording:",
        options: [
          "Speaker talk time ratios — Analyze the proportion of talk time per participant.",
          "Key topics discussed — Identify main topics covered in the conversation.",
          "Sentiment analysis — Assess the sentiment (positive, neutral, negative) of each speaker.",
          "Compliance issue tracking — Highlight potential compliance risks or violations mentioned.",
          "Custom analysis — Specify any additional or particular insights you need."
        ],
        type: "multi-choice",
        optionsRequiringFollowUp: ["Custom analysis — Specify any additional or particular insights you need.", "Speaker talk time ratios — Analyze the proportion of talk time per participant.", "Key topics discussed — Identify main topics covered in the conversation.", "Sentiment analysis — Assess the sentiment (positive, neutral, negative) of each speaker.", "Compliance issue tracking — Highlight potential compliance risks or violations mentioned."],
        followUpQuestion: "Please describe the custom analysis you need:",
        followUpType: "text"
      },
      {
        id: 6,
        text: "Let's give the template a name before creating it",
        type: "text",
        placeholder: "Enter a Name",
        doNotShowOnEditMode: true,
      },
  ];

