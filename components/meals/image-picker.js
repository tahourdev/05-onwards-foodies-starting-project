'use client';
import { useRef, useState } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(null);
  const imageInput = useRef();

  function handleClick() {
    imageInput.current.click();
  }

  function handleImageChange(e) {
    // Retrieve the selected file from the input field.
    const file = e.target.files[0];

    // Check if a file was selected. If not, clear the picked image state and exit.
    if (!file) {
      setPickedImage(null); // Assuming this function sets the state for the picked image.
      return;
    }

    // Create a new FileReader object to read the selected file.
    const fileReader = new FileReader();

    // Define an onload event handler for when the file reading is completed.
    fileReader.onload = () => {
      // When the file reading is completed, set the picked image state to the result of the file reading,
      // which will be a data URL representing the selected image.
      setPickedImage(fileReader.result); // Assuming this function sets the state for the picked image.
    };

    // Read the selected file as a data URL. This will trigger the onload event when completed.
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}{' '}
          {pickedImage && <Image src={pickedImage} alt="The image selected by the user." fill />}
        </div>
        <input
          ref={imageInput}
          className={classes.input}
          type="file"
          id={name}
          name={name}
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
          required
        />
        <button className={classes.button} type="button" onClick={handleClick}>
          Pick an Image
        </button>
      </div>
    </div>
  );
}
