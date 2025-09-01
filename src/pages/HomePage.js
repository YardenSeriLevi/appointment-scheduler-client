// src/pages/HomePage.js
import React from 'react';
import { useAuth } from '../context/AuthContext'; // <-- 1. ייבוא

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // <-- 2. קבלת מצב ההתחברות

  return (
    <div>
      {isAuthenticated ? (
        // 3. מה להציג למשתמש מחובר
        <div>
          <h1>ברוך הבא!</h1>
          <p>כאן יוצג לוח השנה לקביעת תורים.</p>
          {/* נוסיף כאן את רכיב לוח השנה בשלב הבא */}
        </div>
      ) : (
        // 4. מה להציג למשתמש אורח
        <div>
          <h1>מערכת זימון תורים</h1>
          <p>נא להתחבר או להירשם כדי לקבוע תור.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;