// src/components/DecrypterText.jsx
import { useState, useEffect, useRef } from 'react';

export default function DecrypterText({ 
  text, 
  speed = 50, 
  className = '',
  startDelay = 0,
  scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  onComplete = null,
  autoStart = true
}) {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const scrambleCountRef = useRef(0);

  const decrypt = () => {
    if (isDecrypting) return;
    
    setIsDecrypting(true);
    indexRef.current = 0;
    scrambleCountRef.current = 0;
    
    const decryptInterval = setInterval(() => {
      let result = '';
      
      for (let i = 0; i < text.length; i++) {
        if (i < indexRef.current) {
          // Character is already decrypted
          result += text[i];
        } else if (i === indexRef.current) {
          // Current character being decrypted
          if (scrambleCountRef.current < 3) {
            // Show scrambled character
            result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            scrambleCountRef.current++;
          } else {
            // Reveal the actual character
            result += text[i];
            indexRef.current++;
            scrambleCountRef.current = 0;
          }
        } else {
          // Future characters - show scrambled
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      
      setDisplayText(result);
      
      if (indexRef.current >= text.length) {
        clearInterval(decryptInterval);
        setIsDecrypting(false);
        if (onComplete) onComplete();
      }
    }, speed);
    
    intervalRef.current = decryptInterval;
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText('');
    setIsDecrypting(false);
    indexRef.current = 0;
    scrambleCountRef.current = 0;
  };

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        decrypt();
      }, startDelay);
      
      return () => clearTimeout(timer);
    }
  }, [text, autoStart, startDelay]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span 
      className={`${className} font-mono cursor-pointer select-none`}
      onClick={!autoStart ? decrypt : undefined}
      style={{ 
        minHeight: '1.2em',
        display: 'inline-block',
        letterSpacing: '0.05em'
      }}
    >
      {displayText || (autoStart ? scrambleChars.substring(0, text.length).split('').map(() => 
        scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      ).join('') : text)}
    </span>
  );
}

// Advanced Decrypter Text with custom effects
export function AdvancedDecrypterText({ 
  text, 
  speed = 30,
  className = '',
  startDelay = 0,
  glowEffect = false,
  typewriterEffect = false,
  onComplete = null
}) {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const scrambleChars = '░▒▓█▄▀▐▌▆▉▊▋▍▎▏▓▒░';
  const hackChars = '01';

  useEffect(() => {
    if (startDelay > 0) {
      const timer = setTimeout(() => {
        startDecryption();
      }, startDelay);
      return () => clearTimeout(timer);
    } else {
      startDecryption();
    }
  }, []);

  const startDecryption = () => {
    setIsDecrypting(true);
    let index = 0;
    
    const decrypt = () => {
      if (index <= text.length) {
        let result = '';
        
        // Add decrypted characters
        result += text.substring(0, index);
        
        // Add random characters for remaining text
        for (let i = index; i < text.length; i++) {
          if (typewriterEffect && i > index + 3) {
            result += ' ';
          } else {
            result += Math.random() > 0.5 ? 
              hackChars[Math.floor(Math.random() * hackChars.length)] :
              scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }
        
        setDisplayText(result);
        setCurrentIndex(index);
        index++;
        
        if (index > text.length) {
          clearInterval(intervalRef.current);
          setDisplayText(text);
          setIsDecrypting(false);
          if (onComplete) onComplete();
        }
      }
    };
    
    intervalRef.current = setInterval(decrypt, speed);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span 
      className={`${className} font-mono select-none ${glowEffect ? 'animate-pulse' : ''}`}
      style={{ 
        textShadow: glowEffect ? '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00' : 'none',
        // color: glowEffect ? '#00ff00' : 'inherit'
      }}
    >
      {displayText}
      {isDecrypting && (
        <span className="animate-blink">|</span>
      )}
    </span>
  );
}

// Matrix-style Decrypter Text
export function MatrixDecrypterText({ 
  text, 
  speed = 40,
  className = '',
  startDelay = 0,
  onComplete = null
}) {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const matrixChars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ012345789';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      startDecryption();
    }, startDelay);
    
    return () => clearTimeout(timer);
  }, []);

  const startDecryption = () => {
    setIsDecrypting(true);
    let iterations = 0;
    
    const interval = setInterval(() => {
      let result = '';
      
      for (let i = 0; i < text.length; i++) {
        if (i < iterations) {
          result += text[i];
        } else {
          result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
      }
      
      setDisplayText(result);
      
      if (iterations >= text.length) {
        clearInterval(interval);
        setIsDecrypting(false);
        if (onComplete) onComplete();
      }
      
      iterations += 1 / 3;
    }, speed);
  };

  return (
    <span 
      className={`${className} font-mono select-none`}
      style={{ 
        // color: '#00ff00',
        // textShadow: '0 0 5px #00ff00'
      }}
    >
      {displayText}
    </span>
  );
}