# WebToolKit - Group Project

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A collaborative class project to build a multi-page website featuring a functional calculator and an interactive phonebook.

**Live Demo:** (Link will be added here after deployment)

---

## 📋 Project Overview

Welcome, developers! This repository is for our class project. Our goal is to build a website called **WebToolKit** that houses two main web applications:
1.  **A Calculator:** For basic arithmetic operations.
2.  **A Phonebook:** To add, search, and manage contacts.

The website will have a consistent navigation bar and a homepage with a dynamic image slideshow.

## 👥 Team Structure & Responsibilities

We have four teams. Find your team below and focus on your deliverables.

### **Team 1: Navigation & Homepage**
**Tech:** HTML, CSS
**Tasks:**
1.  Create the main `index.html` (Homepage).
2.  Create a consistent **navigation bar** (`<nav>`) with links to `Home`, `Calculator`, `Phonebook`, and `About Us`. This nav bar must appear on every page.
3.  Create a **welcome message** on the homepage: "Welcome to WebToolKit! We offer a simple calculator and a digital phonebook to manage your contacts."
4.  Create a **footer** for all pages.
5.  Set up the HTML structure for the **image slideshow** (a `<div>` with several `<img>` tags). Team 4 will make it dynamic.
6.  Write all the CSS in `css/style.css` to make the site look clean and professional.

**Files to work on:** `index.html`, `about.html`, `css/style.css`

---

### **Team 2: Calculator Team**
**Tech:** HTML, CSS, JavaScript
**Tasks:**
1.  Create `calculator.html`.
2.  Build the calculator's user interface using HTML (buttons for numbers 0-9, operations `+`, `-`, `*`, `/`, `=`, and a clear `C` button).
3.  Add a display area (e.g., an `<input type="text">` or a `<div>`) to show the current input and result.
4.  Style the calculator with CSS to make it look user-friendly.
5.  Write the logic in `js/calculator.js` to make the calculator perform basic math operations.

**Files to work on:** `calculator.html`, `js/calculator.js`, `css/style.css`

---

### **Team 3: Phonebook Team**
**Tech:** HTML, CSS, JavaScript
**Tasks:**
1.  Create `phonebook.html`.
2.  Build a form to **add a new contact** (fields for "Name" and "Phone Number", an "Add" button).
3.  Build a **search bar** to filter the contact list.
4.  Build a list (e.g., `<ul>`) to **display all contacts**.
5.  Style the phonebook with CSS.
6.  Write the logic in `js/phonebook.js` to:
    *   Add a new contact to the list.
    *   Save the contacts to the browser's `localStorage`.
    *   Load saved contacts when the page is opened.
    *   Filter the displayed contacts based on the search input.
    *   Add a feature to **delete a contact**.

**Files to work on:** `phonebook.html`, `js/phonebook.js`, `css/style.css`

---

### **Team 4: Dynamic Content & Polish**
**Tech:** JavaScript, CSS
**Tasks:**
1.  Implement the **automatic image slideshow** on the homepage.
2.  Write JavaScript to make the **navigation bar highlight the current page** (e.g., the "Home" link is bold or a different color when you are on `index.html`).
3.  Help other teams with their JavaScript code and debug issues.
4.  Add smooth animations or hover effects (e.g., for buttons) to improve the user experience.

**Files to work on:** `js/main.js` (for nav highlighting), `index.html` (for slideshow logic), `css/style.css` (for animations)

---

## 🗂️ Project File Structure
      webtoolkit-project/
      ├── index.html          # Homepage (Team 1)
      ├── calculator.html     # Calculator App (Team 2)
      ├── phonebook.html      # Phonebook App (Team 3)
      ├── about.html          # About Us page (Team 1)
      ├── css/
      │   └── style.css       # All styles for the site (All Teams)
      ├── js/
      │   ├── main.js         # Common JS (e.g., nav highlight) (Team 4)
      │   ├── calculator.js   # Calculator logic (Team 2)
      │   └── phonebook.js    # Phonebook logic (Team 3)
      └── images/
          ├── logo.png        # Website logo
          └── slideshow/      # Folder for homepage images
              ├── image1.jpg
              ├── image2.jpg
              └── image3.jpg


---

## 🚀 How to Work on This Project

1.  **Setup:** One person from the team should **fork** this repository and **invite** all other team members as collaborators (under Settings > Collaborators).
2.  **Clone:** Each team member should then clone the forked repository to their computer:
    ```bash
    git clone https://github.com/LimaJuni/webtoolkit-project
    ```
3.  **Create a Branch:** It's good practice to create a new branch for your feature:
    ```bash
    git checkout -b feature/navigation-bar
    ```
4.  **Code:** Work on your assigned files.
5.  **Commit & Push:** Regularly commit your changes and push them to your branch.
    ```bash
    git add .
    git commit -m "Added a responsive navigation bar"
    git push origin feature/navigation-bar
    ```
6.  **Pull Request:** When your feature is ready, create a Pull Request to merge your branch into the `main` branch. Another team member should review the code before merging.

---

## ✅ Final Goals

- [ ] A working navigation between all pages.
- [ ] A homepage with a welcome message and dynamic slideshow.
- [ ] A fully functional calculator.
- [ ] A phonebook that can Add, View, Search, and Delete contacts, saving data with `localStorage`.
- [ ] The website is styled and looks cohesive.
- [ ] The website is deployed online (e.g., using GitHub Pages).

**Let's build something awesome together! Good luck!**
