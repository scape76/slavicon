import fs from "fs";
import { openai } from "../src/openai";

const fileSrc = "fine-tuning/veles.jsonl";

async function finetune() {
  console.log(`⏰ Uploading a file ${fileSrc}...`);

  const uploadedFile = await openai.files.create({
    file: fs.createReadStream(fileSrc),
    purpose: "fine-tune",
  });

  console.log(`✅ file ${fileSrc} uploaded`);

  const fineTune = await openai.fineTuning.jobs.create({
    training_file: uploadedFile.id,
    model: "gpt-4o-mini-2024-07-18",
  });

  let events = await openai.fineTuning.jobs.listEvents(fineTune.id, {
    limit: 10,
  });

  console.log(events);
}

finetune()
  .then((res) => {
    console.log("Fine-tuning started. Check for email");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Something went wrong");
    console.log(err);
    process.exit(1);
  });
