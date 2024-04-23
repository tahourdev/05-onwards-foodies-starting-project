import fs from 'node:fs'; // Importing the file system module for handling file operations.
import sql from 'better-sqlite3'; // Importing the better-sqlite3 library for working with SQLite databases.
import slugify from 'slugify'; // Importing the slugify library to generate URL-friendly slugs.
import xss from 'xss'; // Importing the xss library for sanitizing user input to prevent XSS attacks.
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: 'ap-southeast-2',
});

const db = sql('meals.db'); // Creating a SQLite database connection.

// Function to asynchronously fetch all meals from the database.
export async function getMeal() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Adding a delay to simulate initial loading time during data fetching.
  // throw new Error('Failed to fetch data!'); // Example error throwing (commented out).
  return db.prepare('SELECT * FROM meals').all(); // Retrieving all records from the 'meals' table.
}

// Function to get a specific meal from the database based on its slug.
export function getMeals(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug); // Retrieving a meal based on its slug.
}

// Function to asynchronously save a meal to the database.
// export async function saveMeal(meal) {
//   // Generating a URL-friendly slug for the meal title.
//   meal.slug = slugify(meal.title, { lower: true });

//   // Sanitizing the meal instructions to prevent XSS attacks.
//   meal.instructions = xss(meal.instructions);

//   // Extracting file extension from the uploaded image.
//   const extension = meal.image.name.split('.').pop();
//   console.log(extension);

//   // Generating a filename based on the slug and file extension.
//   const fileName = `${meal.slug}.${extension}`;

//   // Creating a write stream to save the image file.
//   const stream = fs.createWriteStream(`public/images/${fileName}`);

//   // Converting the image to a buffer.
//   const bufferedImage = await meal.image.arrayBuffer();

//   // Writing the image buffer to the file stream.
//   stream.write(Buffer.from(bufferedImage), (error) => {
//     if (error) {
//       throw new Error('Saving Image Failed!');
//     }
//   });

//   // Updating the meal object with the path to the saved image.
//   meal.image = `/images/${fileName}`;

//   // Inserting the meal data into the 'meals' table.
//   db.prepare(
//     `
//     INSERT INTO meals
//     (title, summary, instructions, creator, creator_email, image, slug)
//     VALUES (
//       @title,
//       @summary,
//       @instructions,
//       @creator,
//       @creator_email,
//       @image,
//       @slug
//     )
//     `
//   ).run(meal);
// }

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  s3.putObject({
    Bucket: 'foody-bucket',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal);
}
