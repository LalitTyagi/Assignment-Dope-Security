
import fs from 'fs';

const LOCATIONS = ["Konoha", "Suna", "Kiri", "Iwa", "Kumo"];
const HEALTH_STATUS = ["Healthy", "Injured", "Critical"];

const generateData = () => {
  const characters = [];
  for (let i = 0; i < 1200; i++) {
    characters.push({
      id: `npc-${i + 1}-${Math.random().toString(36).substr(2, 5)}`,
      name: `Ninja ${i + 1}`,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      health: HEALTH_STATUS[Math.floor(Math.random() * HEALTH_STATUS.length)],
      power: Math.floor(Math.random() * (10000 - 100 + 1)) + 100,
      viewed: false 
    });
  }
  
  const db = { characters };
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  console.log('db.json generated with 1200 entries');
};

generateData();
