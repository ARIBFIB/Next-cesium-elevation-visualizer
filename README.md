# Next Cesium Elevation Visualizer - Desktop App

A full-stack desktop application built with **React** and **CesiumJS** that allows users to visualize geographic points in Pakistan, get elevation data, and compare elevations.

---

## 🖥️ Desktop Screenshots

### 1. Main Map View
![Main Map](https://github.com/user-attachments/assets/54012d7a-f58a-44d1-829d-7772c2d50a5b)

### 2. Elevation Info Panel
![Elevation Panel](https://github.com/user-attachments/assets/35d54d6c-d010-4043-88f6-bbab28c2e864)

### 3. Compare Elevations
![Compare Elevations](https://github.com/user-attachments/assets/f7964667-6c6d-43bf-b703-27bf7f845d3b)

### 4. Selected Point Details
![Selected Point](https://github.com/user-attachments/assets/b4008ffc-3fbd-403d-9bf0-40e5f23673ff)

### 5. Lower Elevation Points Visualization
![Lower Points](https://github.com/user-attachments/assets/64aa1a42-4eac-4deb-a5df-32443db4dcc4)

### 6. Comparison Result Panel
![Comparison Result](https://github.com/user-attachments/assets/27df1c53-d944-43ba-b4ae-9b8383f4bccd)

---

## 🚀 Features

- Interactive 3D map using **CesiumJS**
- Display geographic points of Pakistan
- Fetch and display **elevation** data of selected points
- Compare elevations within a specified distance
- Highlight points with **lower elevation** visually
- Desktop-ready interface

---

## 🔗 APIs Used

The application integrates the following APIs:

1. **Cesium Ion API**  
   - Used to render **3D terrain and base maps** in CesiumJS.  
   - Requires an API key which can be obtained from [Cesium Ion](https://cesium.com/ion/).  

2. **Custom Elevation API** (Backend)  
   - Built with **Node.js / Express** to fetch elevation data based on geographic coordinates.  
   - Example request:
     ```javascript
     fetch('https://your-backend.com/api/elevation', {
       method: 'POST',
       headers: {
         'Authorization': 'Bearer <YOUR_TOKEN>',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ latitude: 24.8607, longitude: 67.0011 })
     })
     .then(res => res.json())
     .then(data => console.log(data));
     ```

> **Security Note:** Replace any secret tokens with your own before using. Never expose production keys in public repositories.

---

## 📂 Project Structure

