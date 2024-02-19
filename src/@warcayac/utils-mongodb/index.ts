import mongoose from "mongoose";


export async function doConnection() {
  mongoose
    .connection
    .on('error', console.error.bind(console, 'Connection error:'))
    .once('open', function() {
      console.log('Connected to the database');
    })
  ;

  // cuando el usuario pulsa CTRL+C
  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log('Disconnected from the database');
    process.exit();
  });
}
