// src/components/IdleAnimation.jsx

import React, { useState, useEffect } from "react";

const IdleAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowAnimation(false);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    const checkIdle = setInterval(() => {
      if (Date.now() - lastActivity > 600000) { // 10 minutes
        setShowAnimation(true);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(checkIdle);
    };
  }, [lastActivity]);

  if (!showAnimation) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      cursor: "pointer"
    }} onClick={() => setShowAnimation(false)}>
      
      <div style={{
        position: "relative",
        width: "300px",
        height: "200px",
        marginBottom: "30px"
      }}>
        {/* Pan */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "120px",
          backgroundColor: "#2c3e50",
          borderRadius: "50%",
          border: "8px solid #34495e",
          animation: "panFlip 2s ease-in-out infinite",
          transformOrigin: "center bottom"
        }}>
          {/* Pan Handle */}
          <div style={{
            position: "absolute",
            right: "-60px",
            top: "50%",
            width: "50px",
            height: "8px",
            backgroundColor: "#8b4513",
            borderRadius: "4px",
            transform: "translateY(-50%)"
          }} />
        </div>

        {/* Eggs */}
        <div style={{
          position: "absolute",
          bottom: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "eggFlip 2s ease-in-out infinite"
        }}>
          {/* Egg 1 */}
          <div style={{
            position: "absolute",
            width: "25px",
            height: "30px",
            backgroundColor: "#fff",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            left: "-15px",
            top: "-10px",
            boxShadow: "inset 0 0 10px rgba(255,193,7,0.8)"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#ff6b35",
              borderRadius: "50%",
              position: "absolute",
              top: "8px",
              left: "8px"
            }} />
          </div>
          
          {/* Egg 2 */}
          <div style={{
            position: "absolute",
            width: "25px",
            height: "30px",
            backgroundColor: "#fff",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            right: "-15px",
            top: "-10px",
            boxShadow: "inset 0 0 10px rgba(255,193,7,0.8)"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#ff6b35",
              borderRadius: "50%",
              position: "absolute",
              top: "8px",
              left: "8px"
            }} />
          </div>
        </div>

        {/* Cooking Steam */}
        <div style={{
          position: "absolute",
          bottom: "140px",
          left: "50%",
          transform: "translateX(-50%)"
        }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${i * 15 - 15}px`,
              width: "4px",
              height: "20px",
              backgroundColor: "rgba(255,255,255,0.6)",
              borderRadius: "2px",
              animation: `steam 1.5s ease-in-out infinite ${i * 0.3}s`
            }} />
          ))}
        </div>
      </div>

      <div style={{
        color: "white",
        fontSize: "1.5em",
        fontWeight: "600",
        marginBottom: "10px",
        textAlign: "center"
      }}>
        🍳 Kitchen's Cooking!
      </div>
      
      <div style={{
        color: "rgba(255,255,255,0.8)",
        fontSize: "1em",
        textAlign: "center",
        maxWidth: "400px"
      }}>
        You've been idle for a while. Click anywhere to continue using Emporos Nexus POS.
      </div>

      <style jsx>{`
        @keyframes panFlip {
          0%, 100% { transform: translateX(-50%) rotateY(0deg); }
          50% { transform: translateX(-50%) rotateY(180deg); }
        }
        
        @keyframes eggFlip {
          0%, 100% { transform: translateX(-50%) rotateY(0deg) translateZ(0); }
          25% { transform: translateX(-50%) rotateY(45deg) translateZ(20px); }
          50% { transform: translateX(-50%) rotateY(180deg) translateZ(0); }
          75% { transform: translateX(-50%) rotateY(225deg) translateZ(20px); }
        }
        
        @keyframes steam {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-15px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default IdleAnimation;