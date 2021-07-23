import easymidi from "easymidi";
import robot from "robotjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const inputs = easymidi.getInputs();
const input = new easymidi.Input(inputs[0]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyMapPath = process.argv[2] || path.resolve(__dirname, "./keyMap.json");
const keyMap = JSON.parse(fs.readFileSync(keyMapPath), { encoding: "utf8" });

console.log("11x 🥷🏽 Engineer Level Activated! 😎");

const specialKeys = ["shift", "control", "command"];
const specialKeyPressMap = specialKeys.reduce(
  (acc, curr) => ({ ...acc, [curr]: false }),
  {}
);

input.on("noteon", (msg) => {
  const key = keyMap[msg.note];

  if (!key) return;

  if (specialKeys.includes(key)) {
    specialKeyPressMap[key] = true;
    robot.keyToggle(key, "down");
  } else {
    const pressedSpecialKeys = Object.entries(specialKeyPressMap).reduce(
      (acc, [note, pressed]) => (pressed ? [...acc, note] : acc),
      []
    );

    robot.keyTap(key, pressedSpecialKeys);
  }
});

input.on("noteoff", (msg) => {
  const key = keyMap[msg.note];

  if (!key) return;

  if (specialKeys.includes(key)) {
    specialKeyPressMap[key] = false;
    robot.keyToggle(key, "up");
  }
});

input.on("pitch", (msg) => {
  specialKeyPressMap["shift"] = msg.value === 0;
});
