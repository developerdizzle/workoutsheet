// https://thefitness.wiki/routines/5-3-1-for-beginners/

const warmupSets = [
    {
        type: "warmup",
        reps: "5",
        percentage: 0.4,
    },
    {
        type: "warmup",
        reps: "5",
        percentage: 0.5,
    },
    {
        type: "warmup",
        reps: "3",
        percentage: 0.6,
    },
];

function generateWorkSets(quantity, reps, percentage) {
    return Array(quantity).fill({
        type: "work",
        reps,
        percentage,
    });
}

const workSets = [
    // week 1
    [
        {
            type: "work",
            reps: "5",
            percentage: 0.65,
        },
        {
            type: "work",
            reps: "5",
            percentage: 0.75,
        },
        {
            type: "work",
            reps: "5+",
            percentage: 0.85,
        },
        ...generateWorkSets(5, 5, 0.65),
    ],
    // week 2
    [
        {
            reps: "3",
            percentage: 0.70,
        },
        {
            reps: "3",
            percentage: 0.80,
        },
        {
            reps: "3+",
            percentage: 0.90,
        },
        ...generateWorkSets(5, 5, 0.70),
    ],
    // week 3
    [
        {
            reps: "5",
            percentage: 0.75,
        },
        {
            reps: "3",
            percentage: 0.85,
        },
        {
            reps: "1+",
            percentage: 0.95,
        },
        ...generateWorkSets(5, 5, 0.75),
    ],
]

export default {
    "days": [
      {
        "name": "Day 1 (Monday)",
        "exercises": [
          {
            "key": "squat",
            "name": "Squats"
          },
          {
            "key": "benchPress",
            "name": "Bench Presses"
          }
        ]
      },
      {
        "name": "Day 2 (Wednesday)",
        "exercises": [
          {
            "key": "deadlift",
            "name": "Deadlifts"
          },
          {
            "key": "overheadPress",
            "name": "Overhead Presses"
          }
        ]
      },
      {
        "name": "Day 3 (Friday)",
        "exercises": [
          {
            "key": "benchPress",
            "name": "Bench Presses"
          },
          {
            "key": "squat",
            "name": "Squats"
          }
        ]
      }
    ],
    "weeks": [
      {
        "name": "Week 1",
        "sets": [
          ...warmupSets,
          ...workSets[0],
        ]
      },
      {
        "name": "Week 2",
        "sets": [
          ...warmupSets,
          ...workSets[1],
        ]
      },
      {
        "name": "Week 3",
        "sets": [
          ...warmupSets,
          ...workSets[2],
        ]
      }
    ],
    "assistance": [
      {
        "name": "Push",
        "exercises": [
          "Dips",
          "Pushups",
          "Flat DB Bench",
          "Incline DB Bench",
          "DB OHP",
          "Tricep Extension",
          "Tricep Pushdown"
        ]
      },
      {
        "name": "Pull",
        "exercises": [
          "Chinups",
          "Pullups",
          "Inverted Rows",
          "DB Rows",
          "Cable Rows",
          "Machine Rows",
          "Face Pulls",
          "Band Pull-Aparts",
          "Lat Pulldowns",
          "Curls"
        ]
      },
      {
        "name": "Core/leg",
        "exercises": [
          "Ab/Core",
          "Back Raises",
          "Reverse Hypers",
          "Lunges",
          "Step Ups",
          "Bulgarian Split Squats",
          "KB Snatches",
          "KB Swings"
        ]
      }
    ]
  }