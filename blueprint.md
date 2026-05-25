
# Blueprint: Wedding Invitation Website

## **Overview**

This project is a simple, elegant, and modern digital wedding invitation website. It is a single-page application built with HTML, CSS, and JavaScript, featuring a clean design, smooth animations, and interactive elements. The goal is to provide guests with all the necessary information in a beautiful and easily accessible format.

---

## **Project Structure & Design (As-Is)**

### **1. File Structure**
```
/
|-- index.html        # Main HTML file
|-- style.css         # CSS for styling
|-- main.js           # JavaScript for interactivity
|-- images/           # Folder for all images
|   |-- UTK_1722-1sk.jpg (Main Photo)
|   |-- UTK_1026-1sk.jpg (Gallery)
|   |-- UTK_1855.jpg (Gallery)
|   |-- UTK_2428-1.jpg (Gallery)
|   |-- UTK_2948-1sk.jpg (Gallery)
|-- firebase.json
|-- package.json
...
```

### **2. Core Components & Features**

*   **Hero Section:** A full-screen section with a main photo of the couple and the wedding date.
*   **Invitation Card:** A formal invitation text from the couple and their parents.
*   **Contact Information:** Buttons to easily call or message the bride and groom.
*   **Photo Gallery:** A collection of photos. **(Currently broken)**

### **3. Styling & Design**

*   **Fonts:** Uses `Gowun Batang` for headings and `Noto Sans KR` for body text for a classic and readable feel.
*   **Layout:** A single-column, responsive layout centered in the viewport.
*   **Color Scheme:** A simple and elegant color palette.
*   **Dividers:** Simple line dividers separate each section.

---

## **Change Request: Fix Image Gallery**

The user has reported three issues with the photo gallery:
1.  The slide images should be in a separate folder from the main hero image.
2.  The image carousel/slider is not working (images don't change).
3.  The UI for the previous/next slide buttons is broken and misplaced.

## **Plan for Resolution**

### **Step 1: Reorganize Image Directory**
- Create a new directory `images/gallery`.
- Move all gallery images (`UTK_1026-1sk.jpg`, `UTK_1855.jpg`, etc.) into the `images/gallery` folder.
- Keep the main hero image (`UTK_1722-1sk.jpg`) in the root `images` folder.
- Update the `src` paths in `index.html` to reflect this change.

### **Step 2: Fix JavaScript for Gallery Carousel**
- Read `main.js`.
- Implement the logic for the "Previous" and "Next" buttons.
- The logic will update a `currentIndex` variable and use `transform: translateX()` on the `.gallery-carousel` element to create the sliding effect.

### **Step 3: Fix CSS for Gallery Buttons**
- Read `style.css`.
- Make the `.gallery-container` `position: relative`.
- Style the `.prev-btn` and `.next-btn` with `position: absolute` to overlay them on the gallery.
- Adjust the `top`, `left`, and `right` properties to vertically center them and place them on the sides of the gallery.
- Add styling for background, color, and hover effects to make the buttons visually appealing and user-friendly.

