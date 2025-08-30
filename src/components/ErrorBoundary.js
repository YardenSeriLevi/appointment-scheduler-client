// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // State שמכיל מידע האם קרתה שגיאה או לא
    this.state = { hasError: false, error: null };
  }

  /**
   * מתודת מחזור חיים זו מופעלת לאחר שרכיב-בן זרק שגיאה.
   * היא מאפשרת לנו לעדכן את ה-State כדי שהרינדור הבא יציג את ה-UI החלופי.
   */
  static getDerivedStateFromError(error) {
    // עדכון ה-state כדי שהרינדור הבא יציג את ממשק המשתמש החלופי.
    return { hasError: true, error: error };
  }

  /**
   * מתודת מחזור חיים זו מופעלת לאחר שרכיב-בן זרק שגיאה.
   * היא משמשת לביצוע "תופעות לוואי" (side effects), כמו שליחת השגיאה למערכת ניטור.
   */
  componentDidCatch(error, errorInfo) {
    // את יכולה גם לשלוח את השגיאה לשירות ניטור שגיאות חיצוני
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // אם קרתה שגיאה, נציג את ה-UI החלופי שלנו
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>משהו השתבש.</h1>
          <p>אנו מצטערים על אי הנוחות. נסה לרענן את העמוד.</p>
          {/* לפיתוח, אפשר להציג את פרטי השגיאה */}
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ textAlign: 'left', background: '#f3f3f3', padding: '10px' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.error && this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    // אם לא קרתה שגיאה, פשוט נרנדר את הרכיבים הבנים כרגיל.
    return this.props.children;
  }
}

export default ErrorBoundary;