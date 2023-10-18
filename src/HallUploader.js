// Import the functions you need from the SDKs you need
import { db } from './firebase'; // Assuming you have a 'firebase.js' file for Firebase initialization

// Your hall data
const academicHalls = [
  { id: 1, name: 'Hall 213', venue: 'Academic Block, 1st Floor', seating: 70 },
  { id: 2, name: 'Hall 210', venue: 'Academic Block, 1st Floor', seating: 70   },
  { id: 3, name: 'Hall 310/A1', venue: 'Academic Block, 2nd Floor', seating: 70   },
  { id: 4, name: 'Hall 310/B1', venue: 'Academic Block, 2nd Floor', seating: 70   },
  { id: 5, name: 'Hall 410/A1', venue: 'Academic Block, 3rd Floor', seating: 70  },
  { id: 6, name: 'Hall 410/B1', venue: 'Academic Block, 3rd Floor', seating: 70  },
  { id: 7, name: 'Hall 510/A1', venue: 'Academic Block, 4th Floor', seating: 70  },
  { id: 8, name: 'Hall 510/B1', venue: 'Academic Block, 4th Floor', seating: 70  },
  { id: 9, name: 'Hall 610', venue: 'Academic Block, 5th Floor', seating: 70  },
  { id: 10, name: 'Hall 612', venue: 'Academic Block, 5th Floor', seating: 70  },
  { id: 11, name: 'Hall 522', venue: 'Lab Block, 4th Floor', seating: 70  },
  { id: 12, name: 'Hall 523', venue: 'Lab Block, 4th Floor', seating: 70  },
  { id: 13, name: 'Hall 524', venue: 'Lab Block, 4th Floor', seating: 70  },
  { id: 14, name: 'Hall 525', venue: 'Lab Block, 4th Floor', seating: 70  },
  { id: 15, name: 'Hall 526', venue: 'Lab Block, 4th Floor', seating: 70  },
  { id: 16, name: 'Hall 527', venue: 'Lab Block, 4th Floor', seating: 70  },
  { id: 17, name: 'Hall 417 A', venue: 'Lab Block, 3rd Floor', seating: 70  },
  { id: 18, name: 'Hall 417 B', venue: 'Lab Block, 3rd Floor', seating: 70  },
  { id: 19, name: 'Hall 217 D', venue: 'Lab Block, 1st Floor', seating: 70  },
  { id: 20, name: 'Hall 217 D1', venue: 'Lab Block, 1st Floor', seating: 70  },
  { id: 21, name: 'Hall 217 B2', venue: 'Lab Block, 1st Floor', seating: 70  },
  { id: 22, name: 'Hall 619 C', venue: 'Lab Block, 5th Floor', seating: 70  },
  { id: 23, name: 'Hall 619 D', venue: 'Lab Block, 5th Floor', seating: 70  },
  { id: 24, name: 'Hall 619 E', venue: 'Lab Block, 5th Floor', seating: 70  },
  // Add the rest of the academic halls
];

const admissionHalls = [
  { id: 1, name: 'Hall 453', venue: 'Admission Block, 3rd Floor', seating: 70 },
  { id: 2, name: 'Placement Hall / Sir CV raman Hall', venue: 'Admission Block, 2nd Floor', seating: 250 },
  { id: 3, name: 'CDIO Hall', venue: 'Admission Block, 2nd Floor', seating: 250},
  { id: 4, name: 'Yoga Hall', venue: 'Admission Block, 3rd Floor', seating: 250 },
  { id: 5, name: 'Board Room', venue: 'Admission Block, Ground Floor', seating: 15},
  { id: 5, name: 'IQAC Board Room', venue: 'Academic Block, Ground Floor', seating: 25}
  // Add the rest of the admission halls
];

// Function to upload data to Firestore
async function uploadHallsToFirestore(halls, collection) {
  for (const hall of halls) {
    try {
      await collection.add(hall);
      console.log(`Uploaded ${hall.name} to Firestore`);
    } catch (error) {
      console.error(`Error uploading ${hall.name}: ${error}`);
    }
  }
}

// Upload academic halls to Firestore
uploadHallsToFirestore(academicHalls, db.collection('halls'));

// Upload admission halls to Firestore
uploadHallsToFirestore(admissionHalls, db.collection('halls'));
