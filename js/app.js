




// Create a new Database to hold text
let db = new Dexie("TextDatabase");

// Declare the schema for your new database table named "text"
db.version(1).stores({
  text: "++id, content, timestamp"
});

// Textarea element
const textarea = document.querySelector("#textarea");



// Listen for the play button click event
playButton.addEventListener("click", saveTextToDatabase);

// Function to save text to the Dexie.js database
async function saveTextToDatabase() {
  let text = textarea.value.trim();

  // Check if the textarea has content
  if (text !== "") {
    const timestamp = new Date();

    // Check if there are more than 5 objects in the database
    const count = await db.text.count();

    if (count >= 5) {
      // Clear the object store if there are more than 5 objects
      await db.text.clear();
      console.log("Cleared the object store");
    }

    // Add text to the Dexie.js database with a timestamp
    await db.text.add({
      content: text,
      timestamp: timestamp
    });

    // Show a notification or perform any other action if needed
    console.log("Text saved to the database");
  }
}

//Function to retrieve and display the latest text from the database
async function displayLatestText() {
  // Retrieve the latest text from the database
  let latestText = await db.text.orderBy('timestamp').last();

  // Update the textarea with the latest text
  textarea.value = latestText ? latestText.content : "";
}

// Call the function to display the latest text on page load
displayLatestText();


