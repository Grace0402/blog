'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

var MESSAGES = [
  '摸鱼中……',
  '困了……',
  '记得喝水喵~',
  '劳逸结合喵~',
  '想出去玩~',
  '无聊喵~'
];

var IDLE_TIMEOUT = 3 * 60 * 1000;
var BUBBLE_INTERVAL = 60 * 1000;
var DRAG_THRESHOLD = 5;
var DOUBLE_CLICK_MS = 350;
var PET_SIZE = 80;

var CAT_AWAKE = '/images/DesktopPet-Cat.png';
var CAT_SLEEPING = '/images/DesktopPet-Cat-Sleeping.png';
var CATGIRL = '/images/DesktopPet-CatGirl.png';

export default function DesktopPet() {
  var [isSleeping, setIsSleeping] = useState(true);
  var [form, setForm] = useState('cat');
  var [message, setMessage] = useState('');
  var [messageIdx, setMessageIdx] = useState(0);
  var [pos, setPos] = useState({ x: 0, y: 0 });
  var [initialized, setInitialized] = useState(false);

  var dragging = useRef(false);
  var dragStart = useRef({ x: 0, y: 0 });
  var startPos = useRef({ x: 0, y: 0 });
  var lastClickTime = useRef(0);
  var idleTimer = useRef(null);
  var bubbleTimer = useRef(null);
  var isSleepingRef = useRef(true);
  var formRef = useRef('cat');
  var messageIdxRef = useRef(0);

  // Keep refs in sync
  isSleepingRef.current = isSleeping;
  formRef.current = form;
  messageIdxRef.current = messageIdx;

  // Initialize position
  useEffect(function() {
    var updatePos = function() {
      setPos({
        x: window.innerWidth - PET_SIZE - 24,
        y: window.innerHeight - PET_SIZE - 24
      });
      setInitialized(true);
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    return function() { window.removeEventListener('resize', updatePos); };
  }, []);

  // Reset idle timer
  var resetIdleTimer = useCallback(function() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(function() {
      setIsSleeping(true);
      setForm('cat');
      setMessage('');
      if (bubbleTimer.current) clearInterval(bubbleTimer.current);
      bubbleTimer.current = null;
    }, IDLE_TIMEOUT);
  }, []);

  // Show next message
  var showNextMessage = useCallback(function() {
    var next = (messageIdxRef.current + 1) % MESSAGES.length;
    setMessageIdx(next);
    setMessage(MESSAGES[next]);
  }, []);

  // Wake up
  var wakeUp = useCallback(function() {
    if (isSleepingRef.current) {
      setIsSleeping(false);
      setForm('cat');
      setMessageIdx(0);
      setMessage('');
      resetIdleTimer();
      // Show first bubble after 3s
      setTimeout(function() {
        setMessage(MESSAGES[0]);
      }, 3000);
      // Start bubble timer
      if (bubbleTimer.current) clearInterval(bubbleTimer.current);
      bubbleTimer.current = setInterval(function() {
        var next = (messageIdxRef.current + 1) % MESSAGES.length;
        setMessageIdx(next);
        setMessage(MESSAGES[next]);
      }, BUBBLE_INTERVAL);
    }
  }, [resetIdleTimer]);

  // Bubble timer management when awake
  useEffect(function() {
    if (!isSleeping && !bubbleTimer.current) {
      resetIdleTimer();
      bubbleTimer.current = setInterval(function() {
        var next = (messageIdxRef.current + 1) % MESSAGES.length;
        setMessageIdx(next);
        setMessage(MESSAGES[next]);
      }, BUBBLE_INTERVAL);
    }
    if (isSleeping && bubbleTimer.current) {
      clearInterval(bubbleTimer.current);
      bubbleTimer.current = null;
    }
    return function() {
      if (bubbleTimer.current) clearInterval(bubbleTimer.current);
    };
  }, [isSleeping, resetIdleTimer]);

  // Cleanup all timers
  useEffect(function() {
    return function() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (bubbleTimer.current) clearInterval(bubbleTimer.current);
    };
  }, []);

  // Global mouse handlers for drag
  var handleGlobalMouseMove = useCallback(function(e) {
    if (!dragging.current) return;
    var newX = e.clientX - dragStart.current.x;
    var newY = e.clientY - dragStart.current.y;
    newX = Math.max(0, Math.min(newX, window.innerWidth - PET_SIZE));
    newY = Math.max(0, Math.min(newY, window.innerHeight - PET_SIZE));
    setPos({ x: newX, y: newY });
  }, []);

  var handleGlobalMouseUp = useCallback(function(e) {
    if (!dragging.current) return;
    dragging.current = false;

    var dx = Math.abs(e.clientX - dragStart.current.x - startPos.current.x);
    var dy = Math.abs(e.clientY - dragStart.current.y - startPos.current.y);

    // If barely moved, treat as click
    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
      var now = Date.now();
      if (now - lastClickTime.current < DOUBLE_CLICK_MS) {
        // Double click: toggle form (only when awake)
        if (!isSleepingRef.current) {
          setForm(function(f) { return f === 'cat' ? 'catgirl' : 'cat'; });
        }
        lastClickTime.current = 0;
      } else {
        lastClickTime.current = now;
        if (isSleepingRef.current) {
          wakeUp();
        } else {
          var next = (messageIdxRef.current + 1) % MESSAGES.length;
          setMessageIdx(next);
          setMessage(MESSAGES[next]);
          resetIdleTimer();
        }
      }
    }
  }, [wakeUp, resetIdleTimer, showNextMessage]);

  // Attach/detach global listeners
  useEffect(function() {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return function() {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  var handleMouseDown = function(e) {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    startPos.current = { x: pos.x, y: pos.y };
  };

  var imageSrc;
  if (isSleeping) {
    imageSrc = CAT_SLEEPING;
  } else {
    imageSrc = form === 'cat' ? CAT_AWAKE : CATGIRL;
  }

  if (!initialized) return null;

  return (
    <div
      className="fixed z-[9999] select-none"
      style={{
        left: pos.x + 'px',
        top: pos.y + 'px',
        width: PET_SIZE + 'px',
        height: PET_SIZE + 'px',
        cursor: 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {(message || isSleeping) && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2">
          <div className="relative bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs text-stone-700 dark:text-stone-200 shadow-md border border-white/40 dark:border-stone-700/40 whitespace-nowrap">
            {isSleeping ? (
              <span className="inline-flex items-baseline gap-[1px]">
                <span className="text-amber-500 font-bold" style={{ fontSize: '12px' }}>z</span>
                <span className="text-amber-500 font-bold" style={{ fontSize: '15px', marginTop: '-3px' }}>z</span>
                <span className="text-amber-500 font-bold" style={{ fontSize: '18px', marginTop: '-6px' }}>z</span>
              </span>
            ) : (
              message
            )}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 dark:border-t-stone-800/90" />
          </div>
        </div>
      )}

      <img
        src={imageSrc}
        alt="Desktop Pet"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}
