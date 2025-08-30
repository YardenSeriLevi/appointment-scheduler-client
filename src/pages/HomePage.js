// src/pages/HomePage.js
import React from 'react';

// רכיב זה יזרוק שגיאת רינדור בכוונה
const BuggyComponent = () => {
  // הניסיון לקרוא את המאפיין 'name' מאובייקט null יגרום לקריסה
  const data = null;
  return <h1>{data.name}</h1>;
};

const HomePage = () => {
  return (
    <div>
      <h1>דף הבית</h1>
      <p>הכל אמור לעבוד כרגיל בחלק הזה.</p>
      <hr />
      <h2>אזור שאמור לקרוס:</h2>
      <BuggyComponent />
    </div>
  );
};

export default HomePage;